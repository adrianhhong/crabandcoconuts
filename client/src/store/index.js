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
    biddingMinimum: 1,
    playerStates: [],
    activePlayer: '',
    cardsPlayed: 0,
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
      state.biddingMinimum = payload.biddingMinimum;
      state.playerStates = payload.playerStates;
      state.activePlayer = payload.activePlayer;
      state.cardsPlayed = payload.cardsPlayed;
    },
  },
  actions: {},
  modules: {},
});
