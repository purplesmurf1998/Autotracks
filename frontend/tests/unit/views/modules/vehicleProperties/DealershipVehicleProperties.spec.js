import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import DealershipVehicleProperties from './../../../../../src/modules/vehicleProperties/DealershipVehicleProperties.vue'

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

  describe('DealershipVehicleProperties.vue', () => {
    const wrapper = shallowMount(DealershipVehicleProperties, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(DealershipVehicleProperties.name).toBe('DealershipVehicleProperties')
    })
    it('should render correct content', () => {
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })