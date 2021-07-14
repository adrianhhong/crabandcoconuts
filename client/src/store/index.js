import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    roomId: '',
    hostUsername: '',
    currentMessage: '',
    addedLogMessage: '',
    gameState: '',
    round: 0,
    playerStates: [],
    activePlayer: '',
  },
  mutations: {
    mutatePlayerDetails(state, payload) {
      state.username = payload.username;
      state.roomId = payload.roomId;
    },
    SOCKET_UPDATEGAMESTATE(state, payload) {
      state.currentMessage = payload.currentMessage;
      state.addedLogMessage = payload.addedLogMessage;
      state.gameState = payload.gameState;
      state.round = payload.round;
      state.playerStates = payload.playerStates;
      state.activePlayer = payload.activePlayer;
    },
  },
  actions: {},
  modules: {},
});
