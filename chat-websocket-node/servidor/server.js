const WebSocket = require("ws");
const readline = require("readline");

const wss = new WebSocket.Server({ port: 8765 });
const clients = new Map();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

wss.on("connection", function connection(ws) {
  ws.send("[Servidor]: Por favor, ingresa tu nombre de usuario:");

  let username = null;

  ws.on("message", function incoming(message) {
    if (!username) {
      username = message.toString();
      clients.set(ws, username);
      broadcast(
        `[Servidor]: El usuario "${username}" se ha unido al chat.`,
        ws
      );
      return;
    }

    const formatted = `${username}: ${message}`;
    broadcast(formatted, ws);
  });

  ws.on("close", function () {
    if (username) {
      clients.delete(ws);
      broadcast(`[Servidor]: El usuario "${username}" ha salido del chat.`);
    }
  });
});

function broadcast(message, sender = null) {
  for (const [client] of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
  console.log(message);
}

console.log("Servidor WebSocket iniciado en ws://localhost:8765");

// Leer mensajes desde la consola del servidor
rl.on("line", (line) => {
  if (line.trim()) {
    const serverMessage = `[Servidor]: ${line.trim()}`;
    broadcast(serverMessage);
  }
});
