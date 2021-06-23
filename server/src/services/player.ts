import { PlayerType } from '../types';

export default class Player {
  username: PlayerType['username'] = '';
  socket: PlayerType['socket'];
  isHost: PlayerType['isHost'] = false;

  constructor(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
  ) {
    this.username = username;
    this.socket = socket;
  }

  makeHost(): void {
    this.isHost = true;
    // this.socket.emit('hostUpdatedSettings');
  }
}
