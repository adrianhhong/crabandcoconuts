<template>
  <div>
    <h1>Skull</h1>
    <v-btn @click="onCreateGame">Create Game</v-btn>
    <v-btn @click="onJoinGame">Join Game</v-btn>
  </div>
</template>

<script>
import { socketInit } from '../socket/socket.ts';
// import { initListeners } from '../socket/init.ts';

export default {
  name: 'Home',
  methods: {
    onCreateGame: () => {
      socketInit(username, roomId, joinOrCreate);
      // initListeners(this, socker);
    },
    onJoinGame: () => {},
  },
};
</script>
