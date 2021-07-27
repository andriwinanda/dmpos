// Import Vue
import Vue from 'vue';

import store from '../store/store.js'

// Import Framework7
import Framework7 from './framework7-custom.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

import numeric from '../components/Numeric.vue'
// Import Framework7 Styles
import '../css/framework7-custom.less';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.less';

// Import App Component
import App from '../components/app.vue';

import i18n from './translate.js';
import axios from './axios-helper'
import moment from 'moment'

// Prototype
Object.defineProperties(Vue.prototype, {
  // Custom header axios
  axios: {
    get() { return axios }
  },
  moment: {
    get() { return moment }
  }
})

// Numeric
Vue.component('numeric', numeric)

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

// Init App
new Vue({
  el: '#app',
  render: (h) => h(App),
  store,
  i18n,
  on: {
    init: function showToast(text) {
      const self = this;

      self.$f7ready(() => {
        // Create toast

        if (!self.toastBottom || self.toastBottom.destroyed) {
          self.toastBottom = self.$f7.toast.create({
            text: text,

            closeTimeout: 2000,

            destroyOnClose: true
          });
        }

        // Open it

        self.toastBottom.open();
      });
    }
  },
  // Register App Component
  components: {
    app: App,
  },
});