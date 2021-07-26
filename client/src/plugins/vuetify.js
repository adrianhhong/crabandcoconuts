import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    options: { customProperties: true, variations: true },
    themes: {
      light: {
        primary: '#EB973D',
        secondary: '#424242',
        player1: '#C6DEF1',
        player2: '#C9E4DE',
        player3: '#DBCDF0',
        player4: '#F7D9C4',
        player5: '#F2C6DE',
        player6: '#D2D2CF',
        player7: '#E2CFC4',
        player8: '#FAEDCB',
        player9: '#F9C6C9',
        player10: '#E2E2DF',
        // player1: '#C62828',
        // player2: '#2979FF',
        // player3: '#4CAF50',
        // player4: '#9E9D24',
        // player5: '#FF5722',
        // player6: '#795548',
      },
      dark: {},
    },
  },
});
