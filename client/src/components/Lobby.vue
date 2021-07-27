<template>
  <div>
    <v-container style="max-width: 600px">
      <v-row>
        <v-col>
          <h1 class="text-center">crab & shells</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <h3>room code:</h3>
          <v-btn
            color="secondary"
            v-clipboard:copy="roomId"
            :loading="showLoaderText"
            :disabled="showLoaderText"
            @click="showLoaderText = true"
            class="text-lowercase"
            large
          >
            {{ roomId }}
            <template v-slot:loader>
              <v-icon>mdi-check</v-icon>
            </template>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="mx-auto" max-width="300" tile>
            <v-list disabled>
              <v-subheader>Players</v-subheader>
              <v-list-item-group>
                <v-list-item v-for="(p, i) in usernames" :key="i">
                  <v-badge
                    v-if="p === username"
                    color="primary"
                    content="me"
                  >
                    <v-list-item-title
                      v-if="p === username"
                      class="font-weight-black"
                      v-text="p"
                      style="text-align: left"
                    >
                    </v-list-item-title
                  ></v-badge>
                  <v-list-item-title
                    v-if="p !== username"
                    v-text="p"
                    style="text-align: left"
                  ></v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn
            v-if="username === hostUsername && usernames.length >= 3"
            color="buttons"
            rounded
            @click="onStartGame"
            >Start</v-btn
          >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-btn
                  v-if="
                    username === hostUsername && usernames.length < 3
                  "
                  color="buttons"
                  rounded
                  disabled
                  >Start</v-btn
                ></span
              >
            </template>
            <span>Requires 3 people to start</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-btn
                  v-if="username !== hostUsername"
                  color="buttons"
                  rounded
                  disabled
                  >Start</v-btn
                ></span
              >
            </template>
            <span
              >Only the host
              <span class="font-weight-black primary--text">{{
                hostUsername
              }}</span>
              can start the game</span
            >
          </v-tooltip>
        </v-col>
        <v-col class="text-left">
          <v-btn color="buttons" rounded @click="onLeaveRoom"
            >Leave</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Room',
  data: () => {
    return {
      stopButtonRequests: false,
      usernames: [],
      showLoaderText: false,
      hostUsername: '',
    };
  },
  beforeCreate: function () {
    /**
     * When first entering route, check if we joined from home or just by copying URL
     */
    this.$socket.client.emit('roomCheckIfJoined', {
      roomId: this.$route.params.roomId,
    });
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

    onLeaveRoom: function () {
      this.$socket.client.emit('roomLeave', {
        username: this.username.trim(),
        roomId: this.roomId,
      });
      this.$router.push('/');
    },

    onStartGame: function () {
      this.debounceClick(() => {
        this.$socket.client.emit('roomStart', {
          roomId: this.roomId,
        });
      });
    },
  },
  sockets: {
    updatePlayerList: function ({ usernames, hostUsername }) {
      this.hostUsername = hostUsername;
      if (usernames === null) {
        this.$router.push('/');
      }
      if (usernames instanceof Array) {
        this.usernames = usernames;
      }
    },
    startGame: function () {
      this.stopButtonRequests = false;
      this.$emit('update:currentView', 'Game');
    },
  },
  computed: mapState(['username', 'roomId']),
  watch: {
    showLoaderText() {
      if (this.showLoaderText) {
        setTimeout(() => (this.showLoaderText = false), 1500);
      }
    },
  },
};
</script>
