<template>
  <div>
    <h1>Lobby</h1>
    <h2>{{ roomId }}</h2>

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
                mdi-skull
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Room',
  data: () => {
    return {
      usernames: [],
    };
  },
  mounted: function () {
    /**
     * When first entering route, check if we joined from home or just by copying URL
     */
    this.$socket.client.emit('roomCheckIfJoined', {
      // username: this.username,
      roomId: this.$route.params.roomId,
    });
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
};
</script>
