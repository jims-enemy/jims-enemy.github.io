import asyncio
import websockets

async def echo(websocket, path):
    async for message in websocket:
        print(f"Received message from p5.js: {message}")
        # Send a reply back to p5.js
        await websocket.send("Hello from Python!\n")

async def main():
    server = await websockets.serve(echo, "localhost", 8000)
    print("WebSocket server started!")
    await server.wait_closed()

asyncio.run(main())