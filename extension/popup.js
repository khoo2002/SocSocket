document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['currentTask', 'clientId'], function(result) {
        const taskContainer = document.getElementById('task-container');
        const clientIdContainer = document.getElementById('client-id-container');
        
        if (result.currentTask) {
            taskContainer.textContent = result.currentTask;
        } else {
            taskContainer.textContent = 'No task received yet.';
        }

        if (result.clientId) {
            clientIdContainer.textContent = result.clientId;
        } else {
            clientIdContainer.textContent = 'No client ID received yet.';
        }
    });
});
