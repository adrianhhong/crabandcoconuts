import { Socket } from 'socket.io';

export interface RoomType {
  socket: Socket;
  adapter: any; // TODO: fix later
  username: string;
  roomId: string;
  createRoom: boolean;
}
