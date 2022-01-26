import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import DealerShipAccounts from './../../../../../src/modules/users/DealershipAccounts.vue'

const localVue = createLocalVue()
localVue.use(CoreuiVue)
localVue.use(Vuex)

const store = new Vuex.Store({
    state: {
      sidebarShow: 'responsive',
      sidebarMinimize: false,
      asideShow: false,
      darkMode: false
    }
  })

  describe('DealerShipAccounts.vue', () => {
    const wrapper = shallowMount(DealerShipAccounts, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(DealerShipAccounts.name).toBe('DealerShipAccounts')
    })
    it('should render correct content', () => {
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })