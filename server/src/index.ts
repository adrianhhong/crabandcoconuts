import { Socket } from 'socket.io';
import { RoomType } from '@/types';
import Room from '@/socket/roomManager';
import { server as serverConfig } from '@/config';

const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket: Socket) => {
  console.log('Client connected');
  const { adapter } = io.of('/'); // https://socket.io/docs/v4/rooms/ adapter object that holds all the room information
  const { username, roomId, createRoom } = socket.handshake.query;
  const room = new Room({
    socket,
    adapter,
    username,
    roomId,
    createRoom,
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
