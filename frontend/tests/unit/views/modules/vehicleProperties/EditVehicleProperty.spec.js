import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import EditVehicleProperty from './../../../../../src/modules/vehicleProperties/EditVehicleProperty.vue'

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

  describe('EditVehicleProperty.vue', () => {
    const wrapper = shallowMount(EditVehicleProperty, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(EditVehicleProperty.name).toBe('EditVehicleProperty')
    })
    it('should render correct content', () => {
        
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })