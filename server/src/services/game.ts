import Room from './room';
import { GameType, RoomType } from '../types';
import logger from '../lib/logger';

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
    const newRoom = new Room(this.io, newRoomId, () => {
      // will be ran when this room has 0 players left
      this.removeGame(newRoomId);
    });
    this.rooms.push(newRoom);
    return newRoom;
  }

  findRoom(roomId: RoomType['roomId']): Room | null {
    if (!roomId || roomId.length !== 4) return null;
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

  removeGame(roomId: RoomType['roomId']): void {
    const room = this.findRoom(roomId);
    if (room !== null) {
      const index = this.rooms.indexOf(room);
      if (index > -1) {
        this.rooms.splice(index, 1);
      }
      logger.info(`Room removed: ${roomId}`);
    }
  }
}
