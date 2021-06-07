import { RoomType } from '../types';
import { Socket } from 'socket.io';

export default class Room {
  socket = {} as Socket;
  adapter = {} as any;
  username = '';
  roomId = '';
  enterRoomAction = 'join';

  constructor(room: RoomType) {
    this.socket = room.socket;
    this.adapter = room.adapter;
    this.username = room.username;
    this.roomId = room.roomId;
    this.enterRoomAction = room.enterRoomAction;
  }

  async init(username: string): Promise<boolean> {
    // We are joining the room
    if (this.enterRoomAction === 'join') {
      this.socket.join(this.roomId);
      this.adapter = this.adapter.rooms.get(this.roomId);
    }
    return true;
  }
}
