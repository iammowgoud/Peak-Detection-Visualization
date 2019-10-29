const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 4001;

const INTERVAL = 1500;
const sensorData = require('./data.json');

app.use(express.static(__dirname + '/public'));

io.connections = {};  //To keep track of connected clients

io.on('connection', (socket) => {
  const connectionId = socket.id;
  const sensorId = Number(socket.handshake.query['sensor']);
  console.log(`New client connected with id:${connectionId}`);

  // Add connection
  io.connections[connectionId] = {
    sensorId,
    index: 0,
    interval: setInterval(() => emitData(connectionId, socket), INTERVAL)
  };

  socket.on('disconnect', () => {
    clearInterval(io.connections[connectionId].interval)
    io.connections[connectionId] = undefined;

    console.log(`Client ${connectionId} disconnected`)
  });
});

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});

const emitData = (connectionId, socket) => {
  let conn = io.connections[connectionId];
  const { newIndex, response } = getNextReading(sensorData[conn.sensorId - 1], conn.index);

  console.log(`Emitted to client: ${connectionId}, sensor id:${conn.sensorId}, index:  ${conn.index}`);

  socket.emit("reading", JSON.stringify(response));

  conn.index = newIndex;
};


const getNextReading = (data, index) => {
  response = {
    timestamp: Date.now(),
    value: data.readings[index],
    zscore: data.zScores[index]
  };

  return { newIndex: (index + 1) % data.readings.length, response };
};
