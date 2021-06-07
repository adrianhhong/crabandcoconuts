<template>
  <div>
    <v-container style="max-width: 600px">
      <h1 class="text-center">Skull</h1>
      <v-text-field
        v-model="playerName"
        label="Enter your name"
      ></v-text-field>
      <br />
      <v-container fluid style="height: 500px">
        <v-row justify="center" align="center">
          <v-col>
            <v-layout justify-center>
              <v-btn rounded @click="onCreateGame">Create Game</v-btn>
            </v-layout>
          </v-col>
          <v-col> <v-layout justify-center>OR</v-layout></v-col>
          <v-col>
            <v-row justify="center" align="center">
              <v-col>
                <v-text-field
                  v-model="roomId"
                  label="Room ID"
                ></v-text-field>
                <v-btn rounded @click="onJoinGame"
                  >Join Game</v-btn
                ></v-col
              ></v-row
            ></v-col
          >
        </v-row></v-container
      >
    </v-container>
  </div>
</template>

<script>
import { socketInit } from '../socket/socket.ts';
// import { initListeners } from '../socket/init.ts';

export default {
  name: 'Home',
  data: () => {
    return {
      playerName: '',
      roomId: '',
    };
  },
  methods: {
    onCreateGame: function () {
      socketInit(this.playerName, '', 'create');
      // initListeners(this, socker);
    },
    onJoinGame: function () {
      socketInit(this.playerName, this.roomId, 'join');
    },
  },
};
</script>
