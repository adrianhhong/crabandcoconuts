import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    roomId: '',
    hostUsername: '',
  },
  mutations: {
    mutatePlayerDetails(state, payload) {
      state.username = payload.username;
      state.roomId = payload.roomId;
    },
    // SOCKET_UPDATEHOST(state, payload) {
    //   console.log('host');
    //   state.hostUsername = payload.hostUsername;
    // },
  },
  actions: {},
  modules: {},
});
