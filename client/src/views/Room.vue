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
  mounted: function () {
    // Check if the socket exists
  },
};
</script>
