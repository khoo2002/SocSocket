from quart import Quart, render_template, request, send_file
import asyncio
import json
import uuid
import websockets
import os

app = Quart(__name__)

clients = {}

# Create a directory for storing task data if it doesn't exist
DATA_DIR = 'task_data'
os.makedirs(DATA_DIR, exist_ok=True)

@app.route('/')
async def index():
    return await render_template('index.html', clients=clients)

@app.route('/tasklist')
async def tasklist():
    return await render_template('tasklist.html')

@app.route('/tasks')
async def list_tasks():
    try:
        # List all JSON files in the task_data directory
        task_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.json')]
        # Extract task IDs from filenames
        task_ids = [os.path.splitext(f)[0] for f in task_files]
        # Sort tasks with the latest on top
        task_ids.sort(reverse=True)
        return {'tasks': task_ids}
    except Exception as e:
        print(f"Error listing tasks: {e}")
        return {'tasks': []}

@app.route('/task_data/<task_id>.json')
async def get_task_data(task_id):
    try:
        file_path = os.path.join(DATA_DIR, f"{task_id}.json")
        if os.path.exists(file_path):
            return await send_file(file_path, mimetype='application/json')
        else:
            return 'Task not found', 404
    except Exception as e:
        print(f"Error serving task data: {e}")
        return 'Internal Server Error', 500

async def register_client(ws):
    client_id = str(uuid.uuid4())
    clients[client_id] = {'websocket': ws, 'ip': ws.remote_address[0]}
    await ws.send(json.dumps({"client_id": client_id}))
    return client_id

async def handle_client(ws, path):
    client_id = await register_client(ws)
    # print(f"Client {client_id} connected from {clients[client_id]['ip']}")

    try:
        async for message in ws:
            data = json.loads(message)
            # print(f"Received message from client {client_id}: {data}")
            if 'type' in data and data['type'] == 'register':
                await ws.send(json.dumps({"client_id": client_id}))
            elif 'task' in data:
                await handle_task(data['task'], client_id)
            elif 'results' in data:
                print(f"Results from {client_id}: {data['results']}")
            elif 'type' in data and data['type'] == 'videoData':
                task_id = data.get('taskId')
                video_data = data.get('data')
                if task_id and video_data:
                    # Save video data to a file
                    file_path = os.path.join(DATA_DIR, f"{task_id}.json")
                    with open(file_path, 'w') as file:
                        json.dump(video_data, file, indent=4)
                    print(f"Video Data from Client {client_id} | Task Id: {task_id} | Data: {video_data}")
    except websockets.exceptions.ConnectionClosed:
        print(f"Client {client_id} disconnected")
        del clients[client_id]

async def handle_task(task, client_id):
    print(f"Received task from {client_id}: {task}")
    # Process the task here

async def start_websocket_server():
    async with websockets.serve(handle_client, "localhost", 8765):
        await asyncio.Future()  # Run forever

@app.route('/send_task', methods=['POST'])
async def send_task():
    try:
        data = await request.get_json()
        client_id = data['clientId']
        task = data['task']
        searchText = None
        numberOfResults = None 
        if 'searchText' in data and 'numberOfResults' in data:
            searchText = data['searchText']
            numberOfResults = data.get('numberOfResults', None)

        task_id = str(uuid.uuid4())  # Generate a unique task ID

        print(f"Attempting to send task to client {client_id}: {task}")

        if client_id in clients:
            websocket_client = clients[client_id]['websocket']
            if websocket_client.open:
                print(f"Sending task to client {client_id} with IP address {clients[client_id]['ip']}")
                try:
                    message = {'task_id': task_id, 'task': task}
                    if searchText is not None and numberOfResults is not None:
                        message.update({'searchText': searchText, 'numberOfResults': int(numberOfResults)})
                    
                    await websocket_client.send(json.dumps(message))
                    print(f"Task sent to client {client_id}")
                    return '', 200
                except Exception as e:
                    print(f"Error sending task to client {client_id}: {e}")
                    return 'Failed to send task', 500
            else:
                print(f"WebSocket for client {client_id} is not open")
                del clients[client_id]
                return 'Client WebSocket is closed', 400
        else:
            print(f"Client {client_id} not found")
            del clients[client_id]
            return 'Client not found', 404
    except Exception as e:
        print(f"Error occurred: {e}")
        return 'Internal Server Error', 500



async def main():
    # Start the WebSocket server
    websocket_server = asyncio.create_task(start_websocket_server())
    
    # Start the Quart server
    await asyncio.gather(
        app.run_task(host="0.0.0.0", port=5000, debug=True),
        websocket_server
    )

if __name__ == "__main__":
    asyncio.run(main())
