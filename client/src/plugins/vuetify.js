import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: { customProperties: true, variations: true },
    themes: {
      light: {},
      dark: {
        primary: '#4A92FF',
        secondary: '#477180',
        player1: '#C62828',
        player2: '#2979FF',
        player3: '#4CAF50',
        player4: '#9E9D24',
        player5: '#FF5722',
        player6: '#795548',
      },
    },
  },
});
