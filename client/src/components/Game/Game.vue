<template>
  <div>
    <v-container class="text-center" style="max-width: 600px">
      <v-card height="180" class="my-4">
        <v-card-title> {{ currentMessage }} </v-card-title>
        <v-card-text
          style="max-height: 105px; overflow-y: auto"
          class="text-left"
        >
          {{ previousMessages }}
        </v-card-text>
      </v-card>
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
      <v-container class="my-4">
        <v-row>
          <v-col col="6">
            <v-btn block> Play Rose </v-btn>
          </v-col>
          <v-col col="6">
            <v-btn block> Play Skull </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block :disabled="gameState !== 'subsequentTurn'">
              Challenge
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-slider
              v-model="challengeNumber"
              track-color="grey"
              ticks="always"
              always-dirty
              min="1"
              max="10"
              thumb-label="always"
            >
              <template v-slot:prepend>
                <v-icon @click="challengeNumber--">
                  mdi-minus
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon @click="challengeNumber++"> mdi-plus </v-icon>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block> Confirm </v-btn>
          </v-col>
          <v-col>
            <v-btn block> Back </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block> Raise </v-btn>
          </v-col>
          <v-col>
            <v-btn block> Pass </v-btn>
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
      challengeNumber: 1,
      currentMessage: '',
      previousMessages: '',
    };
  },
  computed: {
    ...mapState(['gameState', 'playerStates', 'activePlayer']),
  },
  watch: {
    activePlayer(newActivePlayer, oldActivePlayer) {
      this.currentMessage = `${newActivePlayer}'s turn to play a card.`;
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
