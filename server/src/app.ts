import { Socket, Server } from 'socket.io';
import express from 'express';
import http from 'http';

import Room from './socket/roomManager';
import { server as serverConfig } from './config';
// import { Handshake } from './types';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', async (socket: Socket) => {
  console.log('Client connected');
  const { adapter } = io.of('/'); // https://socket.io/docs/v4/rooms/ adapter object that holds all the room information

  const username = socket.handshake.query.username as string;
  const roomId = socket.handshake.query.roomId as string;
  const enterRoomAction = socket.handshake.query
    .enterRoomAction as string;
  const room = new Room({
    socket,
    adapter,
    username,
    roomId,
    enterRoomAction,
  });
  const createdRoomSuccesfully = await room.init(username);
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
