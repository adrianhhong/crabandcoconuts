import Player from './player';
import { RoomType, PlayerType, PlayerButtonState } from '../types';
import logger from '../lib/logger';
import { colors } from '../config';

export default class Room {
  io: RoomType['io'];
  players: RoomType['players'] = [];
  roomId: RoomType['roomId'];
  host = {} as RoomType['host']; // TODO: Fix this instantiating, {} isnt the same as an instance of the class
  onEmpty: RoomType['onEmpty'];
  round = 0;
  activePlayerIndex = 0;

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
    const newPlayer = new Player(
      username,
      socket,
      colors[this.players.length],
    );
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
    this.setPlayerSockets(newPlayer);
    this.players.push(newPlayer);
    return newPlayer;
  }

  setPlayerSockets(newPlayer: Player): void {
    /**
     * disconnect: When a player disconnects, remove player from room
     */
    newPlayer.socket.on('disconnect', () => {
      logger.info(`${newPlayer.username} disconnected`);
      this.removePlayer(newPlayer.username);
      this.emitUpdatedPlayerList();
    });
    /**
     * playCard: When a player plays a card (skull or rose) update their hiddenSlots and slots
     */
    newPlayer.socket.on('playCard', ({ card }) => {
      // Set hiddenSlots
      if (card === 'skull') {
        this.players[this.activePlayerIndex].hiddenSlots[
          this.round
        ] = 1;
      }
      if (card === 'rose') {
        this.players[this.activePlayerIndex].hiddenSlots[
          this.round
        ] = 2;
      }
      // Set slots
      this.players[this.activePlayerIndex].slots[this.round] = 3;
      const previousActivePlayer =
        this.players[this.activePlayerIndex].username;
      const previousRound = this.round;
      const previousColor =
        this.players[this.activePlayerIndex].color;
      // Increment round and activePlayerIndex
      if (this.activePlayerIndex === this.players.length - 1) {
        this.round++;
        this.activePlayerIndex = 0;
      } else {
        this.activePlayerIndex++;
      }
      const activePlayer =
        this.players[this.activePlayerIndex].username;
      const activeColor = this.players[this.activePlayerIndex].color;
      // Update game state
      this.io.in(this.roomId).emit('updateGameState', {
        currentMessage: `<span style="color:${activeColor}";>${activePlayer}</span>'s turn`,
        addedLogMessage: `<span style="color:${previousColor}";>${previousActivePlayer}</span> placed down card ${
          previousRound + 1
        } `,
        gameState: 'placingCards',
        round: this.round,
        playerStates: this.getPlayerStates(),
        activePlayer: activePlayer,
      });
    });
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

  startGame(): void {
    this.io.in(this.roomId).emit('startGame');
    const activePlayer =
      this.players[this.activePlayerIndex].username;
    const activeColor = this.players[this.activePlayerIndex].color;
    this.io.in(this.roomId).emit('updateGameState', {
      currentMessage: `<span style="color:${activeColor}";>${activePlayer}</span>'s turn`,
      addedLogMessage: `<span style="color:white>";>Round 1! 🎉</span>`,
      gameState: 'placingCards',
      round: this.round,
      playerStates: this.getPlayerStates(),
      activePlayer: activePlayer,
    });
  }

  getPlayerStates(): PlayerButtonState[] {
    return this.players.map((player) => {
      return {
        player: player.username,
        slots: player.slots,
        color: player.color,
        points: player.points,
      };
    });
  }
}
