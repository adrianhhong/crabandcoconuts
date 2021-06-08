import { Server, Socket } from 'socket.io';
import Room from '../services/room';
import Player from '../services/player';

export interface GameType {
  rooms: Room[];
  io: Server;
}

export interface RoomType {
  io: Server;
  players: Player[];
  roomId: string;
  // enterRoomAction: string;
}

export interface PlayerType {
  username: string;
  socket: Socket;
}
