# Socscraper - WebSocket Server Dashboard

This project is a WebSocket server dashboard that allows you to manage and send tasks to connected clients. The project is divided into two main parts: the server and the extension.

## Project Structure
```
extension/
├── background.js
├── content.js
├── facebook-login.js
├── manifest.json
├── popup.html
├── popup.js
└── tiktok.js
server/
├── requirements.txt
├── server.py
├── static/
│   └── app.js
├── templates/
│   ├── index.html
│   └── tasklist.html
testWebSocket.py
task_data/
├── 28a61b71-da36-4a5b-bc52-036b25cacfb7.json
```

## Getting Started

### Prerequisites

- Python 3.x

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-repo/websocket-server-dashboard.git
    cd websocket-server-dashboard
    ```

2. Install the server dependencies:

    ```sh
    cd server
    pip install -r requirements.txt
    ```

3. Run the server:

    ```sh
    python server.py
    ```

4. Open your browser and navigate to `http://localhost:5000` to access the dashboard.

### Server

The server is implemented in Python and uses asynchronous functions to handle tasks and client connections.

- [`server/server.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fserver%2Fserver.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\server\server.py"): Contains the main server logic.
  - `get_task_data(task_id)`: Fetches task data by task ID.
  - `list_tasks()`: Lists all tasks available in the [`task_data`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Ftask_data%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\task_data") directory.

### Frontend

The frontend is implemented using HTML and JavaScript.

- [`server/templates/index.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fserver%2Ftemplates%2Findex.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\server\templates\index.html"): The main dashboard page.
- [`server/static/app.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fserver%2Fstatic%2Fapp.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\server\static\app.js"): Contains JavaScript functions to interact with the server.
  - `sendMessage()`: Sends a message to a specific client.

### Extension

The extension part contains various scripts and HTML files to interact with different platforms.

- [`extension/background.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fextension%2Fbackground.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\extension\background.js"): Background script for the extension.
- [`extension/content.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fextension%2Fcontent.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\extension\content.js"): Content script for the extension.
- [`extension/facebook-login.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fextension%2Ffacebook-login.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\extension\facebook-login.js"): Script for Facebook login.
- [`extension/popup.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fextension%2Fpopup.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\extension\popup.html"): HTML for the extension popup.
- [`extension/popup.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fextension%2Fpopup.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\extension\popup.js"): JavaScript for the extension popup.
- [`extension/tiktok.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fkhooz%2FDownloads%2FInternship%2FchromeSocket%2Fextension%2Ftiktok.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "c:\Users\khooz\Downloads\Internship\chromeSocket\extension\tiktok.js"): Script for TikTok interactions.

## Usage

### Sending a Message

1. Open the dashboard.
2. Enter the client ID and the message in the respective input fields.
3. Click the "Send" button to send the message.

### Listing Tasks

1. Open the dashboard.
2. The list of tasks will be displayed automatically.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.