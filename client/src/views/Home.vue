<template>
  <div>
    <h1>Welcome to Skull</h1>
    <v-btn @click="onClick">hihiihi</v-btn>
  </div>
</template>

<script>
import { socketInit } from '../socket/socket.ts';
// import { initListeners } from '../socket/init.ts';

export default {
  name: 'Home',
  methods: {
    onClick: function () {
      console.log('socketinit');
      socketInit('big lad', '1234', 'join');
      // initListeners(this, socker);
    },
  },
};
</script>
