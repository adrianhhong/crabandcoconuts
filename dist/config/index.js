"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = exports.server = void 0;
exports.server = {
    socketPort: parseInt(`${process.env.SOCKET_PORT}`, 10) || 5000,
    apiPort: process.env.PORT || 3000,
    logLevel: 'debug',
};
exports.colors = [
    'player1',
    'player2',
    'player3',
    'player4',
    'player5',
    'player6',
    'player7',
    'player8',
    'player9',
    'player10',
];
