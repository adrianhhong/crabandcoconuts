<template>
  <div>
    <v-container style="max-width: 600px">
      <h1 class="text-center">skull</h1>
      <v-form ref="name">
        <v-text-field
          v-model="username"
          label="Enter your name"
          maxlength="15"
          :rules="[rules.nameRequired, rules.nameMax, rules.nameMin]"
        ></v-text-field>
      </v-form>
      <v-container fluid style="height: 500px">
        <v-row justify="center" align="center">
          <v-col>
            <v-layout justify-center>
              <v-row>
                <v-col>
                  <v-btn rounded @click="onCreateGame"
                    >Create Game</v-btn
                  >
                </v-col>
                <v-col>
                  <v-btn rounded @click="onCreateDev" class="mt-3"
                    >Create aaaa</v-btn
                  >
                </v-col>
              </v-row>
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
            >
            <v-row>
              <v-col>
                <v-btn rounded @click="onJoinDev" class="mt-3"
                  >Join aaaa</v-btn
                ></v-col
              ></v-row
            ></v-col
          >
        </v-row></v-container
      >
    </v-container>
    <v-snackbar v-model="snackbarShow">
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="secondary"
          text
          v-bind="attrs"
          @click="snackbarShow = false"
          icon
        >
          <v-icon> mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => {
    return {
      username: '',
      roomId: '',
      rules: {
        nameRequired: (v) => !!v || 'Please enter a name',
        nameMax: (v) => v.length <= 15 || 'Max 15 characters',
        nameMin: (v) => v.trim().length > 0 || 'Please enter a name',
        roomIdRequired: (v) => !!v || 'Please enter a room ID',
        roomIdLength: (v) =>
          v.length == 4 || 'Room ID is 4 characters long',
      },
      errorMessage: '',
      snackbarShow: false,
    };
  },
  methods: {
    onCreateGame: function () {
      if (this.$refs.name.validate()) {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: '',
          enterRoomAction: 'create',
        });
      }
    },
    onJoinGame: function () {
      const nameIsValidated = this.$refs.name.validate();
      const roomIdIsValidated = this.$refs.roomId.validate();
      if (nameIsValidated && roomIdIsValidated) {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: this.roomId,
          enterRoomAction: 'join',
        });
      }
    },
    // !! Remove for PROD
    onCreateDev: function () {
      if (this.$refs.name.validate()) {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: '',
          enterRoomAction: 'createDev',
        });
      }
    },
    // !! Remove for PROD
    onJoinDev: function () {
      const nameIsValidated = this.$refs.name.validate();
      if (nameIsValidated) {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: 'aaaa',
          enterRoomAction: 'join',
        });
      }
    },
  },
  sockets: {
    /**
     * On successfully created room, commit username and roomId to store, and route to room
     */
    enterRoomSuccess: function ({ username, roomId }) {
      this.$store.commit('mutatePlayerDetails', {
        username: username,
        roomId: roomId,
      });
      this.$router.push(`/${roomId}`);
    },
    /**
     * On a failure to join room, show error message
     */
    joinRoomFail: function ({ message }) {
      this.errorMessage = message;
      this.snackbarShow = true;
    },
  },
};
</script>
