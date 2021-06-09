import { Socket, Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

import { server as serverConfig } from './config';
import GameState from './services/game';
import logger from './lib/logger';

// Start express server
const app = express();
// Start http server and then create a new Socket.IO server
const server = createServer(app);
const io = new Server(server);

const skull = new GameState(io);

io.on('connection', async (socket: Socket) => {
  const username = socket.handshake.query.username as string;
  const roomId = socket.handshake.query.roomId as string;
  const enterRoomAction = socket.handshake.query
    .enterRoomAction as string;

  if (enterRoomAction === 'create') {
    const createdRoom = skull.newRoom();
    createdRoom.addPlayer(username, socket);
  }
  if (enterRoomAction === 'join') {
    const foundRoom = skull.findRoom(roomId);
    if (foundRoom === null) {
    }
    if (foundRoom !== null) {
      // check if name is valid
      // add to room
      foundRoom.addPlayer(username, socket);
    }
  }
});

server.listen(serverConfig.socketPort, () => {
  logger.info(`Socket listening on port ${serverConfig.socketPort}!`);
});

app.listen(serverConfig.apiPort, () => {
  logger.info(`Api listening on port ${serverConfig.apiPort}!`);
});

// app.use('/', function (req, res, next) {
//   console.log('in 3000');
// });
