import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import VehiclePropertyCard from './../../../../../src/modules/vehicleProperties/VehiclePropertyCard.vue'

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

  describe('VehiclePropertyCard.vue', () => {
    const wrapper = shallowMount(VehiclePropertyCard, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(VehiclePropertyCard.name).toBe('VehiclePropertyCard')
    })
    it('should render correct content', () => {
        
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })