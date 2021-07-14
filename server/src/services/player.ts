import { PlayerType } from '../types';

export default class Player {
  username: PlayerType['username'] = '';
  socket: PlayerType['socket'];
  /**
   * 0: empty: Slot with no card on it
   * 1: faceup-skull
   * 2: faceup-rose
   * 3: facedown
   * 4: clickable: Player can click to add a new card facedown
   * 5: disabled: Player has less than 4 cards, and so a certain number of slots will be disabled
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

  constructor(
    username: PlayerType['username'],
    socket: PlayerType['socket'],
    color: PlayerType['color'],
  ) {
    this.username = username;
    this.socket = socket;
    this.color = color;
  }
}
