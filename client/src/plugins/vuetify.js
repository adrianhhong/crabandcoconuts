import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import CrabIcon from '../components/Icons/IconCrab.vue';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: false,
    options: { customProperties: true, variations: true },
    themes: {
      light: {
        primary: '#c46200',
        secondary: '#424242',
        backing: '#F5F5F5',
        buttons: '#E0E0E0',
        player1: '#BF5FBF',
        player2: '#779AED',
        player3: '#8AD172',
        player4: '#F6A974',
        player5: '#E4DA7A',
        player6: '#F0727C',

        // player1: '#ffadad',
        // player2: '#ffd6a5',
        // player3: '#caffbf',
        // player4: '#9bf6ff',
        // player5: '#a0c4ff',
        // player6: '#bdb2ff',
        // player7: '#ffc6ff',
        // player8: '#E2CFC4',
        // player9: '#D2D2CF',

        // player1: '#C6DEF1',
        // player2: '#C9E4DE',
        // player3: '#DBCDF0',
        // player4: '#F7D9C4',
        // player5: '#F2C6DE',
        // player6: '#D2D2CF',
        // player7: '#E2CFC4',
        // player8: '#FAEDCB',
        // player9: '#F9C6C9',
        // player10: '#E2E2DF',
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
  icons: {
    values: {
      crab: {
        component: CrabIcon,
      },
    },
  },
});
