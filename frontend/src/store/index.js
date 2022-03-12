import Vue from 'vue'
import Vuex from 'vuex'
import AuthModule from './modules/auth/index.js'
import EventsModule from './modules/events/index.js'
Vue.use(Vuex)

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
    api: 'http://localhost:5000/api/v1'
  },
  mutations: coreuiMutations
})