import Player from './player';
import { RoomType, PlayerType } from '../types';
import logger from '../lib/logger';

export default class Room {
  io: RoomType['io'];
  players: RoomType['players'] = [];
  roomId: RoomType['roomId'];
  host = {} as RoomType['host']; // TODO: Fix this instantiating, {} isnt the same as an instance of the class
  onEmpty: RoomType['onEmpty'];

  constructor(
    io: RoomType['io'],
    roomId: RoomType['roomId'],
    onEmpty: RoomType['onEmpty'],
  ) {
    this.io = io;
    this.roomId = roomId;
    this.onEmpty = onEmpty;
    // this.username = username;
    // this.players = [];
    // this.host;
    // this.inProgress = false;
    // this.currentRound;
    // this.currentId = 1;
    // this.botCount = 0;
    // this.currentRoundNum = 1;
    // this.timeOfLastAction = new Date();
    // setTimeout(() => this.deleteGameIfEmpty(), 60 * 1000);
  }

  addPlayer(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
  ): Player {
    const newPlayer = new Player(username, socket);
    socket.join(this.roomId);
    // if no players, make new player host
    if (this.players.length === 0) {
      this.host = newPlayer;
      newPlayer.makeHost();
      // this.io
      //   .in(this.roomId)
      //   .emit('UPDATEHOST', { hostUsername: username }); //  we need to clean up the host when leaving room....
      logger.info(
        `${username} is now the host of rooom: ${this.roomId}`,
      );
    }
    // remove player from game on disconnect
    newPlayer.socket.on('disconnect', () => {
      this.removePlayer(newPlayer.username);
      this.emitUpdatedPlayerList();
    });
    this.players.push(newPlayer);
    return newPlayer;
  }

  emitUpdatedPlayerList(): void {
    this.io.in(this.roomId).emit('updatePlayerList', {
      usernames: this.getUsernames(),
      hostUsername: this.host.username,
    });
  }

  getUsernames(): PlayerType['username'][] {
    const usernames: PlayerType['username'][] = [];
    this.players.forEach((player) => {
      usernames.push(player.username);
    });
    return usernames;
  }

  checkIfUserExistsBySocketId(
    id: PlayerType['socket']['id'],
  ): boolean {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].socket.id === id) {
        return true;
      }
    }
    return false;
  }

  checkIfDuplicateUsername(
    username: PlayerType['username'],
  ): boolean {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].username === username) {
        return true;
      }
    }
    return false;
  }

  removePlayer(username: PlayerType['username']): void {
    const player = this.findPlayer(username);
    if (player !== null) {
      const index = this.players.indexOf(player);
      if (index > -1) {
        this.players.splice(index, 1);
        logger.info(`${username} left ${this.roomId}`);
      }
      //if there are no players left
      if (this.players.length === 0) {
        this.onEmpty();
      } else {
        // make next player the host
        for (let i = 0; i < this.players.length; i++) {
          const nextPlayer = this.players[i];
          this.host = nextPlayer;
          nextPlayer.makeHost();
          break;
        }
      }
    }
  }

  findPlayer(username: PlayerType['username']): Player | null {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].username === username) {
        return this.players[i];
      }
    }
    return null;
  }

  //   getNextId() {
  //     return this.currentId++;
  //   }
  //   getNextRoundNum() {
  //     return this.currentRoundNum++;
  //   }
  //   getJsonGame() {
  //     const players = [];
  //     this.players.forEach((player) => {
  //       players.push(player.getJson());
  //     });
  //     const jsonGame = {
  //       code: this.code,
  //       players,
  //       inProgress: this.inProgress,
  //       canViewLastRoundResults:
  //         this.currentRound !== undefined &&
  //         this.currentRound.canViewLastRoundResults,
  //     };
  //     return jsonGame;
  //   }

  //   sendToAll(event, data) {
  //     this.players.forEach((player) => {
  //       player.socket.emit(event, {
  //         success: true,
  //         event,
  //         gameCode: this.code,
  //         player: player.getJson(),
  //         data,
  //       });
  //     });
  //   }
  //   startNewRound(timeLimit, wordPackName, showNeighbors, turnLimit) {
  //     this.inProgress = true;
  //     this.currentRound = new Round(
  //       this.getNextRoundNum(),
  //       this.players,
  //       timeLimit,
  //       wordPackName,
  //       showNeighbors,
  //       turnLimit,
  //       () => {
  //         //ran when results are sent
  //         this.inProgress = false;
  //         this.sendUpdatedPlayersList(); //this makes sure the View Last Round Results button shows up
  //         this.timeOfLastAction = new Date();
  //       },
  //     );
  //     this.currentRound.start();
  //   }
}
