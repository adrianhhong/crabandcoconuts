<template>
  <div>
    <component
      :is="changeView"
      :currentView.sync="currentView"
    ></component>
  </div>
</template>

<script>
import Lobby from '../components/Lobby.vue';
import Game from '../components/Game.vue';
export default {
  name: 'Room',
  components: {
    Lobby,
    Game,
  },
  data: () => {
    return {
      currentView: 'Lobby',
    };
  },
  computed: {
    changeView: function () {
      return this.currentView;
    },
  },
};
</script>
