async function sendMessage() {
    const task = document.getElementById('message-input').value;
    const clientId = document.getElementById('ClientID-input').value;
    
    if (clientId && task) {
        const response = await fetch(`/send_task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId, task }),
        });

        if (response.ok) {
            alert('Task sent successfully!');
        } else {
            alert('Failed to send task.');
        }
    }
}

async function sendTask() {
    const task = document.getElementById('task-input').value;
    const searchText = document.getElementById('searchText-input').value;
    const numberOfResults = document.getElementById('numberOfResults-input').value;
    const clientId = document.getElementById('ClientID-input').value;
    
    if (clientId && task) {
        const response = await fetch(`/send_task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clientId, task, searchText, numberOfResults}),
        });

        if (response.ok) {
            alert('Task sent successfully!');
        } else {
            alert('Failed to send task.');
        }
    }
}

