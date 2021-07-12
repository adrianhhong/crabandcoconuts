<template>
  <div>
    <v-container class="text-center" style="max-width: 600px">
      <h1 class="text-center">Lobby</h1>
      <h3>room code:</h3>
      <v-btn
        rounded
        color="secondary"
        v-clipboard:copy="roomId"
        :loading="showLoaderText"
        :disabled="showLoaderText"
        @click="showLoaderText = true"
        class="text-lowercase"
      >
        {{ roomId }}
        <template v-slot:loader>
          <span>Copied!</span>
        </template>
      </v-btn>
      <v-card class="mx-auto" max-width="300" tile>
        <v-list disabled>
          <v-subheader>Players</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="(p, i) in usernames" :key="i">
              <v-badge
                v-if="p === username"
                color="secondary"
                content="me"
              >
                <v-list-item-title
                  v-if="p === username"
                  class="font-weight-black secondary--text"
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
              <v-list-item-action>
                <v-icon
                  v-if="p === hostUsername"
                  color="secondary"
                  right
                >
                  mdi-flower
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-container>
        <v-row>
          <v-col>
            <v-btn
              v-if="
                username === hostUsername && usernames.length >= 3
              "
              rounded
              @click="onStartGame"
              >Start Game</v-btn
            >
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-btn
                    v-if="
                      username === hostUsername &&
                      usernames.length < 3
                    "
                    rounded
                    disabled
                    >Start Game</v-btn
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
                    rounded
                    disabled
                    >Start Game</v-btn
                  ></span
                >
              </template>
              <span
                >Only the host
                <span class="font-weight-black secondary--text">{{
                  hostUsername
                }}</span>
                can start the game</span
              >
            </v-tooltip>
          </v-col>
          <v-col>
            <v-btn rounded @click="onLeaveRoom">Leave Room</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Room',
  data: () => {
    return {
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
    onLeaveRoom: function () {
      this.$socket.client.emit('roomLeave', {
        username: this.username.trim(),
        roomId: this.roomId,
      });
      this.$router.push('/');
    },
    onStartGame: function () {
      this.$socket.client.emit('roomStart', {
        roomId: this.roomId,
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
