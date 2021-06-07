import Room from './roomState';
import { RoomType } from '../types';

/**
 * GameState holds all the room info
 *
 */
export default class GameState {
  rooms: RoomType[] = [];

  /**
   * Creates a room instance, populates rooms[] and returns that instance
   * @returns RoomType
   */
  newRoom(): RoomType {
    const newRoomId = this.generateCode();
    const newRoom = new Room(newRoomId);
    this.rooms.push(newRoom);
    return newRoom;
  }

  findRoom(roomId: string): RoomType | null {
    if (!roomId || roomId.length !== 4) return null;
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId === roomId.toLowerCase()) {
        return this.rooms[i];
      }
    }
    return null;
  }

  generateCode(): RoomType['roomId'] {
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
    } while (this.findRoom(code));
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
