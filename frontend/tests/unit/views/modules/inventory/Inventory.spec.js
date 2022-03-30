import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import Inventory from './../../../../../src/views/pages/inventory/Inventory.vue'

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

  describe('Inventory.vue', () => {
    const wrapper = shallowMount(Inventory, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(Inventory.name).toBe('Inventory')
    })
    it('should render correct content', () => {
        
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })