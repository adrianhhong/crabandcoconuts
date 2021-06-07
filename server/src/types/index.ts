import { Socket } from 'socket.io';
import { Adapter } from 'socket.io-adapter';

export interface RoomType {
  socket: Socket;
  adapter: Adapter;
  username: string;
  roomId: string;
  enterRoomAction: string;
}
