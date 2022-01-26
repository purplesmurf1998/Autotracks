import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import VehicleDetails from './../../../../../src/modules/vehicles/VehicleDetails.vue'

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

  describe('VehicleDetails.vue', () => {
    const wrapper = shallowMount(VehicleDetails, { 
      store, 
      localVue,
    //   add right properties
      vehicle: {
        missing: "false",
        soldBy: "TestSeller",
      } 
    })
    it('has a name', () => {
      expect(VehicleDetails.name).toBe('VehicleDetails')
    })
    it('should render correct content', () => {
        
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })