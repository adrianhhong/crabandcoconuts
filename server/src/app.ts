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
        socket.emit('enterRoomSuccess', {
          username: username,
          roomId: createdRoom.roomId,
        });
        logger.info(`Room created: ${roomId}`);
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
          const usernameDuplicated =
            foundRoom.checkIfDuplicateUsername(username);
          if (usernameDuplicated) {
            socket.emit('joinRoomFail', {
              message: 'Name already taken',
            });
          }
          // add to room
          foundRoom.addPlayer(username, socket);
          socket.emit('enterRoomSuccess', {
            username: username,
            roomId: foundRoom.roomId,
          });
          logger.info(`${username} joined ${roomId}`);
        }
      }
    },
  );

  /**
   * If new connection socket is already in room, update everyones playerList, if not, return null
   */
  socket.on('roomCheckIfJoined', ({ roomId }) => {
    const foundRoom = skull.findRoom(roomId);
    const userExists = foundRoom?.checkIfUserExistsBySocketId(
      socket['id'],
    );
    if (userExists) {
      foundRoom?.emitUpdatedPlayerList();
    } else {
      socket.emit('updatePlayerList', { usernames: null });
    }
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
