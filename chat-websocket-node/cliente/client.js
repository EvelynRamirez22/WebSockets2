const WebSocket = require('ws');
const readline = require('readline');

const ws = new WebSocket('ws://localhost:8765');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
});

let usernameSet = false;

ws.on('open', () => {
    // Esperamos el mensaje del servidor
});

ws.on('message', (data) => {
    const message = data.toString();
    console.log(message);

    if (message.startsWith('[Servidor]: Por favor, ingresa tu nombre de usuario:')) {
        rl.question('', (name) => {
            ws.send(name);
            usernameSet = true;
        });
    }
});

rl.on('line', (line) => {
    if (ws.readyState === WebSocket.OPEN && usernameSet) {
        if (line.trim().toLowerCase() === '/salir') {
            ws.close();
            rl.close();
        } else {
            ws.send(line);
        }
    }
});

ws.on('close', () => {
    console.log('[Cliente]: Conexión cerrada.');
    process.exit(0);
});
