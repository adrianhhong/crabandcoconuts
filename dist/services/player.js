"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(username, socket, color) {
        this.username = '';
        /**
         * 0: empty: Slot with no card on it
         * 1: facedown
         * 2: faceup-rose
         * 3: faceup-skull
         * 4: disabled: Player has less than 4 cards, and so a certain number of slots will be disabled
         */
        this.slots = [0, 0, 0, 0];
        /**
         * 0: nothing
         * 1: skull
         * 2: rose
         */
        this.hiddenSlots = [0, 0, 0, 0];
        this.points = 0; // number of rounds won
        this.numberOfSkulls = 1; // number of skulls left to place
        this.numberOfRoses = 3; // number of roses left to place
        this.nextToFlipIndex = 0;
        this.totalSkulls = 1; // number of skulls in hand
        this.totalRoses = 3; // number of roses in hand
        this.isEliminated = false;
        this.username = username;
        this.socket = socket;
        this.color = color;
    }
    setupNextToFlipIndex() {
        this.nextToFlipIndex = this.slots.lastIndexOf(1);
    }
    /**
     *
     * @returns true if successful flip, false if failed flip
     */
    flipOverCard() {
        const flippedHiddenCard = this.hiddenSlots[this.nextToFlipIndex];
        if (flippedHiddenCard === 1) {
            // you lost the challenge, and we need to remove a card from you
            this.slots[this.nextToFlipIndex] = 3;
            return false;
        }
        if (flippedHiddenCard === 2) {
            this.slots[this.nextToFlipIndex] = 2;
            this.nextToFlipIndex--;
            return true;
        }
        return false;
    }
    resetAllStates() {
        this.slots = [0, 0, 0, 0];
        this.hiddenSlots = [0, 0, 0, 0];
        this.points = 0;
        this.numberOfSkulls = 1;
        this.numberOfRoses = 3;
        this.nextToFlipIndex = 0;
        this.totalSkulls = 1;
        this.totalRoses = 3;
        this.isEliminated = false;
    }
}
exports.default = Player;
