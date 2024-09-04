console.log('tiktok.js loaded');

// Content script sends a message


async function waitForElement(selector, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = 500;

        function check() {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`Element with selector "${selector}" not found within timeout`));
            } else {
                setTimeout(check, interval);
            }
        }

        check();
    });
}

// Function to perform a search action
async function tiktokPerformSearch(query) {
    console.log("You are executing tiktokPerformSearch..")
    // Select the form with the action attribute set to "/search"
    const searchElement = await waitForElement(".search-input");
    console.log(searchElement);
    if(searchElement){
        const form = document.querySelector('form[action="/search"]');
        if (form) {
            // Select the search input element within the form
            const searchInput = form.querySelector('input[name="q"]');
            if (searchInput) {
                searchInput.value = query; // Set the search query
            } else {
                console.error('Search input not found');
                return;
            }

            // Optionally, submit the form
            form.submit(); // This will submit the form
        } else {
            console.error('Form with action="/search" not found');
        }
    }
    
}

// Example usage of the function
// tiktokPerformSearch('Anwar Ibrahim');


// Function to perform a search action
async function tiktokGotoTabs(role,text) {
    // Select the form with the action attribute set to "/search"
    // Get all elements with the specified role
    console.log("You are executing tiktokGotoVideo..")
    const tabElement = await waitForElement(`div[role="${role}"]`);
    console.log(tabElement);
    if(tabElement){
        const elements = document.querySelectorAll(`div[role="${role}"]`);
        console.log(elements);
        // Loop through the elements to find the one with the matching inner text
        for (let element of elements) {
            if (element.textContent.trim() === text) {
                // Example usage
                console.log('Found element:', element);
                // Perform actions with the selected element
                element.click(); // Example action: clicking the tab
                break;
            }
        }
    }else{
        // If no matching element is found, return null
        return null;
    }
}

// tiktokGotoTabs('tab','Videos');

function tiktokRemoveTopUsersSection() {
    // Select the <h2> element with the inner HTML "Users"
    const h2Element = document.querySelector('h2[data-e2e="search-top-user-title"]');

    // Check if the <h2> element is found
    if (h2Element && h2Element.innerHTML.trim() === 'Users') {
        // Get the parent of the <h2> element
        const parentElement = h2Element.parentElement;

        // Get the parent of the parent element
        const grandparentElement = parentElement ? parentElement.parentElement : null;

        // Return or log the grandparent element
        grandparentElement.remove();
    } else {
        console.error('Element with the specified inner HTML not found');
        return null;
    }
}

// tiktokRemoveTopUsersSection();
// Function to extract video data using stable attributes
function extractVideoData() {
    const videoData = [];
    const parentContainer = document.querySelector('div[data-e2e="search_top-item-list"]');

    if (!parentContainer) {
        console.warn('Parent container not found');
        return [];
    }

    const postContainers = parentContainer.querySelectorAll('div[data-e2e="search_top-item"]');
    
    postContainers.forEach(postContainer => {
        const descContainer = postContainer.parentElement.querySelector('div[data-e2e="search-card-desc"]');

        if (!descContainer) {
            console.error('Missing description container for one of the post containers');
            return;
        }

        // Extract video link from the top item container
        const videoLinkElement = postContainer.querySelector('a[href^="https://www.tiktok.com/"]');
        const videoLink = videoLinkElement ? videoLinkElement.href : '';
        const videoIdMatch = videoLink.match(/video\/(\d+)$/);
        const videoId = videoIdMatch ? videoIdMatch[1] : '';

        // Extract profile link, username, and views from the description container
        const profileLinkElement = descContainer.querySelector('a[data-e2e="search-card-user-link"]');
        const profileLink = profileLinkElement ? 'https://www.tiktok.com' + profileLinkElement.getAttribute('href') : '';
        const usernameElement = profileLinkElement ? profileLinkElement.querySelector('p[data-e2e="search-card-user-unique-id"]') : null;
        const username = usernameElement ? usernameElement.textContent.trim() : '';
        const viewsElement = descContainer.querySelector('.css-ws4x78-StrongVideoCount');
        const views = viewsElement ? viewsElement.textContent.trim() : '';

        // Extract alt text from the top item container
        const imgAltElement = postContainer.querySelector('img[alt]');
        const altFromImage = imgAltElement ? imgAltElement.alt : '';

        // Extract date from the top item container
        const dateElement = postContainer.querySelector('.css-dennn6-DivTimeTag');
        const date = dateElement ? dateElement.textContent.trim() : '';

        // Construct the video data object
        videoData.push({
            video_id: videoId,
            username: username,
            profile_link: profileLink,
            alt_from_image: altFromImage,
            views: views,
            dates: date,
            video_links: videoLink
        });
    });

    console.log('Extracted Video Data:', videoData);
    return videoData;
}

// Function to simulate scrolling down or up by a specific amount
function scroll(amount) {
    window.scrollBy(0, amount);
}

// Function to simulate human-like scrolling behavior
function humanLikeScroll(scrollDirection = 'down', minScroll = 1000, maxScroll = 1500) {
    const scrollAmount = Math.floor(Math.random() * (maxScroll - minScroll + 1)) + minScroll;
    scrollDirection === 'down' ? scroll(scrollAmount) : scroll(-scrollAmount);
}

// Function to simulate a human-like rest period
function humanLikeRest(minRest = 500, maxRest = 2000) {
    return new Promise(resolve => {
        const restTime = Math.floor(Math.random() * (maxRest - minRest + 1)) + minRest;
        setTimeout(resolve, restTime);
    });
}

// Function to mimic human interaction for fetching video data until a certain count is reached
async function fetchVideoDataUntil(minNumberOfVideos, timeout = 60000) {
    let videoData = [];
    const seenVideoIds = new Set();
    let previousCount = 0;
    let startTime = Date.now();
    
    while (videoData.length < minNumberOfVideos && (Date.now() - startTime) < timeout) {
        // Extract video data
        const newVideoData = extractVideoData();
        
        // Filter out duplicates
        const filteredNewVideoData = newVideoData.filter(video => {
            if (seenVideoIds.has(video.video_id)) {
                return false;
            }
            seenVideoIds.add(video.video_id);
            return true;
        });
        
        videoData = videoData.concat(filteredNewVideoData);
        
        // Check if the number of videos is sufficient
        if (videoData.length >= minNumberOfVideos) {
            return videoData;
        }
        
        // Check if no new data is being added
        if (videoData.length === previousCount) {
            console.warn('No new data found, attempting to scroll more.');
        }
        previousCount = videoData.length;
        
        // Simulate scrolling down
        humanLikeScroll('down');
        await humanLikeRest();
        
        // Recheck the number of posts
        const currentPostCount = document.querySelectorAll('div[data-e2e="search_top-item"]').length;
        
        // If no new posts are loaded, scroll up and wait
        if (currentPostCount <= previousCount) {
            humanLikeScroll('up',100,200);
            await humanLikeRest();
        }
    }
    
    // Handle timeout
    if (videoData.length < minNumberOfVideos) {
        throw new Error('Failed to fetch the required number of videos within the time limit');
    }
    
    // console.log('type of videoData:',typeof videoData);
 
    const result = videoData;
    sendVideoData(result);
    return videoData;
}

// Ensure this function is called with the correct data
function sendVideoData(videoData) {
    chrome.runtime.sendMessage({ type: 'videoData', data: videoData });
}

// Example usage
// const videoData = [{halo:"halo"}];
// sendVideoData(videoData);

// Example usage
// fetchVideoDataUntil(80).then(videoData => {
//     console.log('Extracted Video Data:', videoData);
// }).catch(error => {
//     console.error('Error:', error);
// });
