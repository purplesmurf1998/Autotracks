import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import VehicleHistory from './../../../../../src/modules/vehicles/VehicleHistory.vue'

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

  describe('VehicleHistory.vue', () => {
    const wrapper = shallowMount(VehicleHistory, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(VehicleHistory.name).toBe('VehicleHistory')
    })
    it('should render correct content', () => {
        expect(wrapper.find('h1').text()).toMatch('Vehicle History')
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })