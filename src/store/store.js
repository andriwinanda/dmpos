import Vue from 'vue'
import Vuex from 'vuex'
// import { getDarkMode, setDarkMode, removeDarkMode } from '@/js/localstorage-helper'

import login from './modules/login'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login
  }
})
