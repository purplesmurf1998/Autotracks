import Vue from 'vue'
import Vuex from 'vuex'
import AuthModule from './modules/auth/index.js'
import EventsModule from './modules/events/index.js'
Vue.use(Vuex)
const apiUrl = process.env.NODE_ENV == 'development' ? process.env.VUE_APP_DEV_API_URL : process.env.VUE_APP_PROD_API_URL;

const coreuiMutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  },
  toggle (state, variable) {
    state[variable] = !state[variable]
  }
}


export default new Vuex.Store({
  modules: {
    auth: AuthModule,
    events: EventsModule
  },
  state: {
    sidebarShow: 'responsive',
    sidebarMinimize: false,
    asideShow: false,
    darkMode: false,
    api: apiUrl + '/api/v1',
    nakedApi: apiUrl
  },
  mutations: coreuiMutations
})