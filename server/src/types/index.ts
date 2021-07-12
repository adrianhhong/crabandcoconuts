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
  host: Player;
  onEmpty: () => void;
}

export interface PlayerType {
  username: string;
  socket: Socket;
  isHost: boolean;
  slots: number[];
  color: string;
}

export interface PlayerButtonState {
  player: string;
  turnIndicator: boolean;
  slots: number[];
  color: string;
}
