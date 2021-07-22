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
  passedBid: RoomType['passedBid'] = []; // Array that is 1 if the player passed, 0 if the player has not passed their bid
  cardsFlipped = 0;
  eliminatedPlayers = 0;

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
    // disconnect: When a player disconnects, remove player from room
    newPlayer.socket.on('disconnect', () => {
      logger.info(`${newPlayer.username} disconnected`);
      this.removePlayer(newPlayer.username);
      this.emitUpdatedPlayerList();
    });

    // playCard: When a player plays a card (skull or rose) update their hiddenSlots and slots
    newPlayer.socket.on('playCard', ({ card }) => {
      // Set hiddenSlots and numberOfRoses/Skulls
      if (card === 'skull') {
        this.players[this.activePlayerIndex].hiddenSlots[
          this.round
        ] = 1;
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
      if (
        this.cardsPlayed %
          (this.players.length - this.eliminatedPlayers) ===
        0
      ) {
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
        playerStates: this.getPlayerStates(),
        activePlayer: current.player,
        gamePhase: 'placingCards',
        placingCardsVariables: { round: this.round },
        bidVariables: {
          biddingMinimum: 1, // Not using
          cardsPlayed: this.cardsPlayed,
        },
        removeCardsVariables: {
          totalSkulls: 1, // Not using
          totalRoses: 3, // Not using
        },
      });
    });

    // raiseBid: When a player submits an initial bid
    newPlayer.socket.on('raiseBid', ({ bidNumber }) => {
      this.currentBidNumber = bidNumber;
      this.currentBidder = newPlayer.username;
      const previous = this.getActiveDetails();
      if (this.currentBidNumber === this.cardsPlayed) {
        this.setupChallenge();
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${previous.color}--text">${previous.player}</span> won the bid! They need to flip over ${this.currentBidNumber} cards`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> bid they can flip over ${this.currentBidNumber} cards`,
          playerStates: this.getPlayerStates(),
          activePlayer: previous.player,
          gamePhase: 'challenge',
          placingCardsVariables: { round: this.round },
          bidVariables: {
            biddingMinimum: this.currentBidNumber + 1,
            cardsPlayed: this.cardsPlayed,
          },
          removeCardsVariables: {
            totalSkulls: 1, // Not using
            totalRoses: 3, // Not using
          },
        });
      } else {
        this.increaseActivePlayerIndex();
        const current = this.getActiveDetails();
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn to increase the bid or pass`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> bid they can flip over ${this.currentBidNumber} cards`,
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          gamePhase: 'bid',
          placingCardsVariables: { round: this.round },
          bidVariables: {
            biddingMinimum: this.currentBidNumber + 1,
            cardsPlayed: this.cardsPlayed,
          },
          removeCardsVariables: {
            totalSkulls: 1, // Not using
            totalRoses: 3, // Not using
          },
        });
      }
    });

    // passBid: When a player passes a bid. Need to go to the next non-passed player or if everyone has passed, move to challenge phase
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
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          gamePhase: 'challenge',
          placingCardsVariables: { round: this.round },
          bidVariables: {
            biddingMinimum: this.currentBidNumber + 1,
            cardsPlayed: this.cardsPlayed,
          },
          removeCardsVariables: {
            totalSkulls: 1, // Not using
            totalRoses: 3, // Not using
          },
        });
      } else {
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn to increase the bid or pass`,
          addedLogMessage: `<span class="${previous.color}--text">${previous.player}</span> passed their bid`,
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          gamePhase: 'bid',
          placingCardsVariables: { round: this.round },
          bidVariables: {
            biddingMinimum: this.currentBidNumber + 1,
            cardsPlayed: this.cardsPlayed,
          },
          removeCardsVariables: {
            totalSkulls: 1, // Not using
            totalRoses: 3, // Not using
          },
        });
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
      this.io.in(this.roomId).emit('updateGameState', {
        currentMessage: `<span class="${current.color}--text">${current.player}</span> starts the next round`,
        addedLogMessage: `<span class="${current.color}--text">${current.player}</span> has chosen a card to remove`,
        playerStates: this.getPlayerStates(),
        activePlayer: current.player,
        gamePhase: 'placingCards',
        placingCardsVariables: { round: this.round },
        bidVariables: {
          biddingMinimum: 1, // Not using
          cardsPlayed: this.cardsPlayed,
        },
        removeCardsVariables: {
          totalSkulls: newPlayer.totalSkulls,
          totalRoses: newPlayer.totalRoses,
        },
      });
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
      this.io.in(this.roomId).emit('updateGameState', {
        currentMessage: `<span class="${nextPlayer?.color}--text">${nextPlayer?.username}</span> starts the next round`,
        addedLogMessage: `<span class="${current.color}--text">${current.player}</span> is elminated and has chosen <span class="${nextPlayer?.color}--text">${nextPlayer?.username}</span> to start the next round`,
        playerStates: this.getPlayerStates(),
        activePlayer: nextPlayer?.username,
        gamePhase: 'placingCards',
        placingCardsVariables: { round: this.round },
        bidVariables: {
          biddingMinimum: 1, // Not using
          cardsPlayed: this.cardsPlayed,
        },
        removeCardsVariables: {
          totalSkulls: newPlayer.totalSkulls,
          totalRoses: newPlayer.totalRoses,
        },
      });
    });
  }

  onSuccessfulFlip(newPlayer: Player, flippedPlayer: Player): void {
    this.cardsFlipped++;
    // Successful flip, hasn't flipped over all yet
    if (this.cardsFlipped !== this.cardsPlayed) {
      const current = this.getActiveDetails();
      this.io.in(this.roomId).emit('updateGameState', {
        currentMessage: `<span class="${current.color}--text">${
          current.player
        }</span> needs to flip over ${
          this.currentBidNumber - this.cardsFlipped
        } more`,
        addedLogMessage: `<span class="${current.color}--text">${current.player}</span> flipped over <span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span> 's rose on turn ${this.cardsFlipped}`,
        playerStates: this.getPlayerStates(),
        activePlayer: current.player,
        gamePhase: 'challenge',
        placingCardsVariables: { round: this.round },
        bidVariables: {
          biddingMinimum: 1, // Not using
          cardsPlayed: this.cardsPlayed,
        },
        removeCardsVariables: {
          totalSkulls: 1, // Not using
          totalRoses: 3, // Not using
        },
      });
    }
    // Successfully flipped last card they needed to, gain a point
    if (this.cardsFlipped === this.currentBidNumber) {
      const tempCardsFlipped = this.cardsFlipped;
      this.resetRound();
      newPlayer.points++;
      const current = this.getActiveDetails();
      this.io.in(this.roomId).emit('updateGameState', {
        currentMessage: `<span class="${current.color}--text">${current.player}</span> starts the next round`,
        addedLogMessage: `<span class="${current.color}--text">${current.player}</span> was successful at flipping over ${tempCardsFlipped} cards and has gained a point!`,
        playerStates: this.getPlayerStates(),
        activePlayer: current.player,
        gamePhase: 'placingCards',
        placingCardsVariables: { round: this.round },
        bidVariables: {
          biddingMinimum: 1, // Not using
          cardsPlayed: this.cardsPlayed,
        },
        removeCardsVariables: {
          totalSkulls: 1, // Not using
          totalRoses: 3, // Not using
        },
      });
    }
  }

  onUnsuccessfulFlip(newPlayer: Player, flippedPlayer: Player): void {
    const current = this.getActiveDetails();
    // Flipped own skull
    if (flippedPlayer.username === newPlayer.username) {
      // Only has 1 card left, eliminated from game, chose own skull so gets to choose who to start next round
      if (newPlayer.totalRoses + newPlayer.totalSkulls === 1) {
        this.eliminatedPlayers++;
        newPlayer.slots[0] = 4;
        // TODO: CHeck if only one player left so the one player left wins the game
        if (this.eliminatedPlayers === this.players.length - 1) {
          //Find all eliminated players, and exclude myself and thats the winner
          const winningPlayer = this.players.filter(
            (p) =>
              (p.isEliminated =
                false && p.username !== newPlayer.username),
          );
          this.playerWins(winningPlayer[0]); // Could go wrong....
        } else {
          this.io.in(this.roomId).emit('updateGameState', {
            currentMessage: `<span class="${current.color}--text">${current.player}</span> is choosing a player to start the next round`,
            addedLogMessage: `<span class="${current.color}--text">${current.player}</span> has no cards and has been eliminated`,
            playerStates: this.getPlayerStates(),
            activePlayer: current.player,
            gamePhase: 'eliminated',
            placingCardsVariables: { round: this.round },
            bidVariables: {
              biddingMinimum: 1, // Not using
              cardsPlayed: this.cardsPlayed,
            },
            removeCardsVariables: {
              totalSkulls: 1, // Not using
              totalRoses: 3, // Not using
            },
          });
        }
      } else {
        // Has more than 1 card left, needs to choose a card to remove
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${current.color}--text">${current.player}</span> needs to choose a card to remove`,
          addedLogMessage: `<span class="${current.color}--text">${current.player}</span> hit <span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span>'s skull`,
          playerStates: this.getPlayerStates(),
          activePlayer: current.player,
          gamePhase: 'removeCardsPick',
          placingCardsVariables: { round: this.round },
          bidVariables: {
            biddingMinimum: 1, // Not using
            cardsPlayed: this.cardsPlayed,
          },
          removeCardsVariables: {
            totalSkulls: newPlayer.totalSkulls,
            totalRoses: newPlayer.totalRoses,
          },
        });
      }
    }
    // Flipped someone elses skull, randomly loses a card
    if (flippedPlayer.username !== newPlayer.username) {
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
      let eliminatedMessage = '';
      // Eliminated from the game
      if (totalCardsLeft === 0) {
        this.eliminatedPlayers++;
        newPlayer.isEliminated = true;
        eliminatedMessage = `<span class="${current.color}--text">${current.player}</span> has no more cards and is eliminated</br>`;
        this.activePlayerIndex = this.players.findIndex(
          (player) => player.username === flippedPlayer.username,
        );
      }
      // One player left, then that player wins the game
      if (this.eliminatedPlayers === this.players.length - 1) {
        this.playerWins(flippedPlayer);
      } else {
        this.resetRound();
        // Start next round
        this.io.in(this.roomId).emit('updateGameState', {
          currentMessage: `<span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span> starts the next round`,
          addedLogMessage: `${eliminatedMessage}<span class="${current.color}--text">${current.player}</span> hit <span class="${flippedPlayer.color}--text">${flippedPlayer.username}</span>'s skull, and randomly loses a card.`,
          playerStates: this.getPlayerStates(),
          activePlayer: this.players[this.activePlayerIndex].username,
          gamePhase: 'placingCards',
          placingCardsVariables: { round: this.round },
          bidVariables: {
            biddingMinimum: 1, // Not using
            cardsPlayed: this.cardsPlayed,
          },
          removeCardsVariables: {
            totalSkulls: newPlayer.totalSkulls,
            totalRoses: newPlayer.totalRoses,
          },
        });
      }
    }
  }

  getActiveDetails(): ActiveDetails {
    return {
      color: this.players[this.activePlayerIndex].color,
      player: this.players[this.activePlayerIndex].username,
      round: this.round,
    };
  }

  resetRound(): void {
    this.round = 0;
    this.cardsPlayed = 0;
    this.currentBidNumber = 0;
    this.currentBidder = '';
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

  playerWins(winningPlayer: Player): void {
    // TODO: what should we do when we win???
    console.log(winningPlayer);
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
    this.activePlayerIndex = Math.floor(
      Math.random() * this.players.length,
    );
    const current = this.getActiveDetails();
    this.io.in(this.roomId).emit('updateGameState', {
      currentMessage: `<span class="${current.color}--text">${current.player}</span>'s turn to start`,
      addedLogMessage: ``,
      playerStates: this.getPlayerStates(),
      activePlayer: current.player,
      gamePhase: 'placingCards',
      placingCardsVariables: { round: this.round },
      bidVariables: {
        biddingMinimum: 1, // Not using
        cardsPlayed: this.cardsPlayed,
      },
      removeCardsVariables: {
        totalSkulls: 1, // Not using
        totalRoses: 3, // Not using
      },
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
        isEliminated: player.isEliminated,
      };
    });
  }
}
