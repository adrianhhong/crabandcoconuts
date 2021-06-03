import { Socket } from 'socket.io';
import { server as serverConfig } from './config';

const app = require('express')();
const server = require('http').createServer(app);

const options = {
  /* ... */
};
const io = require('socket.io')(server, options);

io.on('connection', (socket: Socket) => {
  console.log('Client connected');
  console.log(socket);
  const { username, roomId, roomAction } = socket.handshake.query;
  console.log(username, roomId, roomAction);
});

server.listen(serverConfig.socketPort, () => {
  // logger.info(`Api listening on port ${Number(API_PORT)}!`);
  console.log(`Socker listening on port ${serverConfig.socketPort}!`);
});
// WARNING !!! app.listen(3000); will not work here, as it creates a new HTTP server

app.listen(serverConfig.apiPort, () => {
  // logger.info(`Api listening on port ${Number(API_PORT)}!`);
  console.log(`Api listening on port ${serverConfig.apiPort}!`);
});
