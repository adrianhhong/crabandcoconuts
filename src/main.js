import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import { config } from './config';
import Clipboard from 'v-clipboard';

Vue.config.productionTip = false;

Vue.use(VueSocketIOExt, io(), { store });
// Vue.use(VueSocketIOExt, io(config.serverUrl), { store });
Vue.use(Clipboard);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
