import os
import asyncio
import websockets
from gemini.gemini import g_model
from gemini.geminivision import*
import requests
import io
from PIL import Image
import time
import re
import csv
import pandas as pd
from main import *
import shutil

def list_files(directory):
    try:
        # List all files and directories in the given directory
        files = os.listdir(directory)
        
        # Filter out only the file names (exclude directories)
        file_names = [file for file in files if os.path.isfile(os.path.join(directory, file))]
        
        return file_names
    except Exception as e:
        print(f"Error listing files in directory '{directory}': {str(e)}")
        return []

async def save_file(websocket, path):
    try:
        # Receive the file name from the client
        file_name = await websocket.recv()
        file_path = os.path.join(path, file_name)

        # Receive and save the file data from the client
        with open(file_path, "wb") as file:
            while True:
                data = await websocket.recv()
                if data == "EndOfFile":
                    break
                file.write(data)

        await websocket.send(f"File '{file_name}' uploaded successfully")
    except Exception as e:
        await websocket.send(f"Error uploading file: {str(e)}")

async def handle_client(websocket, path):
    # Specify the directory where files will be saved
    try:
        while True:
            message = await websocket.recv()
            if "user1"==message:
                file_dir = "user1/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)

            elif "user2"==message:
                file_dir = "user2/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user3"==message:
                file_dir = "user3/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user4"==message:
                file_dir = "user4/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user5"==message:
                file_dir = "user5/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user6"==message:
                file_dir = "user6/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user7"==message:
                file_dir = "user7/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user8"==message:
                file_dir = "user8/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            elif "user9"==message:
                file_dir = "user9/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)

            elif "user10"==message:
                file_dir = "user10/data"
                os.makedirs(file_dir, exist_ok=True)
                await save_file(websocket, file_dir)
            else:
                print("Received message:", message, " ", message[6:])
                user = message[:5]
                message = message[6:]
                msg = message[-4:]
                # Combine prompt and context with the new message
                if message=="train":
                    text = user
                if message=="delete":
                    shutil.rmtree(user+"/data")

                    text="deleted"
                if message=="files":
                    file_names = list_files(user+"/data")
                    text=file_names

                else:
                    text=message
                
                await websocket.send(text)
    except websockets.exceptions.ConnectionClosedOK:
        print("Client connection closed")

def start_server(host, port):
    server = websockets.serve(handle_client, host, port)
    print(f"Server is listening on {host}:{port}")
    asyncio.get_event_loop().run_until_complete(server)
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    start_server('127.0.0.1', 12345)
