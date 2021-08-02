import {
  getBaseUrl, setBaseUrl, removeBaseUrl, setCompany, getCompany, removeCompany,
  setToken, getToken, removeToken, getDataUser, setDataUser, removeDataUser, getBag, addToBag, removeBag, getDarkMode,
  setDarkMode, removeDarkMode
} from '@/js/localstorage-helper'
import axios from '../../js/axios-helper';

const LOGIN = "LOGIN"
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGOUT = "LOGOUT"
const POST_TOKEN = "POST_TOKEN"
const TOKEN_VERIFIED = "TOKEN_VERIFIED"
const RESET = "RESET"

const state = {
  hasBaseUrl: !!(getBaseUrl()),
  isLoggedIn: !!(getToken()),
  darkMode: getDarkMode() || false,
  dataUser: getDataUser() || null,
  company: getCompany() || null,
  bag: [],
  lang: localStorage.getItem("lang") || 'en'

}
if(getBag(state.dataUser.userid)) state.bag = getBag(state.dataUser.userid) || []


const mutations = {
  [LOGIN](state) {
    state.pending = true
  },
  [LOGIN_SUCCESS](state) {
    state.isLoggedIn = true
    state.pending = false
  },
  [LOGOUT](state) {
    state.isLoggedIn = false
  },
  [POST_TOKEN](state) {
    state.pending = true
  },
  [TOKEN_VERIFIED](state) {
    state.pending = false
    state.hasBaseUrl = true
  },
  [RESET](state) {
    state.hasBaseUrl = false
    state.isLoggedIn = false
  },
  darkMode(state) {
    state.darkMode = !state.darkMode
    setDarkMode(JSON.stringify(state.darkMode))
  },
  setCompanyName(state, name) {
    state.company = name
    setCompany(name)
  },
  addtobag(state, item) {

    let index = state.bag.findIndex(el => el.sku === item.sku);
    if (index >= 0) {
      state.bag[index].qty = item.qty
      state.bag[index].stock = item.stock
      state.bag[index].totalPrice = state.bag[index].price * item.qty
    } else {
      state.bag.push(item)
    }
    // let data = [{ "id":"770","sku": "CMH08-GLD", "name": "roller type r (roda 4 s80)", "currency": "IDR", "min": 1, "stock": 5, "qty": 5, "price": 0, "totalPrice": 0 }, {  "id":"771","sku": "KRT07-DI", "name": "door bumper (stoper handle)", "currency": "IDR", "min": "2", "stock": 100, "qty": 13, "price": 15000, "totalPrice": 195000 }, {  "id":"236","sku": "CW5012-TW", "name": "TULANG SUDUT 135", "currency": "", "min": 1, "stock": 18, "qty": 9, "price": 0, "totalPrice": 0 }]
    addToBag(state.dataUser.userid, JSON.stringify(state.bag))

  },
  resetbag(state) {

    state.bag = []
    addToBag(state.dataUser.userid, JSON.stringify(state.bag))

  },
  changeLang(state, lang) {
    state.lang = lang
    localStorage.setItem("lang", lang);
  }

}
const actions = {
  getUrl({ commit }, url) {
    commit(POST_TOKEN) // show spinner
    setBaseUrl(url)
    commit(TOKEN_VERIFIED)
  },
  reset({ commit, state }) {
    state.dataUser = null
    removeBaseUrl()
    removeToken()
    removeDataUser()
    removeCompany()
    removeDarkMode()
    commit(RESET)
    delete axios.defaults.headers['X-Auth-Token']
    localStorage.clear()

  },
  login({ commit, state }, DATA_LOGIN) {
    commit(LOGIN) // show spinner
    state.dataUser = DATA_LOGIN.dataUser
    setToken(DATA_LOGIN.token)
    setDataUser(JSON.stringify(DATA_LOGIN.dataUser))
    commit(LOGIN_SUCCESS)
  },
  logout({ commit, state }) {
    state.dataUser = null
    removeToken()
    removeDataUser()
    removeDarkMode()
    removeCompany()
    commit(LOGOUT)
    delete axios.defaults.headers['X-Auth-Token']
  },

  // DarkMode(state) {
  //   state.darkMode = !state.darkMode
  // }
}

export default {
  namespaced: true,
  strict: true,
  state,
  mutations,
  actions
}
