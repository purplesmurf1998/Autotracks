import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import Vehicle from './../../../../../src/modules/vehicles/Vehicle.vue'

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

  describe('Vehicle.vue', () => {
    const wrapper = shallowMount(Vehicle, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(Vehicle.name).toBe('Vehicle')
    })
    it('should render correct content', () => {
        
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })