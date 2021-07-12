<template>
  <div>
    <template>
      <v-btn
        fab
        :outlined="changeButton(buttonType).isOutlined"
        :color="buttonColor"
        class="disable-button"
      >
        <v-icon>{{ changeButton(buttonType).icon }}</v-icon>
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GameButtons',
  props: {
    buttonType: {
      type: Number,
    },
    buttonColor: {
      type: String,
    },
  },
  // How to conditionally disable button:
  //        class="{'disable-button': isButtonDisabled}"
  methods: {
    changeButton(slot) {
      /**
       * 0: empty: Slot with no card on it
       * 1: faceup-skull
       * 2: faceup-rose
       * 3: facedown
       * 4: clickable: Player can click to add a new card facedown
       * 5: disabled: Player has less than 4 cards, and so a certain number of slots will be disabled
       */
      switch (slot) {
        case 0:
          return { icon: '', isOutlined: true };
        case 1:
          return { icon: 'mdi-skull', isOutlined: false };
        case 2:
          return { icon: 'mdi-flower-poppy', isOutlined: false };
        case 3:
          return { icon: 'mdi-help', isOutlined: false };
        case 4:
          return { icon: 'mdi-plus', isOutlined: true };
        case 5:
          return { icon: 'mdi-window-close', isOutlined: true };
        default:
          return { icon: 'mdi-exclamation', isOutlined: true };
      }
    },
  },
};
</script>

<style lang="scss">
// Disables click on button without changing its colour
.disable-button {
  pointer-events: none;
}
</style>
