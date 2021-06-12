<template>
  <div>
    <h1>Lobby</h1>
  </div>
</template>

<script>
export default {
  name: 'Room',
  data: () => {
    return {
      playerName: '',
    };
  },
  mounted: function () {
    // Check if the socket exists. check if the username matches??? send over the username using vuex store?
    this.$socket.client.emit('roomCheckIfJoined', {
      // username: this.playerName,
      roomId: this.$route.params,
    });
  },
  sockets: {
    checkedIfJoined: function ({ username }) {
      if (username === '') {
        this.$route.push('/');
      } else {
        console.log(username);
      }
    },
  },
};
</script>
