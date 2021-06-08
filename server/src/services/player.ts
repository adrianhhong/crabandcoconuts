import { PlayerType } from '../types';

export default class Player {
  username = '';
  socket: PlayerType['socket'];

  constructor(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
  ) {
    this.username = username;
    this.socket = socket;
  }
}
