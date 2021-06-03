import { io } from 'socket.io-client';
import { server } from '../config/index.ts';

export function socketInit(username, roomId, roomAction) {
  const socket = io(`${server.url}`, {
    transports: ['websocket'],
    query: {
      username,
      roomId,
      roomAction,
    },
  });
  return socket;
}
