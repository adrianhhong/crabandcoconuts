<template>
  <div>
    <v-container style="max-width: 600px">
      <h1 class="text-center">☠️ skull ☠️</h1>
      <v-form ref="name">
        <v-text-field
          v-model="playerName"
          label="Enter your name"
          maxlength="15"
          :rules="[rules.nameRequired, rules.nameMax, rules.nameMin]"
        ></v-text-field>
      </v-form>
      <v-container>
        <v-row justify="center" align="center">
          <v-col>
            {{ errorMessage }}
          </v-col>
        </v-row>
      </v-container>
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
                <v-form ref="roomId">
                  <v-text-field
                    v-model="roomId"
                    label="Room ID"
                    maxlength="4"
                    :rules="[
                      rules.roomIdRequired,
                      rules.roomIdLength,
                    ]"
                  ></v-text-field>
                </v-form>
                <v-btn rounded @click="onJoinGame" class="mt-3"
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
export default {
  name: 'Home',
  data: () => {
    return {
      playerName: '',
      roomId: '',
      rules: {
        nameRequired: (v) => !!v || 'Please enter a name',
        nameMax: (v) => v.length <= 15 || 'Max 15 characters',
        nameMin: (v) => v.length >= 3 || 'Min 3 characters',
        roomIdRequired: (v) => !!v || 'Please enter a room ID',
        roomIdLength: (v) =>
          v.length == 4 || 'Room ID is 4 characters long',
      },
      errorMessage: '',
    };
  },
  methods: {
    onCreateGame: function () {
      if (this.$refs.name.validate()) {
        this.$socket.client.emit('newPlayerEnterRoom', {
          username: this.playerName,
          roomId: '',
          enterRoomAction: 'create',
        });
      }
    },
    onJoinGame: function () {
      const nameIsValidated = this.$refs.name.validate();
      const roomIdIsValidated = this.$refs.roomId.validate();
      if (nameIsValidated && roomIdIsValidated) {
        this.$socket.client.emit('newPlayerEnterRoom', {
          username: this.playerName,
          roomId: this.roomId,
          enterRoomAction: 'join',
        });
        // this.skull.addSocketListeners(socket, this);
      }
    },
  },
  sockets: {
    updatePlayerList: function (roomId, usernames) {
      console.log(usernames);
      this.$router.push(`/room/${roomId}`);
    },
    joinRoomFail: function (message) {
      this.errorMessage = message.message;
    },
  },
};
</script>
