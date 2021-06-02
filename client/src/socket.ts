import { io } from 'socket.io-client';
import { sockerUrl } from '../../env';

export function SockerInit(username, roomId, password, action, options) {
  const socket = io(`${sockerUrl}`, {
    path: '/classic-mode',
    transports: ['websocket'],
    query: {
      username,
      roomId,
      password,
      action,
      token,
      options: options && JSON.stringify(options)
    }
  });
  return socket;
}
