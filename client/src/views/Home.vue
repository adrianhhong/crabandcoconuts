<template>
  <div>
    <v-container style="max-width: 600px">
      <v-row>
        <v-col>
          <h1 class="text-center">crab & shells</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-divider class="mb-10" />
        </v-col>
      </v-row>
      <v-form ref="name">
        <v-text-field
          outlined
          rounded
          v-model="username"
          label="Enter your name"
          maxlength="15"
          :rules="[rules.nameRequired, rules.nameMax, rules.nameMin]"
        ></v-text-field>
      </v-form>
      <v-container fluid style="height: 300px">
        <v-row align="center">
          <v-col class="text-center">
            <v-row>
              <v-col>
                <v-btn color="buttons" rounded @click="onCreateGame"
                  >Create</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="buttons"
                  rounded
                  @click="onCreateDev"
                  class="mt-3"
                  >aaaa</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col class="text-center">or</v-col>
          <v-col class="text-center">
            <v-row>
              <v-col>
                <v-form ref="roomId">
                  <v-text-field
                    outlined
                    rounded
                    v-model="roomId"
                    label="Room ID"
                    maxlength="4"
                    :rules="[
                      rules.roomIdRequired,
                      rules.roomIdLength,
                    ]"
                  ></v-text-field>
                </v-form>
                <v-btn
                  color="buttons"
                  rounded
                  @click="onJoinGame"
                  class="mt-3"
                  >Join</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="buttons"
                  rounded
                  @click="onJoinDev"
                  class="mt-3"
                  >aaaa</v-btn
                ></v-col
              ></v-row
            ></v-col
          >
        </v-row></v-container
      >
      <v-row>
        <v-col>
          <v-divider />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <small
            >Based on the original
            <a
              href="https://boardgamegeek.com/boardgame/92415/skull"
              target="_blank"
              >Skull & Roses</a
            ></small
          >
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col class="text-center" cols="12">
          <v-btn
            icon
            href="https://github.com/adrianhhong/skull"
            target="_blank"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
          <strong
            ><a
              href="https://github.com/adrianhhong/skull"
              target="_blank"
              >Adrian Hong</a
            ></strong
          >
        </v-col>
      </v-row>
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
      stopButtonRequests: false,
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
  created: function () {
    this.stopButtonRequests = false;
  },
  methods: {
    /**
     * Prevents button being clicked multiple times sending multiple requests to the server
     */
    debounceClick: function (callback) {
      if (this.stopButtonRequests) return;
      callback();
      this.stopButtonRequests = true;
      setTimeout(() => {
        this.stopButtonRequests = false;
      }, 10000);
    },
    onCreateGame: function () {
      const isValidated = this.$refs.name.validate();
      if (!isValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: '',
          enterRoomAction: 'create',
        });
      });
    },
    onJoinGame: function () {
      const nameIsValidated = this.$refs.name.validate();
      const roomIdIsValidated = this.$refs.roomId.validate();
      if (!nameIsValidated || !roomIdIsValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: this.roomId,
          enterRoomAction: 'join',
        });
      });
    },
    // !! Remove for PROD
    onCreateDev: function () {
      const isValidated = this.$refs.name.validate();
      if (!isValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: '',
          enterRoomAction: 'createDev',
        });
      });
    },
    // !! Remove for PROD
    onJoinDev: function () {
      const nameIsValidated = this.$refs.name.validate();
      if (!nameIsValidated) {
        this.stopButtonRequests = false;
        return;
      }
      this.debounceClick(() => {
        this.$socket.client.emit('homeNewEnterRoom', {
          username: this.username.trim(),
          roomId: 'aaaa',
          enterRoomAction: 'join',
        });
      });
    },
  },
  sockets: {
    /**
     * On successfully created room, commit username and roomId to store, and route to room
     */
    enterRoomSuccess: function ({ username, roomId }) {
      this.stopButtonRequests = false;
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
      this.stopButtonRequests = false;
      this.errorMessage = message;
      this.snackbarShow = true;
    },
  },
};
</script>
