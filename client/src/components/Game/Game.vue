<template>
  <div>
    <v-container class="text-center" style="max-width: 600px">
      <v-data-table
        :headers="headers"
        :items="items"
        hide-default-header
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:[`item.slot1`]="{ item }">
          <GameSlotCards
            :slotButton="item.slot1"
            :slotColor="item.color"
          />
        </template>
        <template v-slot:[`item.slot2`]="{ item }">
          <GameSlotCards
            :slotButton="item.slot2"
            :slotColor="item.color"
          />
        </template>
        <template v-slot:[`item.slot3`]="{ item }">
          <GameSlotCards
            :slotButton="item.slot3"
            :slotColor="item.color"
          />
        </template>
        <template v-slot:[`item.slot4`]="{ item }">
          <GameSlotCards
            :slotButton="item.slot4"
            :slotColor="item.color"
          />
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import GameSlotCards from './GameSlotCards.vue';
export default {
  name: 'Game',
  components: {
    GameSlotCards,
  },
  data: () => {
    return {
      headers: [
        { value: 'player' },
        { value: 'slot1' },
        { value: 'slot2' },
        { value: 'slot3' },
        { value: 'slot4' },
      ],
      items: [
        {
          player: 'memelord',
          slot1: 'faceup-skull',
          slot2: 'faceup-rose',
          slot3: 'empty',
          slot4: 'clickable',
          color: 'red',
        },
        {
          player: 'plater2',
          slot1: 'facedown',
          slot2: 'disabled',
          slot3: 'zzz',
          slot4: 'clickable',
          color: 'green',
        },
        {
          player: 'memelord',
          slot1: 'faceup-skull',
          slot2: 'faceup-rose',
          slot3: 'empty',
          slot4: 'clickable',
          color: 'blue',
        },
        {
          player: 'memelord',
          slot1: 'faceup-skull',
          slot2: 'faceup-rose',
          slot3: 'empty',
          slot4: 'clickable',
          color: 'orange',
        },
        {
          player: 'memelord',
          slot1: 'faceup-skull',
          slot2: 'faceup-rose',
          slot3: 'empty',
          slot4: 'clickable',
          color: 'pink',
        },
      ],
    };
  },
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
