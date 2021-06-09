import { io } from 'socket.io-client';
import { server } from '../config/index.ts';

export default class SocketManager {
  initiateSocketConnection(username, roomId, enterRoomAction) {
    const socket = io(`${server.url}`, {
      transports: ['websocket'],
      query: {
        username,
        roomId,
        enterRoomAction,
      },
    });
    return socket;
  }

  addSocketListeners(socket) {
    socket.on('updatePlayerList', (usernames) => {
      console.log(usernames);
    });
  }
}
