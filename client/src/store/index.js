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
    gamePhase: '',
    round: 0,
    biddingMinimum: 1,
    playerStates: [],
    activePlayer: '',
    cardsPlayed: 0,
    // playerStates: [
    //   {
    //     username: 'heyo',
    //     slots: [1, 1, 0, 0],
    //     color: 'red',
    //     points: 3,
    //     numberOfSkulls: 1,
    //     numberOfRoses: 3,
    //   },
    // ],
  },
  mutations: {
    mutatePlayerDetails(state, payload) {
      state.username = payload.username;
      state.roomId = payload.roomId;
    },
    SOCKET_UPDATEGAMESTATE(state, payload) {
      state.currentMessage = payload.currentMessage;
      state.addedLogMessage = payload.addedLogMessage;
      state.gamePhase = payload.gamePhase;
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
