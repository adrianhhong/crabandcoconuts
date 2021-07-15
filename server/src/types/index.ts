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
  passedBid: number[];
}

export interface PlayerType {
  username: string;
  socket: Socket;
  slots: number[];
  color: string;
  points: number;
  numberOfSkulls: number;
  numberOfRoses: number;
}

export interface PlayerButtonState {
  username: string;
  slots: number[];
  color: string;
  points: number;
  numberOfSkulls: number;
  numberOfRoses: number;
}

export interface ActiveDetails {
  color: string;
  player: string;
  round: number;
}
