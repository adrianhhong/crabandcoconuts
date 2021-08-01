import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import IconCrab from '../components/Icons/IconCrab.vue';
import IconPearl from '../components/Icons/IconPearl.vue';
import IconCoconut from '../components/Icons/IconCoconut.vue';

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
        player1: '#f07272',
        player2: '#7281f0',
        player3: '#72f096',
        player4: '#ad72f0',
        player5: '#f072a0',
        player6: '#f0a272',
        player7: '#72dbf0',
        player8: '#f0cc72',
        player9: '#949494',
        player10: '#b09676',
      },
      dark: {},
    },
  },
  icons: {
    values: {
      crab: {
        component: IconCrab,
      },
      pearl: {
        component: IconPearl,
      },
      coconut: {
        component: IconCoconut,
      },
    },
  },
});
