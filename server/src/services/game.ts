import Room from './room';
import { GameType, RoomType } from '../types';

/**
 * GameState holds all the room info
 *
 */
export default class GameState {
  rooms: Room[] = [];
  io = {} as GameType['io']; // TODO: instantiate properly

  constructor(io: GameType['io']) {
    this.io = io;
  }

  /**
   * Creates a room instance, populates rooms[] and returns that instance
   * @returns RoomType
   */
  newRoom(): Room {
    const newRoomId = this.generateCode();
    const newRoom = new Room(this.io, newRoomId);
    this.rooms.push(newRoom);
    return newRoom;
  }

  findRoom(roomId: RoomType['roomId']): Room | null {
    if (!roomId || roomId.length !== 4) return null;
    console.log(this.rooms);
    for (let i = 0; i < this.rooms.length; i++) {
      if (this.rooms[i].roomId === roomId.toLowerCase()) {
        return this.rooms[i];
      }
    }
    return null;
  }

  generateCode(): string {
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
