const BASE_URL_KEY = 'baseUrl'
const TOKEN_KEY = 'glmobile-token'
const DATA_USER_KEY = 'data_user'
const DARK_MODE = 'darkmode'
const COMPANY_KEY = 'company'
const BAG_KEY = 'bag'

// BASE URL

export function setBaseUrl(url) {
  let trimmedUrl = url.replace(/\/$/, '')
  localStorage.setItem(BASE_URL_KEY, trimmedUrl)
}

export function getBaseUrl() {
  return localStorage.getItem(BASE_URL_KEY)
}

export function removeBaseUrl() {
  localStorage.removeItem(BASE_URL_KEY)
}

// BASE URL

export function setCompany(name) {
  localStorage.setItem(COMPANY_KEY, name)
}

export function getCompany() {
  return localStorage.getItem(COMPANY_KEY)
}

export function removeCompany() {
  localStorage.removeItem(COMPANY_KEY)
}

// TOKEN

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// DATA LOGIN

export function setDataUser(data_user) {
  localStorage.setItem(DATA_USER_KEY, data_user)
}

export function getDataUser() {
  return JSON.parse(localStorage.getItem(DATA_USER_KEY))
}

export function removeDataUser() {
  localStorage.removeItem(DATA_USER_KEY)
}
// BAG

export function addToBag(user,item) {
  localStorage.setItem(user, item)
}

export function getBag(user) {
  return JSON.parse(localStorage.getItem(user))
}

export function removeBag(user) {
  localStorage.removeItem(user)
}
 
// Dark Mode

export function setDarkMode(dark_mode) {
  localStorage.setItem(DARK_MODE, dark_mode)
}

export function getDarkMode() {
  return JSON.parse(localStorage.getItem(DARK_MODE))
}

export function removeDarkMode() {
  localStorage.removeItem(DARK_MODE)
}
