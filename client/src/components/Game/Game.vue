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
            <tr v-for="item in playerStates" :key="item.player">
              <td class="pr-1">{{ item.player }}</td>
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
                username !== activePlayer || numberOfRoses === 0
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
                username !== activePlayer || numberOfSkulls === 0
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
              :disabled="round === 0 || username !== activePlayer"
              @click="initiateBiddingMode = true"
            >
              Challenge
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row v-if="initiateBiddingMode || gamePhase === 'bidding'">
          <v-col class="pt-13">
            <v-slider
              v-model="bidNumber"
              track-color="grey"
              ticks="always"
              tick-size="7"
              :min="biddingMinimum"
              :max="cardsPlayed"
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
        <v-row v-if="gamePhase === 'bidding'">
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
      bidNumber: 1,
      messageLog: [],
      initiateBiddingMode: false,
      numberOfSkulls: 0,
      numberOfRoses: 0,
    };
  },
  computed: {
    ...mapState([
      'username',
      'currentMessage',
      'addedLogMessage',
      'gamePhase',
      'round',
      'biddingMinimum',
      'playerStates',
      'activePlayer',
      'cardsPlayed',
    ]),
  },
  watch: {
    addedLogMessage(newAddedLogMessage) {
      this.messageLog.unshift(newAddedLogMessage);
    },
    playerStates(newPlayerStates) {
      const userPlayerState = newPlayerStates.find(
        (playerState) => playerState.username === this.username,
      );
      this.numberOfSkulls = userPlayerState.numberOfSkulls;
      this.numberOfRoses = userPlayerState.numberOfRoses;
    },
  },
  methods: {
    playCard: function (cardType) {
      this.$socket.client.emit('playCard', {
        card: cardType,
      });
    },
    confirmBid: function () {
      this.$socket.client.emit('raiseBid', {
        bidNumber: this.bidNumber,
      });
      this.initiateBiddingMode = false;
    },
    passBid: function () {
      this.$socket.client.emit('passBid');
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
