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
const io = new Server(server, { cors: { origin: '*' } });

const skull = new GameState(io);

io.on('connection', async (socket: Socket) => {
  logger.info(`New connection: ${socket.id}`);
  socket.on(
    'homeNewEnterRoom',
    ({ username, roomId, enterRoomAction }) => {
      if (enterRoomAction === 'create') {
        const createdRoom = skull.newRoom();
        createdRoom.addPlayer(username, socket);
      }
      if (enterRoomAction === 'join') {
        const foundRoom = skull.findRoom(roomId);
        if (foundRoom === null) {
          socket.emit('joinRoomFail', {
            message: 'Room cannot be found',
          });
        }
        if (foundRoom !== null) {
          // check if name is valid
          // add to room
          foundRoom.addPlayer(username, socket);
        }
      }
    },
  );

  socket.on('roomCheckIfJoined', (roomId) => {
    const foundRoom = skull.findRoom(roomId);
    console.log(foundRoom);
    const usernameOfSocket = foundRoom?.getUsernameBySocketId(
      socket['id'],
    );
    console.log(usernameOfSocket);
    socket.emit('checkedIfJoined', {
      username: usernameOfSocket,
    });
  });
});

server.listen(serverConfig.socketPort, () => {
  logger.info(`Socket listening on port ${serverConfig.socketPort}!`);
});

app.listen(serverConfig.apiPort, () => {
  logger.info(`Api listening on port ${serverConfig.apiPort}!`);
});

// app.use('/', function (req, res, next) {
// });
