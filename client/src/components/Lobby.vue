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
              <v-list-item-title
                v-text="p"
                style="text-align: left"
              ></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-if="p === username" color="secondary" right>
                  mdi-flower
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-container>
        <v-row>
          <v-col>
            <v-btn rounded @click="onStartGame">Start Game</v-btn>
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
      this.$emit('update:currentView', 'Game');
    },
  },
  sockets: {
    updatePlayerList: function ({ usernames }) {
      if (usernames === null) {
        this.$router.push('/');
      }
      if (usernames instanceof Array) {
        this.usernames = usernames;
      }
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
