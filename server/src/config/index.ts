export const server = {
  socketPort: parseInt(`${process.env.SOCKET_PORT}`, 10) || 5000,
  apiPort: process.env.PORT || 3000,
  logLevel: 'debug',
};

export const colors = [
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
