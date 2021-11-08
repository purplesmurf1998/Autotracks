import 'core-js/stable'
import Vue from 'vue'
//import CoreuiVuePro from '@coreui/vue-pro'
import CoreuiVuePro from '../node_modules/@coreui/vue-pro/src/index.js'
import App from './App'
import router from './router/index'
import { iconsSet as icons } from './assets/icons/icons.js'
<<<<<<< HEAD
import store from './store/index.js'
import i18n from './i18n.js'
import babelPolyfill from 'babel-polyfill'
=======
import store from './store'
import i18n from './i18n.js'
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)

Vue.use(CoreuiVuePro)
Vue.prototype.$log = console.log.bind(console)

<<<<<<< HEAD
store.dispatch('verify').then(() => {
  new Vue({
    el: '#app',
    router,
    store,
    //CIcon component documentation: https://coreui.io/vue/docs/components/icon
    icons,
    i18n,
    babelPolyfill,
    template: '<App/>',
    components: {
      App
    }
  });
});
<<<<<<< HEAD


=======
new Vue({
  el: '#app',
  router,
  store,
  //CIcon component documentation: https://coreui.io/vue/docs/components/icon
  icons,
  i18n,
  template: '<App/>',
  components: {
    App
  }
})
>>>>>>> 0d32b0b ([AP-54] Jenkins and Docker setup complete)
=======
>>>>>>> f24cc698fcfc5fb83c658b7a0dad6fbcac0b4e1f
