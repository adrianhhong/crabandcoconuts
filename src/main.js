import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import Clipboard from 'v-clipboard';

Vue.config.productionTip = false;

if (process.env.NODE_ENV !== 'production') {
  Vue.use(VueSocketIOExt, io('http://localhost:3000'), { store });
} else {
  Vue.use(VueSocketIOExt, io(), { store });
}
Vue.use(Clipboard);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
