import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import VehicleProperties from './../../../../../src/modules/vehicles/VehicleProperties.vue'

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

  describe('VehicleProperties.vue', () => {
    const wrapper = shallowMount(VehicleProperties, { 
      store, 
      localVue,
      vehicle: {
        vehicleProperties: "testProperty",
        leftProperties: "testLeftProperty",
        rightProperties: "testRightProperty",
        editingProperties: true,
      } 
    })
    it('has a name', () => {
      expect(VehicleProperties.name).toBe('VehicleProperties')
    })
    it('should render correct content', () => {

    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })