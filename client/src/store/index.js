import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    playerName: '',
    roomId: '',
  },
  mutations: {
    createRoomInfo(state, payload) {
      state.playerName = payload.playerName;
      state.roomId = payload.roomId;
    },
  },
  actions: {},
  modules: {},
});
