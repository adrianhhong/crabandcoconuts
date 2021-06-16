<template>
  <div>
    <h1>Lobby</h1>
    <h2>{{ playerName }}</h2>
    <h2>{{ roomId }}</h2>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Players</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in players" :key="p">
            <td>{{ p }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Room',
  data: () => {
    return {
      players: [],
    };
  },
  mounted: function () {
    // Check if the socket exists. check if the username matches??? send over the username using vuex store?
    this.$socket.client.emit('roomCheckIfJoined', {
      // username: this.playerName,
      roomId: this.$route.params.roomId,
    });
  },
  sockets: {
    checkedIfJoined: function ({ username }) {
      if (username === null) {
        this.$router.push('/');
      } else {
        console.log(username);
      }
    },
  },
  computed: mapState(['playerName', 'roomId']),
};
</script>
