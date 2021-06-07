export default class Game {
  roomId = '';
  username = '';

  constructor(username: string, roomId: string) {
    this.roomId = roomId;
    this.username = username;
    // this.onEmpty = onEmpty;
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
  //   newPlayer(name, socket) {
  //     return new Player(name, socket, this.getNextId());
  //   }
  //   addPlayer(name, socket) {
  //     const newPlayer = this.newPlayer(name, socket);
  //     this.initPlayer(newPlayer);
  //     this.players.push(newPlayer);
  //     this.sendUpdatedPlayersList();
  //     return newPlayer;
  //   }
  //   initPlayer(newPlayer) {
  //     //if this is the first user, make them host
  //     if (this.players.length === 0) {
  //       this.host = newPlayer;
  //       newPlayer.makeHost();
  //     }
  //     //when this player disconnects, remove them from this game
  //     newPlayer.socket.on('disconnect', () => {
  //       newPlayer.isConnected = false;
  //       if (this.inProgress) {
  //         this.currentRound.findReplacementFor(newPlayer, this.code);
  //       } else {
  //         this.removePlayer(newPlayer.id);
  //       }
  //       this.onPlayerDisconnect(newPlayer);
  //       this.sendUpdatedPlayersList();
  //     });
  //     newPlayer.socket.on('viewPreviousResults', () => {
  //       if (
  //         this.currentRound &&
  //         this.currentRound.canViewLastRoundResults
  //       ) {
  //         newPlayer.send('viewResults', {
  //           chains: this.currentRound.getAllChains(),
  //           isViewPreviousResults: true,
  //         });
  //       }
  //     });
  //   }
  //   onPlayerDisconnect({ id }) {
  //     const noHost = !this.host;
  //     const playerWasHost = this.host && id === this.host.id;
  //     if (playerWasHost || noHost) {
  //       this.host = undefined;
  //       //find the first connected player to be host
  //       for (let i = 0; i < this.players.length; i++) {
  //         const thisPlayer = this.players[i];
  //         if (thisPlayer.isConnected && !thisPlayer.isAi) {
  //           this.host = thisPlayer;
  //           thisPlayer.makeHost();
  //           break;
  //         }
  //       }
  //     }
  //     this.deleteGameIfEmpty();
  //   }
  //   deleteGameIfEmpty() {
  //     if (this.code === 'ffff') return;
  //     let allPlayersDisconnected = true;
  //     for (let j = 0; j < this.players.length; j++) {
  //       if (this.players[j].isConnected && !this.players[j].isAi) {
  //         allPlayersDisconnected = false;
  //         break;
  //       }
  //     }
  //     if (allPlayersDisconnected) {
  //       this.onEmpty();
  //     }
  //   }
  //   removePlayer(id) {
  //     const player = this.getPlayer(id);
  //     const index = this.players.indexOf(player);
  //     if (index > -1) {
  //       this.players.splice(index, 1);
  //     }
  //     //if there are no players left
  //     if (this.players.length === 0) {
  //       this.onEmpty();
  //     }
  //   }
  //   getPlayer(id) {
  //     for (let i = 0; i < this.players.length; i++) {
  //       if (this.players[i].id === id) {
  //         return this.players[i];
  //       }
  //     }
  //     return false;
  //   }
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
  //   sendUpdatedPlayersList() {
  //     this.sendToAll('updatePlayerList', {
  //       players: this.getJsonGame().players,
  //       canViewLastRoundResults:
  //         this.currentRound !== undefined &&
  //         this.currentRound.canViewLastRoundResults,
  //     });
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
