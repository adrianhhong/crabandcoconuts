"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const config_1 = require("./config");
const game_1 = __importDefault(require("./services/game"));
const logger_1 = __importDefault(require("./lib/logger"));
// Start express server
const app = express_1.default();
app.listen(config_1.server.apiPort, () => {
    // logger.info(`Api listening on port ${serverConfig.apiPort}!`);
});
// Serve static web files
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(__dirname + '/dist'));
}
// Start http server and then create a new Socket.IO server
const server = http_1.createServer(app);
server.listen(config_1.server.socketPort, () => {
    // logger.info(`Socket listening on port ${serverConfig.socketPort}!`);
});
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
const skull = new game_1.default(io);
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`New connection: ${socket.id}`);
    socket.on('homeNewEnterRoom', ({ username, roomId, enterRoomAction }) => {
        if (enterRoomAction === 'create') {
            const createdRoom = skull.newRoom();
            createdRoom.addPlayer(username, socket);
            socket.emit('enterRoomSuccess', {
                username: username,
                roomId: createdRoom.roomId,
            });
            logger_1.default.info(`Room created: ${createdRoom.roomId}`);
        }
        if (enterRoomAction === 'join') {
            const foundRoom = skull.findRoom(roomId);
            if (foundRoom === null) {
                socket.emit('joinRoomFail', {
                    message: 'Room cannot be found',
                });
                return;
            }
            const usernameDuplicated = foundRoom.checkIfDuplicateUsername(username);
            if (usernameDuplicated) {
                socket.emit('joinRoomFail', {
                    message: 'Name already taken',
                });
                return;
            }
            if (foundRoom.players.length === 10) {
                socket.emit('joinRoomFail', {
                    message: 'Room capacity full',
                });
                return;
            }
            foundRoom.addPlayer(username, socket);
            socket.emit('enterRoomSuccess', {
                username: username,
                roomId: foundRoom.roomId,
            });
            logger_1.default.info(`${username} joined ${roomId}`);
        }
        // ! Remove for PROD
        if (enterRoomAction === 'createDev') {
            const createdRoom = skull.newRoomDev();
            createdRoom.addPlayer(username, socket);
            socket.emit('enterRoomSuccess', {
                username: username,
                roomId: createdRoom.roomId,
            });
            logger_1.default.info(`Room created: ${createdRoom.roomId}`);
        }
    });
    /**
     * If new connection socket is already in room, update everyones playerList, if not, return null
     */
    socket.on('roomCheckIfJoined', ({ roomId }) => {
        const foundRoom = skull.findRoom(roomId);
        const userExists = foundRoom === null || foundRoom === void 0 ? void 0 : foundRoom.checkIfUserExistsBySocketId(socket['id']);
        if (userExists) {
            foundRoom === null || foundRoom === void 0 ? void 0 : foundRoom.emitUpdatedLobby();
        }
        else {
            socket.emit('updateLobby', { usernames: null });
        }
    });
    socket.on('roomLeave', ({ username, roomId }) => {
        const foundRoom = skull.findRoom(roomId);
        const userExists = foundRoom === null || foundRoom === void 0 ? void 0 : foundRoom.checkIfUserExistsBySocketId(socket['id']);
        if (userExists) {
            foundRoom === null || foundRoom === void 0 ? void 0 : foundRoom.removePlayer(username);
        }
        foundRoom === null || foundRoom === void 0 ? void 0 : foundRoom.emitUpdatedLobby();
    });
    socket.on('roomStart', ({ roomId }) => {
        const foundRoom = skull.findRoom(roomId);
        foundRoom === null || foundRoom === void 0 ? void 0 : foundRoom.startGame();
    });
}));
