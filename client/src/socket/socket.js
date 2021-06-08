import { io } from 'socket.io-client';
import { server } from '../config/index.ts';

/**
 * Sets up the initial socket connection with the server
 * @param username
 *
 * @param roomId
 * @param enterRoomAction
 * @returns
 */
export function socketInit(username, roomId, enterRoomAction) {
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
