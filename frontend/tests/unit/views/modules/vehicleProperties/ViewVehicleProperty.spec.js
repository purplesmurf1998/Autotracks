import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import ViewVehicleProperty from './../../../../../src/modules/vehicleProperties/ViewVehicleProperty.vue'

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

  describe('ViewVehicleProperty.vue', () => {
    const wrapper = shallowMount(ViewVehicleProperty, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(ViewVehicleProperty.name).toBe('ViewVehicleProperty')
    })
    it('should render correct content', () => {
        
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })