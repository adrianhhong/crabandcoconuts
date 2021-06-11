export const config = {
  serverUrl: 'http://localhost:5000',
  clientUrl: 'http://localhost:8080',
  // process.env.SERVER_URI && process.env.SERVER_PORT
  //   ? `${process.env.SERVER_URI}:parseInt(${process.env.SERVER_PORT})`
  //   : location.origin,
  // port: parseInt(process.env.SERVER_PORT || location.port),
  // uri: process.env.SERVER_URI || location.hostname,
};

export default {
  config,
};
