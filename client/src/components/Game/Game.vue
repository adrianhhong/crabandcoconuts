<template>
  <div>
    <v-container class="text-center" style="max-width: 600px">
      <v-data-table
        :headers="headers"
        :items="gameState"
        hide-default-header
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:[`item.turnIndicator`]="{ item }">
          <v-icon v-if="item.turnIndicator">
            mdi-arrow-left-bold
          </v-icon>
        </template>
        <template v-slot:[`item.slot1`]="{ item }">
          <GameButtons
            :buttonType="item.slots[0]"
            :buttonColor="item.color"
          />
        </template>
        <template v-slot:[`item.slot2`]="{ item }">
          <GameButtons
            :buttonType="item.slots[1]"
            :buttonColor="item.color"
          />
        </template>
        <template v-slot:[`item.slot3`]="{ item }">
          <GameButtons
            :buttonType="item.slots[2]"
            :buttonColor="item.color"
          />
        </template>
        <template v-slot:[`item.slot4`]="{ item }">
          <GameButtons
            :buttonType="item.slots[3]"
            :buttonColor="item.color"
          />
        </template>
      </v-data-table>
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
      headers: [
        { value: 'player' },
        { value: 'turnIndicator' },
        { value: 'slot1' },
        { value: 'slot2' },
        { value: 'slot3' },
        { value: 'slot4' },
      ],
    };
  },
  computed: mapState(['gameState', 'activePlayer']),
};
</script>

<style lang="scss">
// Removes the highlight on hover of v-data-tables
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
</style>
