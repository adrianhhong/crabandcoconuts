import Player from './player';
import { RoomType, PlayerType } from '../types';
import logger from '../lib/logger';

export default class Room {
  io: RoomType['io'];
  players: Player[] = [];
  roomId = '';
  onEmpty: () => void;
  // username = '';

  constructor(
    io: RoomType['io'],
    roomId: RoomType['roomId'],
    onEmpty: () => void,
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

  newPlayer(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
  ): Player {
    return new Player(username, socket);
  }

  addPlayer(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
  ): Player {
    const newPlayer = this.newPlayer(username, socket);
    this.initPlayer(newPlayer);
    this.players.push(newPlayer);
    socket.join(this.roomId);
    return newPlayer;
  }

  emitUpdatedPlayerList(): void {
    this.io
      .in(this.roomId)
      .emit('updatePlayerList', { usernames: this.getUsernames() });
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

  initPlayer(newPlayer: PlayerType): void {
    // //if this is the first user, make them host
    // if (this.players.length === 0) {
    //   this.host = newPlayer;
    //   newPlayer.makeHost();
    // }
    //when this player disconnects, remove them from this game
    newPlayer.socket.on('disconnect', () => {
      this.removePlayer(newPlayer.username);
      this.emitUpdatedPlayerList();
    });
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
      }
    }
  }

  findPlayer(username: PlayerType['username']): PlayerType | null {
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
