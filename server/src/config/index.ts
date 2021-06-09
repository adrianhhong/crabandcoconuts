export const server = {
  socketPort: parseInt(`${process.env.SOCKET_PORT}`, 10) || 5000,
  apiPort: parseInt(`${process.env.API_PORT}`, 10) || 3000,
  logLevel: 'debug',
};

export default {
  server,
};
