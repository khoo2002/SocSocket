let ws;

// Function to establish a WebSocket connection
function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8765');

    ws.onopen = function(event) {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = function(event) {
        console.log('Received message from server:', event.data);
        const message = JSON.parse(event.data);

        if (message.client_id) {
            console.log('Received client ID:', message.client_id);
            chrome.storage.local.set({ 'clientId': message.client_id }, function() {
                console.log('Client ID stored locally.');
            });
        } else if (message.task) {
            console.log('Received task:', message.task, '; Task Id:', message.task_id);
            chrome.storage.local.set({ 'currentTask': message.task }, function() {
                console.log('Task stored locally.');
            });
            // notifyUser(message.task);
            // Call handleTask and handle the result
            
            handleTask(message.task_id, message.task, message.searchText, message.numberOfResults)
                .then(result => {
                    console.log('Task result:', result);
                })
                .catch(error => {
                    console.error('Error handling task:', error);
                });
        }
    };

    ws.onerror = function(error) {
        console.log('WebSocket error:', error);
    };

    ws.onclose = function(event) {
        console.log('Disconnected from WebSocket server. Reconnecting...');
        setTimeout(connectWebSocket, 1000);  // Reconnect after 1 second
    };
}

// Function to handle tasks based on the received message
async function handleTask(task_id, task, searchText, numberOfResults) {
    let videoData;
    return new Promise((resolve, reject) => {
        if (task === 'Tiktok') {
            chrome.tabs.create({ url: 'https://www.tiktok.com/en' }, async (tab) => {
                function handleTabUpdate(tabId, changeInfo) {
                    if (tabId === tab.id && changeInfo.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(handleTabUpdate); // Remove listener to avoid multiple calls

                        // Execute search script
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: async function(query) {
                                if (typeof tiktokPerformSearch === 'function') {
                                    await tiktokPerformSearch(query);
                                } else {
                                    console.error('tiktokPerformSearch function not found');
                                }
                            },
                            args: [searchText]
                        }).then(() => {
                            // After search, wait for the page to reload and then navigate to Top tab
                            chrome.tabs.onUpdated.addListener(async function onTabUpdated(tabId, changeInfo) {
                                if (tabId === tab.id && changeInfo.status === 'complete') {
                                    chrome.tabs.onUpdated.removeListener(onTabUpdated); // Remove listener to prevent repeated calls

                                    // Navigate to Top tab
                                    await chrome.scripting.executeScript({
                                        target: { tabId: tab.id },
                                        func: async function() {
                                            if (typeof tiktokGotoTabs === 'function') {
                                                await tiktokGotoTabs('tab', 'Top');
                                            } else {
                                                console.error('tiktokGotoTabs function not found');
                                            }
                                        }
                                    });

                                    // Fetch video data
                                    await chrome.scripting.executeScript({
                                        target: { tabId: tab.id },
                                        func: async function(numberOfResults, task_id) {
                                            if (typeof fetchVideoDataUntil === 'function') {
                                                const videoData = await fetchVideoDataUntil(numberOfResults);
                                                console.log('Fetched Video Data:', videoData);
                                                console.log('Task id:', task_id);
                                                // Send results back to background script
                                                // chrome.runtime.sendMessage({ type: 'videoData', data: videoData});
                                                chrome.runtime.sendMessage({ type: 'videoData', data: videoData, task: task_id});
                                                // Send video data to the WebSocket server or handle it as needed
                                                // if (ws && ws.readyState === WebSocket.OPEN) {
                                                //     console.log('Sending video data to WebSocket server:', videoData);
                                                //     ws.send(JSON.stringify({ type: 'videoData', data: videoData }));
                                                // } else {
                                                //     console.error('WebSocket is not open or not connected.');
                                                // }                                                
                                                return videoData;
                                            } else {
                                                console.error('fetchVideoDataUntil function not found');
                                                return null;
                                            }
                                        },
                                        args: [numberOfResults,task_id]
                                    }).then((result) => {
                                        resolve(result);
                                    }).catch(reject);
                                }
                            });
                        });
                    }
                }

                chrome.tabs.onUpdated.addListener(handleTabUpdate); // Add listener for initial tab updates
            });
        } else if (task === 'Facebook') {
            chrome.tabs.create({ url: 'https://www.facebook.com/' }, (tab) => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['facebook-login.js']
                });
            });
        } else {
            performSearch(task)
                .then(results => {
                    sendSearchResults(results);
                    resolve(results);
                })
                .catch(error => {
                    console.error('Error performing search:', error);
                    reject(error);
                });
        }
    });
}

// Function to perform the search using Chrome Search API
function performSearch(query) {
    return new Promise((resolve, reject) => {
        chrome.search.query({ disposition: "NEW_TAB", text: query }, (tab) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError.message);
            } else {
                chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
                    if (tabId === tab.id && changeInfo.status === 'complete') {
                        chrome.tabs.executeScript(tabId, {
                            code: `
                                (function() {
                                    const results = Array.from(document.querySelectorAll('h3')).map(el => el.innerText);
                                    return results;
                                })();
                            `
                        }, (results) => {
                            chrome.tabs.onUpdated.removeListener(listener);
                            resolve(results ? results[0] : []);
                        });
                    }
                });
            }
        });
    });
}

// Function to send search results back to the server
function sendSearchResults(results) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'results', results }));
    }
}

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in background script:', message);
    if (message.type === 'videoData') {
        console.log('Received video data from content script:', message.data);
        // You can handle the video data here or send it to the WebSocket server
        if (ws && ws.readyState === WebSocket.OPEN) {
            // ws.send(JSON.stringify({ type: 'videoData', data: message.data}));
            ws.send(JSON.stringify({ type: 'videoData', data: message.data, taskId: message.task}));
        }
    }
});

// Establish the WebSocket connection
connectWebSocket();
