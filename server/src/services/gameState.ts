import Game from './game';
import { GameType } from '../types';

/**
 * GameState holds all the game info
 *
 */
export default class GameState {
  rooms: GameType[] = [];

  newGame(username: string): GameType {
    const newRoomId = this.generateCode();
    const newGame = new Game(username, newRoomId);
    this.rooms.push(newGame);
    return newGame;
  }

  findGame(roomId: string): any | null {
    if (!roomId || roomId.length !== 4) return null;
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId === roomId.toLowerCase()) {
        return this.rooms[i];
      }
    }
    return null;
  }

  generateCode(): GameType['roomId'] {
    let code;
    do {
      code = '';
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      for (let i = 0; i < 4; i++) {
        code += alphabet.charAt(
          Math.floor(Math.random() * alphabet.length),
        );
      }
      //make sure the code is not already in use
    } while (this.findGame(code));
    return code;
  }

  //   removeGame(code) {
  //     const game = this.findGame(code);

  //     const index = this.games.indexOf(game);
  //     if (index > -1) {
  //       this.games.splice(index, 1);
  //     }
  //   }
}
