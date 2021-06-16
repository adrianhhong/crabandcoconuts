import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: '',
    roomId: '',
  },
  mutations: {
    mutatePlayerDetails(state, payload) {
      state.username = payload.username;
      state.roomId = payload.roomId;
    },
  },
  actions: {},
  modules: {},
});
