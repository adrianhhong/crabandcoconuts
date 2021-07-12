import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    roomId: '',
    hostUsername: '',
    gameState: [],
    activePlayer: '',
  },
  mutations: {
    mutatePlayerDetails(state, payload) {
      state.username = payload.username;
      state.roomId = payload.roomId;
    },
    SOCKET_UPDATEGAMESTATE(state, payload) {
      state.gameState = payload.gameState;
      state.activePlayer = payload.activePlayer;
    },
  },
  actions: {},
  modules: {},
});
