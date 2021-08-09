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
  activePlayerIndex = 0; // Index of active player
  cardsPlayed = 0;
  currentBidNumber = 0;
  passedBid: RoomType['passedBid'] = []; // Array that is 1 if the player passed, 0 if the player has not passed their bid
  cardsFlipped = 0;
  eliminatedPlayers = 0;
  currentMessageRandomlyLose = '';
  pointsToWin = 2;

  constructor(
    io: RoomType['io'],
    roomId: RoomType['roomId'],
    onEmpty: RoomType['onEmpty'],
  ) {
    this.io = io;
    this.roomId = roomId;
    this.onEmpty = onEmpty;
  }

  /**
   * Add player to room
   * @param username
   * @param socket
   * @returns
   */
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

  /**
   * Sets the socket io websockets to listen for events
   * @param newPlayer Player instance
   */
  setPlayerSockets(newPlayer: Player): void {
    // changePointsToWin: host changes points needed to win option
    newPlayer.socket.on('changePointsToWin', ({ pointsToWin }) => {
      this.pointsToWin = pointsToWin;
      this.emitUpdatedLobby();
    });

    // disconnect: When a player disconnects, remove player from room
    newPlayer.socket.on('disconnect', () => {
      logger.info(`${newPlayer.username} disconnected`);
      this.removePlayer(newPlayer.username);
      this.emitUpdatedLobby();
    });

    // playCard: When a player plays a card (skull or rose) update their hiddenSlots and slots
    newPlayer.socket.on('playCard', ({ card }) => {
      const activePlayer = this.players[this.activePlayerIndex];
      if (activePlayer) {
        if (card === 'skull') {
          // Set hiddenSlots and numberOfRoses/Skulls
          activePlayer.hiddenSlots[this.round] = 1;
          activePlayer.numberOfSkulls--;
        }
        if (card === 'rose') {
          activePlayer.hiddenSlots[this.round] = 2;
          activePlayer.numberOfRoses--;
        }
        // Set slots
        activePlayer.slots[this.round] = 1;
      }
      // Record previous variables
      const previous = this.getActiveDetails();
      // Increase cardsPlayed
      this.cardsPlayed++;
      // Check if round has increased
      if (
        this.cardsPlayed %
          (this.players.length - this.eliminatedPlayers) ===
        0
      ) {
        this.round++;
      }
      this.increaseActivePlayerIndex();
      const current = this.getActiveDetails();
      this.emitGameState(
        `<span class="${current.color}--text">${current.username}</span>'s turn`,
        `<span class="${previous.color}--text">${
          previous.username
        }</span> placed card ${previous.round + 1} down`,
        'placingCards',
      );
    });

    // raiseBid: When a player submits an initial bid
    newPlayer.socket.on('raiseBid', ({ bidNumber }) => {
      this.currentBidNumber = bidNumber;
      const previous = this.getActiveDetails();
      if (this.currentBidNumber !== this.cardsPlayed) {
        this.increaseActivePlayerIndex();
        const current = this.getActiveDetails();
        this.emitGameState(
          `<span class="${current.color}--text">${current.username}</span>'s turn to increase the bid or pass`,
          `<span class="${previous.color}--text">${previous.username}</span> bid they can flip ${this.currentBidNumber} cards`,
          'bid',
        );
      }
      if (this.currentBidNumber === this.cardsPlayed) {
        this.setupChallenge();
        this.emitGameState(
          `<span class="${previous.color}--text">${previous.username}</span> won the bid and needs to flip ${this.currentBidNumber} cards`,
          `<span class="${previous.color}--text">${previous.username}</span> bid they can flip ${this.currentBidNumber} cards`,
          'challenge',
          previous.username,
        );
      }
    });

    // passBid: When a player passes a bid. Need to go to the next non-passed player or if everyone has passed, move to challenge phase
    newPlayer.socket.on('passBid', () => {
      this.passedBid[this.activePlayerIndex] = 1;
      const previous = this.getActiveDetails();
      const allPlayersPassed = this.increaseActivePlayerIndex();
      const current = this.getActiveDetails();
      if (!allPlayersPassed) {
        this.emitGameState(
          `<span class="${current.color}--text">${current.username}</span>'s turn to increase the bid or pass`,
          `<span class="${previous.color}--text">${previous.username}</span> passed their bid`,
          'bid',
        );
      }
      if (allPlayersPassed) {
        this.setupChallenge();
        this.emitGameState(
          `<span class="${current.color}--text">${current.username}</span> won the bid and needs to flip ${this.currentBidNumber} cards`,
          `<span class="${previous.color}--text">${previous.username}</span> passed their bid`,
          'challenge',
        );
      }
    });

    // flipOver: When a player is challenging and flips over a card
    newPlayer.socket.on('flipOver', ({ username }) => {
      const flippedPlayer = this.findPlayer(username);
      if (flippedPlayer !== null) {
        const successfulFlip = flippedPlayer.flipOverCard();
        if (successfulFlip) {
          this.onSuccessfulFlip(newPlayer, flippedPlayer);
        }
        if (!successfulFlip) {
          this.onUnsuccessfulFlip(newPlayer, flippedPlayer);
        }
      }
    });

    //approveGainPoint: player clicks OK to approve they have gained a point
    newPlayer.socket.on('approveGainPoint', () => {
      const tempCardsFlipped = this.cardsFlipped;
      this.resetRound();
      const current = this.getActiveDetails();
      this.emitGameState(
        `<span class="${current.color}--text">${current.username}</span>'s turn`,
        `<span class="${current.color}--text">${current.username}</span> successfully flipped ${tempCardsFlipped} coconuts and gains a pearl`,
        'placingCards',
      );
    });

    //approveGainPoint: player clicks OK to approve they have either lost a random card or is eliminated
    newPlayer.socket.on('approveLoseRandom', () => {
      this.resetRound();
      const current = this.getActiveDetails();
      this.emitGameState(
        `<span class="${current.color}--text">${current.username}</span>'s turn`,
        `<span class="${current.color}--text">${current.username}</span> randomly loses an card`,
        'placingCards',
      );
    });

    // removePick: activePlayer picks a card to remove when flipping their own skull
    newPlayer.socket.on('removePick', ({ typeOfCard }) => {
      if (typeOfCard === 'skull') {
        newPlayer.totalSkulls--;
      }
      if (typeOfCard === 'rose') {
        newPlayer.totalRoses--;
      }
      const totalCardsLeft =
        newPlayer.totalRoses + newPlayer.totalSkulls;
      newPlayer.slots[totalCardsLeft] = 4;
      this.resetRound();
      const current = this.getActiveDetails();
      this.emitGameState(
        `<span class="${current.color}--text">${current.username}</span> starts the next round`,
        `<span class="${current.color}--text">${current.username}</span> has chosen a card to remove`,
        'placingCards',
        undefined,
        undefined,
        undefined,
        undefined,
        {
          totalSkulls: newPlayer.totalSkulls,
          totalRoses: newPlayer.totalRoses,
        },
      );
    });

    // startNextRound: eliminated player chooses who to start next round
    newPlayer.socket.on('startNextRound', ({ username }) => {
      newPlayer.isEliminated = true;
      const current = this.getActiveDetails();
      this.activePlayerIndex = this.players.findIndex(
        (player) => player.username === username,
      );
      const nextPlayer = this.findPlayer(username);
      this.resetRound();
      this.emitGameState(
        `<span class="${nextPlayer?.color}--text">${nextPlayer?.username}</span> starts the next round`,
        `<span class="${current.color}--text">${current.username}</span> is eliminated and chooses <span class="${nextPlayer?.color}--text">${nextPlayer?.username}</span> to start next`,
        'placingCards',
        nextPlayer?.username,
        undefined,
        undefined,
        undefined,
        {
          totalSkulls: newPlayer.totalSkulls,
          totalRoses: newPlayer.totalRoses,
        },
      );
    });

    // restartGame
    newPlayer.socket.on('restartGame', () => {
      this.players.forEach((p) => p.resetAllStates());
      this.gameSetup();
    });
  }

  onSuccessfulFlip(newPlayer: Player, flippedPlayer: Player): void {
    this.cardsFlipped++;
    // Successful flip, hasn't flipped over all yet
    if (this.cardsFlipped !== this.cardsPlayed) {
      const current = this.getActiveDetails();
      this.emitGameState(
        `<span class="${current.color}--text">${
          current.username
        }</span> needs to flip ${
          this.currentBidNumber - this.cardsFlipped
        } more cards`,
        current.username === flippedPlayer.username
          ? `<span class="${current.color}--text">${current.username}</span> flipped <span class="${flippedPlayer.color}--text">their own</span> coconut on flip ${this.cardsFlipped}`
          : `<span class="${current.color}--text">${current.username}</span> flipped <span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span>'s coconut on flip ${this.cardsFlipped}`,
        'challenge',
      );
    }
    // Successfully flipped last card they needed to, gain a point
    if (this.cardsFlipped === this.currentBidNumber) {
      newPlayer.points++;
      // Check if player won
      if (newPlayer.points === this.pointsToWin) {
        this.playerWins(newPlayer, 'points');
        return;
      }
      const current = this.getActiveDetails();
      this.emitGameState(
        `<span class="${current.color}--text">${current.username}</span> flipped ${this.cardsFlipped} coconuts and gains a pearl`,
        `<span class="${current.color}--text">${current.username}</span> flipped <span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span>'s coconut on flip ${this.cardsFlipped}`,
        'gainPoint',
      );
    }
  }

  onUnsuccessfulFlip(newPlayer: Player, flippedPlayer: Player): void {
    // Flipped own skull
    if (flippedPlayer.username === newPlayer.username) {
      this.onUnsuccessfulFlipOwn(newPlayer, flippedPlayer);
    }
    // Flipped someone elses skull, randomly loses a card
    if (flippedPlayer.username !== newPlayer.username) {
      this.onUnsuccessfulFlipOther(newPlayer, flippedPlayer);
    }
  }

  onUnsuccessfulFlipOwn(
    newPlayer: Player,
    flippedPlayer: Player,
  ): void {
    const current = this.getActiveDetails();
    // Only has 1 card left, eliminated from game, chose own skull so gets to choose who to start next round
    if (newPlayer.totalRoses + newPlayer.totalSkulls === 1) {
      this.eliminatedPlayers++;
      newPlayer.slots[0] = 4;
      // Player wins, end game
      if (this.eliminatedPlayers === this.players.length - 1) {
        //Find all eliminated players, and exclude myself and thats the winner
        const winningPlayer = this.players.filter(
          (p) =>
            (p.isEliminated =
              false && p.username !== newPlayer.username),
        );
        this.playerWins(winningPlayer[0], 'eliminated'); // Could go wrong....
        return;
      }
      this.emitGameState(
        `<span class="${current.color}--text">${current.username}</span> is choosing a player to start the next round`,
        `<span class="${current.color}--text">${current.username}</span> has no cards left and has been eliminated`,
        'eliminated',
      );
      return;
    }
    // Has more than 1 card left, needs to choose a card to remove
    this.emitGameState(
      `<span class="${current.color}--text">${current.username}</span> is choosing a card to remove`,
      `<span class="${current.color}--text">${current.username}</span> flipped <span class="${flippedPlayer.color}--text">their own</span> crab`,
      'removeCardsPick',
      undefined,
      undefined,
      undefined,
      undefined,
      {
        totalSkulls: newPlayer.totalSkulls,
        totalRoses: newPlayer.totalRoses,
      },
    );
  }

  onUnsuccessfulFlipOther(
    newPlayer: Player,
    flippedPlayer: Player,
  ): void {
    // Remove random card
    const skullPicked =
      Math.random() <
      newPlayer.numberOfSkulls /
        (newPlayer.numberOfRoses + newPlayer.numberOfSkulls);
    if (skullPicked) {
      newPlayer.totalSkulls--;
    } else {
      newPlayer.totalRoses--;
    }
    const totalCardsLeft =
      newPlayer.totalRoses + newPlayer.totalSkulls;
    newPlayer.slots[totalCardsLeft] = 4;
    const current = this.getActiveDetails();
    // Eliminated from the game if 0 cards left
    this.currentMessageRandomlyLose = `<span class="${current.color}--text">${current.username}</span> randomly loses a card`;
    if (totalCardsLeft === 0) {
      this.eliminatedPlayers++;
      newPlayer.isEliminated = true;
      this.currentMessageRandomlyLose = `<span class="${current.color}--text">${current.username}</span> has no more cards and is eliminated</br>`;
      this.activePlayerIndex = this.players.findIndex(
        (player) => player.username === flippedPlayer.username,
      );
    }
    // One player left, then that player wins the game
    if (this.eliminatedPlayers === this.players.length - 1) {
      this.playerWins(flippedPlayer, 'eliminated');
      return;
    }
    this.emitGameState(
      `${this.currentMessageRandomlyLose}`,
      `<span class="${current.color}--text">${current.username}</span> flipped <span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span>'s crab`,
      'loseRandom',
    );
  }

  getActiveDetails(): ActiveDetails {
    return {
      color: this.players[this.activePlayerIndex].color,
      username: this.players[this.activePlayerIndex].username,
      round: this.round,
    };
  }

  resetRound(): void {
    this.round = 0;
    this.cardsPlayed = 0;
    this.currentBidNumber = 0;
    this.passedBid = new Array(this.players.length).fill(0);
    this.cardsFlipped = 0;
    this.players.forEach((player) => {
      player.slots = player.slots.map((slot) => (slot === 4 ? 4 : 0));
      player.hiddenSlots = [0, 0, 0, 0];
      player.numberOfRoses = player.totalRoses;
      player.numberOfSkulls = player.totalSkulls;
      player.nextToFlipIndex = 0;
    });
  }

  // return true if everyone passed and we want to go to challenge mode
  increaseActivePlayerIndex(): boolean {
    try {
      // Find the next player who has not passed
      do {
        if (this.activePlayerIndex === this.players.length - 1) {
          this.activePlayerIndex = 0;
        } else {
          this.activePlayerIndex++;
        }
      } while (
        this.passedBid[this.activePlayerIndex] === 1 ||
        this.players[this.activePlayerIndex].isEliminated === true
      );
      const totalPassedPlayers = this.passedBid.reduce(
        (accumulator, curr) => accumulator + curr,
      );
      // we went through everyone and they all passed...
      if (
        totalPassedPlayers ===
        this.players.length - this.eliminatedPlayers - 1
      )
        return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  setupChallenge(): void {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].setupNextToFlipIndex();
    }
  }

  playerWins(winningPlayer: Player, reason: string): void {
    let logMessage = `<span class="${winningPlayer.color}--text">${winningPlayer.username}</span> reached ${this.pointsToWin} pearls`;
    if (reason === 'eliminated') {
      logMessage = `All other players have no cards left and have been eliminated`;
    }
    this.activePlayerIndex = this.players.findIndex(
      (player) => player.username === winningPlayer.username,
    );
    this.emitGameState(
      `<span class="${winningPlayer.color}--text">${winningPlayer.username}</span> wins the game!`,
      logMessage,
      'playerWins',
      winningPlayer.username,
    );
  }

  emitUpdatedLobby(): void {
    this.io.in(this.roomId).emit('updateLobby', {
      usernames: this.getUsernames(),
      hostUsername: this.host.username,
      pointsToWin: this.pointsToWin,
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
    this.gameSetup();
  }

  gameSetup(): void {
    this.round = 0;
    this.cardsPlayed = 0;
    this.currentBidNumber = 0;
    this.cardsFlipped = 0;
    this.eliminatedPlayers = 0;
    this.passedBid = new Array(this.players.length).fill(0);
    this.activePlayerIndex = Math.floor(
      Math.random() * this.players.length,
    );
    const current = this.getActiveDetails();
    this.emitGameState(
      `<span class="${current.color}--text">${current.username}</span>'s turn`,
      `Game start!`,
      'placingCards',
    );
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
        isEliminated: player.isEliminated,
      };
    });
  }

  /**
   * emitGameState: used to emit the game state to all players in room. pass in variables to function, or undefined for defaults
   */
  emitGameState(
    currentMessage: string,
    addedLogMessage: string,
    gamePhase: string,
    activePlayer: string = this.getActiveDetails().username,
    playerStates: PlayerButtonState[] = this.getPlayerStates(),
    placingCardsVariables: { round: number } = { round: this.round },
    bidVariables: { biddingMinimum: number; cardsPlayed: number } = {
      biddingMinimum: this.currentBidNumber + 1,
      cardsPlayed: this.cardsPlayed,
    },
    removeCardsVariables: {
      totalSkulls: number;
      totalRoses: number;
    } = {
      totalSkulls: 1,
      totalRoses: 3,
    },
  ): void {
    this.io.in(this.roomId).emit('updateGameState', {
      currentMessage: currentMessage,
      addedLogMessage: addedLogMessage,
      gamePhase: gamePhase,
      activePlayer: activePlayer,
      playerStates: playerStates,
      placingCardsVariables: placingCardsVariables,
      bidVariables: bidVariables,
      removeCardsVariables: removeCardsVariables,
    });
  }
}
