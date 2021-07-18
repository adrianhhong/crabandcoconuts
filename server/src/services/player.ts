import { PlayerType } from '../types';

export default class Player {
  username: PlayerType['username'] = '';
  socket: PlayerType['socket'];
  /**
   * 0: empty: Slot with no card on it
   * 1: facedown
   * 2: faceup-rose
   * 3: faceup-skull
   * 4: disabled: Player has less than 4 cards, and so a certain number of slots will be disabled
   */
  slots: PlayerType['slots'] = [0, 0, 0, 0];

  /**
   * 0: nothing
   * 1: skull
   * 2: rose
   */
  hiddenSlots: PlayerType['slots'] = [0, 0, 0, 0];
  color: PlayerType['color'];
  points: PlayerType['points'] = 0; // number of rounds won
  numberOfSkulls: PlayerType['numberOfSkulls'] = 1; // number of skulls left
  numberOfRoses: PlayerType['numberOfRoses'] = 3; // number of skulls left
  nextToFlipIndex: PlayerType['nextToFlipIndex'] = 0;

  constructor(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
    color: PlayerType['color'],
  ) {
    this.username = username;
    this.socket = socket;
    this.color = color;
  }

  setupNextToFlipIndex(): void {
    this.nextToFlipIndex = this.slots.lastIndexOf(1);
  }

  /**
   *
   * @returns true if successful flip, false if failed flip
   */
  flipOverCard(): boolean {
    const flippedHiddenCard = this.hiddenSlots[this.nextToFlipIndex];
    if (flippedHiddenCard === 1) {
      // you lost the challenge, and we need to remove a card from you
      this.slots[this.nextToFlipIndex] = 3;
      // emit the updated game state to everyone that you lost.
      return false;
    }
    if (flippedHiddenCard === 2) {
      this.slots[this.nextToFlipIndex] = 2;
      this.nextToFlipIndex--;
      // Emit the updated game state to everyone...
      return true;
    }
    return false;
  }
}
