import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    options: { customProperties: true, variations: true },
    themes: {
      light: {
        primary: '#174D77',
        accent: '#B79A85',
        secondary: '#2F3785',
        success: '#4CAF50', // POST
        info: '#2196F3', // GET
        warning: '#FF9800', // PATCH
        error: '#F44336', // DELETE
        help: '9C27B0', // PUT
        neutral: '#757575', // *
      },
      dark: {
        primary: '#4A92FF',
        accent: '#B79A85',
        secondary: '#2F3785',
        success: '#4CAF50', // POST
        info: '#2196F3', // GET
        warning: '#FF9800', // PATCH
        error: '#F44336', // DELETE
        help: '9C27B0', // PUT
        neutral: '#757575', // *
      },
    },
  },
});
