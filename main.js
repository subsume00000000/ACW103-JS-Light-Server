import { WebSocketServer } from 'ws';
import Artnet from 'artnet';
import { argv } from 'node:process';

let args = argv.slice(2);
console.log(args);

let ws_socket = null;
let controller_address = null;

for(let i = 0; i < args.length; i++){
    let arg = args[i];

    if(arg == '-wsport'){
        ws_socket = args[i+1];
    }

    if(arg == '-controlleraddress'){
        controller_address = args[i+1]
    }
}

const WEBSOCKET_PORT = ws_socket || 9500;
const wss = new WebSocketServer({port: WEBSOCKET_PORT});
const OBSIDIAN_ADDRESS = controller_address || '192.168.1.2'

let obsidian_options = {
    host: OBSIDIAN_ADDRESS
}


let artnet = connectToArtnet(obsidian_options);
let artnetConnected = true;

let numConnections = 0;

wss.on("connection", function connection(ws) {

    ws.on('error', console.error);

    ws.on('message', function message(data){
        console.log(`Received: ${data}`);

        const decoder = new TextDecoder();
        data = decoder.decode(data);

        if(data === 'close'){
            console.log('closing');
            artnet.close();
            artnetConnected = false;
        }else{
            data = data.split(",");
        }

        if(Array.isArray(data)){

            if(data.length < 3){
                ws.send("Error: Incorrectly formatted data - sent data did not include universe, channel, and value")
            }

            if(data.length === 3){
                // console.log('Array of length 3!')
                let sendFlag = true;

                for(let i = 0; i < data.length; i++){
                    if(isNaN(data[i])){
                        sendFlag = false;
                        ws.send("Error: Incorrectly formatted data - all values must be numeric data")
                        break;
                    }
                }

                let universe = parseInt(data[0]);
                let channel = parseInt(data[1]);
                let value = parseInt(data[2]);

                if(sendFlag === true){
                    // console.log([universe, channel, value]);
                    if(!artnetConnected){
                        artnet = connectToArtnet(obsidian_options);
                        artnetConnected = true;
                    }

                    artnet.set(universe, channel, value);
                }
            }

            if(data.length > 3){
                // console.log('Array greater than 3!')
                let sendFlag = true;
                let universe = null;
                let newData = []

                for(let i = 0; i < data.length; i++){
                    if(isNaN(data[i])){
                        sendFlag = false;
                        ws.send("Error: Incorrectly formatted data - all values must be numeric data")
                        break;
                    }

                    if(i === 0){
                        universe = parseInt(data[i]);
                    }else{
                        newData.push(parseInt(data[i]))
                    }
                }

                if(sendFlag === true){
                    if(!artnetConnected){
                        artnet = connectToArtnet(obsidian_options);
                        artnetConnected = true;
                    }

                    artnet.set(universe, newData);
                }
            }
        }
    });

    ws.on('close', function close(){
        numConnections--;
        console.log('Client disconnected');
        console.log(`Total number of connections: ${numConnections}`);
    })

    ws.send('Connected to Light Server');

    numConnections++;
    console.log(`New connection received`);
    console.log(`Total number of connections: ${numConnections}`);
});

console.log("Light server listening on port: ", WEBSOCKET_PORT);
console.log("Sending to Obsidian EN12 controller at: ", OBSIDIAN_ADDRESS);

function connectToArtnet(options){
    let newConnection = new Artnet(options);
    return newConnection
}
