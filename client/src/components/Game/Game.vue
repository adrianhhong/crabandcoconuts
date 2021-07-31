<template>
  <div>
    <v-container class="text-center" style="max-width: 600px">
      <!-- Messages -->
      <v-card height="180" class="my-4" color="backing">
        <v-card-title>
          <span v-html="currentMessage"></span>
        </v-card-title>
        <v-card-text
          style="max-height: 105px; overflow-y: auto"
          class="text-left"
        >
          <div v-for="(message, index) in messageLog" :key="index">
            <span v-html="message"></span>
            <br />
          </div>
        </v-card-text>
      </v-card>
      <!-- Game Slots -->
      <v-simple-table class="backing">
        <template v-slot:default>
          <tbody>
            <tr v-for="item in playerStates" :key="item.username">
              <td class="pr-1">{{ item.username }}</td>
              <td class="px-1">
                <v-icon> $pearl </v-icon>
                {{ item.points }}
              </td>
              <td class="px-1 py-3">
                <GameButtons
                  :buttonType="item.slots[0]"
                  :buttonColor="item.color"
                />
              </td>
              <td class="px-1 py-3">
                <GameButtons
                  :buttonType="item.slots[1]"
                  :buttonColor="item.color"
                />
              </td>
              <td class="px-1 py-3">
                <GameButtons
                  :buttonType="item.slots[2]"
                  :buttonColor="item.color"
                />
              </td>
              <td class="pl-1 py-3">
                <GameButtons
                  :buttonType="item.slots[3]"
                  :buttonColor="item.color"
                />
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!-- Buttons -->
      <div v-if="!isEliminated">
        <v-container
          class="my-4"
          v-if="
            initiateBiddingMode === false &&
            gamePhase === 'placingCards'
          "
        >
          <v-row>
            <v-col col="6">
              <v-btn
                color="buttons"
                block
                :disabled="
                  username !== activePlayer || numberOfRoses <= 0
                "
                @click="playCard('rose')"
              >
                Coconut ({{ numberOfRoses }})
              </v-btn>
            </v-col>
            <v-col col="6">
              <v-btn
                color="buttons"
                block
                :disabled="
                  username !== activePlayer || numberOfSkulls <= 0
                "
                @click="playCard('skull')"
              >
                Crab ({{ numberOfSkulls }})
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                color="buttons"
                block
                :disabled="
                  placingCardsVariables.round === 0 ||
                  username !== activePlayer
                "
                @click="initiateBiddingMode = true"
              >
                Challenge
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row
            v-if="
              initiateBiddingMode ||
              (gamePhase === 'bid' && username === activePlayer)
            "
          >
            <v-col cols="5">
              <v-btn
                icon
                :disabled="
                  username !== activePlayer ||
                  bidNumber === bidVariables.biddingMinimum
                "
              >
                <v-icon @click="changeBidNumber(-1)">
                  mdi-minus
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="2">
              <h2>{{ bidNumber }}</h2>
            </v-col>
            <v-col cols="5">
              <v-btn
                icon
                :disabled="
                  username !== activePlayer ||
                  bidNumber === bidVariables.cardsPlayed
                "
              >
                <v-icon @click="changeBidNumber(1)">
                  mdi-plus
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="initiateBiddingMode">
            <v-col>
              <v-btn color="buttons" block @click="confirmBid">
                Confirm
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="buttons"
                block
                @click="initiateBiddingMode = false"
              >
                Back
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="gamePhase === 'bid'">
            <v-col>
              <v-btn
                color="buttons"
                block
                :disabled="username !== activePlayer"
                @click="confirmBid"
              >
                Raise
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="buttons"
                block
                :disabled="username !== activePlayer"
                @click="passBid"
              >
                Pass
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container
          v-if="
            gamePhase === 'challenge' && activePlayer === username
          "
        >
          <v-row>
            <template v-for="player in playerStates">
              <v-col
                :key="player.username"
                cols="12"
                xs="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
              >
                <v-btn
                  :value="player.username"
                  :color="player.color"
                  block
                  :disabled="
                    (player.username !== username &&
                      !flippedOverAllMyOwn) ||
                    (player.username !== username &&
                      player.nextToFlipIndex === -1) ||
                    (player.username === username &&
                      flippedOverAllMyOwn)
                  "
                  @click="flipOver(player)"
                >
                  {{ player.username }} ({{
                    player.nextToFlipIndex + 1
                  }})
                </v-btn>
              </v-col>
            </template>
          </v-row>
        </v-container>
        <v-container
          v-if="
            gamePhase === 'gainPoint' && activePlayer === username
          "
        >
          <v-row>
            <v-col>
              <v-btn block @click="approveGainPoint()"> OK! </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="gamePhase === 'loseRandom'">
          <v-row>
            <v-col>
              <v-btn block @click="approveLoseRandom()"> OK! </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-if="gamePhase === 'removeCardsPick'">
          <v-row>
            <v-col>
              <v-btn
                :color="activePlayer.color"
                block
                :disable="removeCardsVariables.totalRoses === 0"
                @click="removePick('rose')"
              >
                Remove coconut ({{ removeCardsVariables.totalRoses }})
              </v-btn></v-col
            >
            <v-col>
              <v-btn
                :color="activePlayer.color"
                block
                :disable="removeCardsVariables.totalSkulls === 0"
                @click="removePick('skull')"
              >
                Remove Crab ({{ removeCardsVariables.totalSkulls }})
              </v-btn></v-col
            >
          </v-row>
        </v-container>
        <v-container
          v-if="
            gamePhase === 'eliminated' && activePlayer === username
          "
        >
          <v-row>
            <template v-for="player in playerStatesWithoutEliminated">
              <v-col
                :key="player.username"
                cols="12"
                xs="12"
                sm="6"
                md="6"
                lg="6"
                xl="6"
              >
                <v-btn
                  :value="player.username"
                  :color="player.color"
                  @click="startNextRound(player)"
                >
                  {{ player.username }}
                </v-btn>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </div>
      <div v-if="isEliminated && gamePhase !== 'playerWins'">
        <h1>You have been eliminated</h1>
      </div>
      <v-container v-if="gamePhase === 'playerWins'">
        <v-row>
          <v-col>
            <h1>{{ activePlayer }} wins the game!</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="buttons" @click="restartGame()">
              Play again
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import GameButtons from './GameButtons.vue';
import { mapState } from 'vuex';
export default {
  name: 'Game',
  components: {
    GameButtons,
  },
  data: () => {
    return {
      stopButtonRequests: false,
      bidNumber: 1,
      messageLog: [],
      initiateBiddingMode: false,
      numberOfSkulls: 0,
      numberOfRoses: 0,
      flippedOverAllMyOwn: false,
      playerStatesWithoutEliminated: [],
      isEliminated: false,
    };
  },
  computed: {
    ...mapState([
      'username',
      'currentMessage',
      'addedLogMessage',
      'activePlayer',
      'gamePhase',
      'playerStates',
      'placingCardsVariables',
      'bidVariables',
      'removeCardsVariables',
    ]),
  },
  watch: {
    addedLogMessage(newAddedLogMessage) {
      this.messageLog.unshift(newAddedLogMessage);
    },
    bidVariables(newBidVariables) {
      this.bidNumber = newBidVariables.biddingMinimum;
    },
    playerStates(newPlayerStates) {
      this.stopButtonRequests = false;
      if (this.gamePhase === 'placingCards') {
        const userPlayerState = newPlayerStates.find(
          (playerState) => playerState.username === this.username,
        );
        this.numberOfSkulls = userPlayerState.numberOfSkulls;
        this.numberOfRoses = userPlayerState.numberOfRoses;
      }
      if (this.gamePhase === 'challenge') {
        const activePlayerState = this.playerStates.find(
          (state) => state.username === this.activePlayer,
        );
        if (activePlayerState) {
          this.flippedOverAllMyOwn =
            activePlayerState.nextToFlipIndex === -1;
        }
      }
      if (this.gamePhase === 'eliminated') {
        this.playerStatesWithoutEliminated = this.playerStates.filter(
          (state) =>
            state.isEliminated === false &&
            state.username !== this.username,
        );
      }
      const indexOfPlayer = this.playerStates.findIndex(
        (state) => state.username === this.username,
      );
      this.isEliminated =
        this.playerStates[indexOfPlayer].isEliminated;
    },
  },
  methods: {
    changeBidNumber: function (amount) {
      if (
        amount === 1 &&
        this.bidNumber < this.bidVariables.cardsPlayed
      ) {
        this.bidNumber++;
      }
      if (
        amount === -1 &&
        this.bidNumber > this.bidVariables.biddingMinimum
      ) {
        this.bidNumber--;
      }
    },

    /**
     * Prevents button being clicked multiple times sending multiple requests to the server
     */
    debounceClick: function (callback) {
      if (this.stopButtonRequests) return;
      callback();
      this.stopButtonRequests = true;
      setTimeout(() => {
        this.stopButtonRequests = false;
      }, 10000);
    },

    playCard: function (cardType) {
      this.debounceClick(() => {
        this.$socket.client.emit('playCard', {
          card: cardType,
        });
      });
    },

    confirmBid: function () {
      this.debounceClick(() => {
        this.$socket.client.emit('raiseBid', {
          bidNumber: this.bidNumber,
        });
        this.initiateBiddingMode = false;
      });
    },

    passBid: function () {
      this.debounceClick(() => {
        this.$socket.client.emit('passBid');
      });
    },

    flipOver: function (playerState) {
      this.debounceClick(() => {
        this.$socket.client.emit('flipOver', {
          username: playerState.username,
        });
      });
    },

    approveGainPoint: function () {
      this.debounceClick(() => {
        this.$socket.client.emit('approveGainPoint', {});
      });
    },

    approveLoseRandom: function () {
      this.debounceClick(() => {
        this.$socket.client.emit('approveLoseRandom', {});
      });
    },

    removePick: function (typeOfCard) {
      this.debounceClick(() => {
        this.$socket.client.emit('removePick', {
          typeOfCard: typeOfCard,
        });
      });
    },

    startNextRound: function (player) {
      this.debounceClick(() => {
        this.$socket.client.emit('startNextRound', {
          username: player.username,
        });
      });
    },

    restartGame: function () {
      this.debounceClick(() => {
        this.$socket.client.emit('restartGame');
      });
    },
  },
};
</script>

<style lang="scss">
// Removes the highlight on hover of v-simple-table
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
