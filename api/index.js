const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 4001;

const INTERVAL = 2000;

app.use(express.static(__dirname));

io.connections = {};

io.on('connection', (socket) => {
  const connectionId = socket.id
  const sensorId = Number(socket.handshake.query['sensor']);
  console.log(`New client connected with id:${connectionId}`);

  io.connections[connectionId] = {
    sensorId,
    init: true,
    index: 0,
    interval: setInterval(() => emitData(connectionId, socket), INTERVAL),
  }

  socket.on('disconnect', () => {
    clearInterval(io.connections[connectionId].interval)
    io.connections[connectionId] = undefined;

    console.log(`Client ${connectionId} disconnected`)
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

emitData = (connectionId, socket) => {
  let conn = io.connections[connectionId]
  console.log(`emitted to sensor id:${conn.sensor}, index:  ${conn.index}, init: ${conn.init}`);
  socket.emit("chartData", ` to sensor id:${conn.sensorId}, index:  ${conn.index}, init: ${conn.init}`)
  conn.init = false;
  conn.index++;
}