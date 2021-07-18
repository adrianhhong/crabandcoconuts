import Player from './player';
import {
  RoomType,
  PlayerType,
  PlayerButtonState,
  ActiveDetails,
} from '../types';
import logger from '../lib/logger';
import { colors } from '../config';

export default class Room {
  io: RoomType['io'];
  players: RoomType['players'] = [];
  roomId: RoomType['roomId'];
  host = {} as RoomType['host']; // TODO: Fix this instantiating, {} isnt the same as an instance of the class
  onEmpty: RoomType['onEmpty'];
  round = 0;
  startingPlayerIndex = 0; // Index of player who started the round
  activePlayerIndex = 0; // Index of active player
  cardsPlayed = 0;
  currentBidNumber = 0;
  currentBidder = '';
  passedBid: RoomType['passedBid'] = [];
  cardsFlipped = 0;

  constructor(
    io: RoomType['io'],
    roomId: RoomType['roomId'],
    onEmpty: RoomType['onEmpty'],
  ) {
    this.io = io;
    this.roomId = roomId;
    this.onEmpty = onEmpty;
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
      // Set hiddenSlots and numberOfRoses/Skulls
      if (card === 'skull') {
        this.players[this.activePlayerIndex].hiddenSlots[
          this.round
        ] = 3;
        this.players[this.activePlayerIndex].numberOfSkulls--;
      }
      if (card === 'rose') {
        this.players[this.activePlayerIndex].hiddenSlots[
          this.round
        ] = 2;
        this.players[this.activePlayerIndex].numberOfRoses--;
      }
      // Set slots
      this.players[this.activePlayerIndex].slots[this.round] = 1;
      // Record previous variables
      const previous = this.getActiveDetails();
      // Increase cardsPlayed
      this.cardsPlayed++;
      // Check if round has increased
      if (this.cardsPlayed % this.players.length === 0) {
        this.round++;
      }
      this.increaseActivePlayerIndex();
      const current = this.getActiveDetails();
      // Update game state
      this.io.in(this.roomId).emit('updateGameState', {
        currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn`,
        addedLogMessage: `<span class="${previous.color}--text">${
          previous.player
        }</span> placed down card ${previous.round + 1}`,
        gamePhase: 'placingCards',
        round: this.round,
        biddingMinimum: 1, // Not really using this yet
        playerStates: this.getPlayerStates(),
        activePlayer: current.player,
        cardsPlayed: this.cardsPlayed,
      });
    });
    /**
     * raiseBid: When a player submits an initial bid
     */
    newPlayer.socket.on('raiseBid', ({ bidNumber }) => {
      this.currentBidNumber = bidNumber;
      this.currentBidder = newPlayer.username;
      const previous = this.getActiveDetails();
      if (this.currentBidNumber === this.cardsPlayed) {
        this.setupChallenge();
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${previous.color}--text">${previous.player}</span> won the bid! They need to flip over ${this.currentBidNumber} cards`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> bid they can flip over ${this.currentBidNumber} cards`,
          gamePhase: 'challenge',
          round: this.round,
          biddingMinimum: this.currentBidNumber + 1,
          playerStates: this.getPlayerStates(),
          activePlayer: previous.player,
          cardsPlayed: this.cardsPlayed,
        });
      } else {
        this.increaseActivePlayerIndex();
        const current = this.getActiveDetails();
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn to increase the bid or pass`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> bid they can flip over ${this.currentBidNumber} cards`,
          gamePhase: 'bid',
          round: this.round,
          biddingMinimum: this.currentBidNumber + 1,
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          cardsPlayed: this.cardsPlayed,
        });
      }
    });
    /**
     * passBid: When a player passes a bid. Need to go to the next non-passed player or if everyone has passed, move to challenge phase
     */
    newPlayer.socket.on('passBid', () => {
      this.passedBid[this.activePlayerIndex] = 1;
      const previous = this.getActiveDetails();
      const allPlayersPassed = this.increaseActivePlayerIndex();
      const current = this.getActiveDetails();
      if (allPlayersPassed) {
        this.setupChallenge();
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${current.color}--text">${current.player}</span> won the bid! They need to flip over ${this.currentBidNumber} cards`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> passed their bid`,
          gamePhase: 'challenge',
          round: this.round,
          biddingMinimum: this.currentBidNumber + 1,
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          cardsPlayed: this.cardsPlayed,
        });
      } else {
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn to increase the bid or pass`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> passed their bid`,
          gamePhase: 'bid',
          round: this.round,
          biddingMinimum: this.currentBidNumber + 1,
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          cardsPlayed: this.cardsPlayed,
        });
      }
    });
    /**
     * flipOver: When a player is challenging and flips over a card
     */
    newPlayer.socket.on('flipOver', ({ username }) => {
      const thisPlayer = this.findPlayer(username);

      if (thisPlayer !== null) {
        const successfulFlip = thisPlayer.flipOverCard();
        if (successfulFlip) {
          this.cardsFlipped++;
          const current = this.getActiveDetails();
          this.io.in(this.roomId).emit('updateGameState', {
            currentMessage: `<span class="${current.color}--text">${
              current.player
            }</span> needs to flip over ${
              this.currentBidNumber - this.cardsFlipped
            } more`,
            addedLogMessage: `<span class="${current.color}--text">${current.player}</span> flipped over a Rose on their ${this.cardsFlipped} go`,
            gamePhase: 'challenge',
            round: this.round,
            biddingMinimum: this.currentBidNumber + 1,
            playerStates: this.getPlayerStates(),
            activePlayer: current.player,
            cardsPlayed: this.cardsPlayed,
          });
        }
      }
    });
  }

  getActiveDetails(): ActiveDetails {
    return {
      color: this.players[this.activePlayerIndex].color,
      player: this.players[this.activePlayerIndex].username,
      round: this.round,
    };
  }

  // return true if everyone passed and we want to go to challenge mode
  increaseActivePlayerIndex(): boolean {
    // Find the next player who has not passed
    do {
      if (this.activePlayerIndex === this.players.length - 1) {
        this.activePlayerIndex = 0;
      } else {
        this.activePlayerIndex++;
      }
    } while (this.passedBid[this.activePlayerIndex] === 1);
    const totalPassedPlayers = this.passedBid.reduce(
      (accumulator, curr) => accumulator + curr,
    );
    // we went through everyone and they all passed...
    if (totalPassedPlayers === this.players.length - 1) return true;
    return false;
  }

  setupChallenge(): void {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].setupNextToFlipIndex();
    }
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
    this.passedBid = new Array(this.players.length).fill(0);
    this.startingPlayerIndex = Math.floor(
      Math.random() * this.players.length,
    );
    this.activePlayerIndex = this.startingPlayerIndex;
    const current = this.getActiveDetails();
    this.io.in(this.roomId).emit('updateGameState', {
      currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn`,
      addedLogMessage: `Round 1! 🎉`,
      gamePhase: 'placingCards',
      round: this.round,
      biddingMinimum: 1, // Not really using this yet
      playerStates: this.getPlayerStates(),
      activePlayer: current.player,
      cardsPlayed: this.cardsPlayed,
    });
  }

  getPlayerStates(): PlayerButtonState[] {
    return this.players.map((player) => {
      return {
        username: player.username,
        slots: player.slots,
        color: player.color,
        points: player.points,
        numberOfSkulls: player.numberOfSkulls,
        numberOfRoses: player.numberOfRoses,
        nextToFlipIndex: player.nextToFlipIndex,
      };
    });
  }
}
