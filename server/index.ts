import {Socket} from "socket.io"

const app = require("express")();
const httpServer = require("http").createServer(app);
const options = { /* ... */ };
const io = require("socket.io")(httpServer, options);

io.on("connection", (socket: Socket) => { /* ... */ });

httpServer.listen(3000, () => {
  // logger.info(`Api listening on port ${Number(API_PORT)}!`);
});
// WARNING !!! app.listen(3000); will not work here, as it creates a new HTTP server


// app.listen(API_PORT, () => {
//   logger.info(`Api listening on port ${Number(API_PORT)}!`);
// });

// server.listen(Number(API_PORT) + 1, () => {
//   logger.info(`Socker listening on port ${Number(API_PORT) + 1}!`);
//   logger.info(`Api and socker whitelisted for ${host}`);
// });