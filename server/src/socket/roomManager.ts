import { RoomType } from '@/types';

export default class Room {
  socket = {};
  username = '';
  roomId = '';
  createRoom = 1;

  constructor(room: RoomType) {
    this.socket = room.socket;
    this.adapter = socket;
    this.username = room.username;
    this.roomId = room.roomId;
    this.createRoom = room.createRoom;
  }

  async init(username) {
    // We are joining the room
    if (!this.createRoom) {
      this.adapter = this.adapter.rooms.get(this.roomId);
    }
  }
}
