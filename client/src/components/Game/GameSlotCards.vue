<template>
  <div>
    <template v-if="slotButton === `empty`">
      <v-btn fab outlined :color="slotColor" class="disable-button">
        <v-icon></v-icon>
      </v-btn>
    </template>
    <template v-else-if="slotButton === `faceup-skull`">
      <v-btn fab :color="slotColor" class="disable-button">
        <v-icon> mdi-skull </v-icon>
      </v-btn>
    </template>
    <template v-else-if="slotButton === `faceup-rose`">
      <v-btn fab :color="slotColor" class="disable-button">
        <v-icon> mdi-flower-poppy </v-icon>
      </v-btn>
    </template>
    <template v-else-if="slotButton === `facedown`">
      <v-btn fab :color="slotColor">
        <v-icon> mdi-help </v-icon>
      </v-btn>
    </template>
    <template v-else-if="slotButton === `clickable`">
      <v-btn fab outlined :color="slotColor">
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <template v-else-if="slotButton === `disabled`">
      <v-btn fab outlined :color="slotColor" class="disable-button">
        <v-icon> mdi-window-close </v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn fab outlined :color="slotColor" class="disable-button">
        <v-icon> mdi-exclamation </v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GameSlotCards',
  props: {
    /**
     * empty: Slot with no card on it
     * faceup-skull
     * faceup-rose
     * facedown
     * clickable: Player can click to add a new card facedown
     * diabled: Player has less than 4 cards, and so a certain number of slots will be disabled
     */
    slotButton: {
      type: String,
    },
    slotColor: {
      type: String,
    },
  },
  // How to conditionally disable button:
  //        class="{'disable-button': isButtonDisabled}"
};
</script>

<style lang="scss">
// Disables click on button without changing its colour
.disable-button {
  pointer-events: none;
}
</style>
