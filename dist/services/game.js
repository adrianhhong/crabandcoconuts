"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = __importDefault(require("./room"));
const logger_1 = __importDefault(require("../lib/logger"));
/**
 * Game holds all the room info
 *
 */
class Game {
    constructor(io) {
        this.rooms = [];
        this.io = {}; // TODO: instantiate properly
        this.io = io;
    }
    /**
     * Creates a room instance, populates rooms[] and returns that instance
     * @returns RoomType
     */
    newRoom() {
        const newRoomId = this.generateCode();
        const newRoom = new room_1.default(this.io, newRoomId, () => {
            // will be ran when this room has 0 players left
            this.removeGame(newRoomId);
        });
        this.rooms.push(newRoom);
        return newRoom;
    }
    // ! Remove for PROD
    newRoomDev() {
        const newRoomId = 'aaaa';
        const newRoom = new room_1.default(this.io, newRoomId, () => {
            // will be ran when this room has 0 players left
            this.removeGame(newRoomId);
        });
        this.rooms.push(newRoom);
        return newRoom;
    }
    findRoom(roomId) {
        if (!roomId || roomId.length !== 4)
            return null;
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].roomId === roomId.toLowerCase()) {
                return this.rooms[i];
            }
        }
        return null;
    }
    generateCode() {
        let code;
        do {
            code = '';
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';
            for (let i = 0; i < 4; i++) {
                code += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }
            // make sure the code is not already in use
        } while (this.findRoom(code));
        return code;
    }
    removeGame(roomId) {
        const room = this.findRoom(roomId);
        if (room !== null) {
            const index = this.rooms.indexOf(room);
            if (index > -1) {
                this.rooms.splice(index, 1);
            }
            logger_1.default.info(`Room removed: ${roomId}`);
        }
    }
}
exports.default = Game;
