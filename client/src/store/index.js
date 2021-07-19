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
    playerStates: [],
    activePlayer: '',
    gamePhase: '',
    placingCardsVariables: { round: 0 },
    bidVariables: { biddingMinimum: 1, cardsPlayed: 0 },
    removeCardsVariables: { totalSkulls: 1, totalRoses: 3 },
  },
  mutations: {
    mutatePlayerDetails(state, payload) {
      state.username = payload.username;
      state.roomId = payload.roomId;
    },
    SOCKET_UPDATEGAMESTATE(state, payload) {
      state.currentMessage = payload.currentMessage;
      state.addedLogMessage = payload.addedLogMessage;
      state.playerStates = payload.playerStates;
      state.activePlayer = payload.activePlayer;
      state.gamePhase = payload.gamePhase;
      state.placingCardsVariables = payload.placingCardsVariables;
      state.bidVariables = payload.bidVariables;
      state.removeCardsVariables = payload.removeCardsVariables;
    },
  },
  actions: {},
  modules: {},
});
