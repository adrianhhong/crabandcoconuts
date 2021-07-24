<template>
  <div>
    <v-container class="text-center" style="max-width: 600px">
      <!-- Messages -->
      <v-card height="180" class="my-4">
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
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-for="item in playerStates" :key="item.username">
              <td class="pr-1">{{ item.username }}</td>
              <td class="px-1">
                <v-icon> mdi-trophy </v-icon>
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
                block
                :disabled="
                  username !== activePlayer || numberOfRoses <= 0
                "
                @click="playCard('rose')"
              >
                Play Rose ({{ numberOfRoses }})
              </v-btn>
            </v-col>
            <v-col col="6">
              <v-btn
                block
                :disabled="
                  username !== activePlayer || numberOfSkulls <= 0
                "
                @click="playCard('skull')"
              >
                Play Skull ({{ numberOfSkulls }})
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
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
          <v-row v-if="initiateBiddingMode || gamePhase === 'bid'">
            <v-col class="pt-13">
              <v-slider
                v-model="bidNumber"
                track-color="grey"
                ticks="always"
                tick-size="7"
                :min="bidVariables.biddingMinimum"
                :max="bidVariables.cardsPlayed"
                thumb-label="always"
                :disabled="username !== activePlayer"
              >
                <template v-slot:prepend>
                  <v-icon @click="bidNumber--"> mdi-minus </v-icon>
                </template>
                <template v-slot:append>
                  <v-icon @click="bidNumber++"> mdi-plus </v-icon>
                </template>
              </v-slider>
            </v-col>
          </v-row>
          <v-row v-if="initiateBiddingMode">
            <v-col>
              <v-btn block @click="confirmBid"> Confirm </v-btn>
            </v-col>
            <v-col>
              <v-btn block @click="initiateBiddingMode = false">
                Back
              </v-btn>
            </v-col>
          </v-row>
          <v-row v-if="gamePhase === 'bid'">
            <v-col>
              <v-btn
                block
                :disabled="username !== activePlayer"
                @click="confirmBid"
              >
                Raise
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
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
            <v-col
              v-for="player in playerStates"
              :key="player.username"
              :cols="Math.floor(12 / playerStates.length)"
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
          </v-row>
        </v-container>
        <v-container
          v-if="
            gamePhase === 'removeCardsPick' &&
            activePlayer === username
          "
        >
          <v-row>
            <v-col>
              <v-btn
                :color="activePlayer.color"
                block
                :disable="removeCardsVariables.totalRoses === 0"
                @click="removePick('rose')"
              >
                Remove Rose ({{ removeCardsVariables.totalRoses }})
              </v-btn></v-col
            >
            <v-col>
              <v-btn
                :color="activePlayer.color"
                block
                :disable="removeCardsVariables.totalSkulls === 0"
                @click="removePick('skull')"
              >
                Remove Skull ({{ removeCardsVariables.totalSkulls }})
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
            <v-col
              v-for="player in playerStatesWithoutEliminated"
              :key="player.username"
              :cols="Math.floor(12 / playerStates.length)"
            >
              <v-btn
                :value="player.username"
                :color="player.color"
                @click="startNextRound(player)"
              >
                {{ player.username }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <div v-if="isEliminated && gamePhase !== 'playerWins'">
        <h1>you have been eliminated</h1>
      </div>
      <v-container v-if="gamePhase === 'playerWins'">
        <v-row>
          <v-col>
            <h1>{{ activePlayer }} wins the game!</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="restartGame()"> Play again </v-btn>
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
    playerStates(newPlayerStates) {
      this.stopButtonRequests = false;
      if (this.gamePhase === 'placingCards') {
        const userPlayerState = newPlayerStates.find(
          (playerState) => playerState.username === this.username,
        );
        this.numberOfSkulls = userPlayerState.numberOfSkulls;
        this.numberOfRoses = userPlayerState.numberOfRoses;
      }
      // THIS SHOULD BE DONE AT THE SERVER SIDE??
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
