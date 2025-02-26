# ACW103-JS-Light-Server

## About
This NodeJS app connects to the Obsidian EN12 light controller in the Transmedia Lab (ACW 103). Clients connect to the light server via websocket and can control the interactive lights in the room.

I recommend downloading the 'ACW103-Base-Lights' Max patch [here](https://ampd.apps01.yorku.ca/dmlabs/patches/) to get a sense of how the lights operate before creating your own applications.

## Installation

### Prerequisites

1. NodeJS - please install NodeJS following the instructions [here](https://nodejs.org/en/download)

### Installing The Light Server
1. Open a command line and navigate to directory with this repo
2. Run the command 'npm install'

## Running
1. Connect to the local network in ACW103. Ask the Lab Technician if you need the credentials.
2. Turn on the AV rack in the room.
3. Start the server by running the command 'npm main'
4. Go to the (P5.js sketch here)[https://editor.p5js.org/kmaraj6/sketches/Torc_Zdl0] to see how to connect to the Light Server and control the lights
