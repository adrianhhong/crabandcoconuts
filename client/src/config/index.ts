export const server = {
  url: 'localhost:5000',
  // process.env.SERVER_URI && process.env.SERVER_PORT
  //   ? `${process.env.SERVER_URI}:parseInt(${process.env.SERVER_PORT})`
  //   : location.origin,
  // port: parseInt(process.env.SERVER_PORT || location.port),
  // uri: process.env.SERVER_URI || location.hostname,
};

export default {
  server,
};
