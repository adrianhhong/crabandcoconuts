export const server = {
  socketPort: parseInt(`${process.env.SOCKET_PORT}`, 10) || 5000,
  apiPort: parseInt(`${process.env.API_PORT}`, 10) || 3000,
  logLevel: 'debug',
};

export const colors = [
  'player1',
  'player2',
  'player3',
  'player4',
  'player5',
  'player6',
];
