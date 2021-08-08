import { Socket, Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

import { server as serverConfig } from './config';
import Game from './services/game';
import logger from './lib/logger';

// Start express server
const app = express();

app.listen(serverConfig.apiPort, () => {
  // logger.info(`Api listening on port ${serverConfig.apiPort}!`);
});

// Serve static web files
app.use(express.static(__dirname + '/dist/dist'));

// Start http server and then create a new Socket.IO server
const server = createServer(app);

server.listen(serverConfig.socketPort, () => {
  // logger.info(`Socket listening on port ${serverConfig.socketPort}!`);
});

const io = new Server(server, { cors: { origin: '*' } });

const skull = new Game(io);

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
        logger.info(`Room created: ${createdRoom.roomId}`);
      }
      if (enterRoomAction === 'join') {
        const foundRoom = skull.findRoom(roomId);
        if (foundRoom === null) {
          socket.emit('joinRoomFail', {
            message: 'Room cannot be found',
          });
          return;
        }
        const usernameDuplicated =
          foundRoom.checkIfDuplicateUsername(username);
        if (usernameDuplicated) {
          socket.emit('joinRoomFail', {
            message: 'Name already taken',
          });
          return;
        }
        if (foundRoom.players.length === 10) {
          socket.emit('joinRoomFail', {
            message: 'Room capacity full',
          });
          return;
        }
        foundRoom.addPlayer(username, socket);
        socket.emit('enterRoomSuccess', {
          username: username,
          roomId: foundRoom.roomId,
        });
        logger.info(`${username} joined ${roomId}`);
      }
      // ! Remove for PROD
      if (enterRoomAction === 'createDev') {
        const createdRoom = skull.newRoomDev();
        createdRoom.addPlayer(username, socket);
        socket.emit('enterRoomSuccess', {
          username: username,
          roomId: createdRoom.roomId,
        });
        logger.info(`Room created: ${createdRoom.roomId}`);
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
      foundRoom?.emitUpdatedLobby();
    } else {
      socket.emit('updateLobby', { usernames: null });
    }
  });

  socket.on('roomLeave', ({ username, roomId }) => {
    const foundRoom = skull.findRoom(roomId);
    const userExists = foundRoom?.checkIfUserExistsBySocketId(
      socket['id'],
    );
    if (userExists) {
      foundRoom?.removePlayer(username);
    }
    foundRoom?.emitUpdatedLobby();
  });

  socket.on('roomStart', ({ roomId }) => {
    const foundRoom = skull.findRoom(roomId);
    foundRoom?.startGame();
  });
});
