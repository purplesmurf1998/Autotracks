import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import EditVehicleProperties from './../../../../../src/modules/vehicles/EditVehicleProperties.vue'

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

  describe('EditVehicleProperties.vue', () => {
    const wrapper = shallowMount(EditVehicleProperties, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(EditVehicleProperties.name).toBe('EditVehicleProperties')
    })
    it('should render correct content', () => {
        expect(wrapper.find('h4').text()).toMatch('Vehicle Properties')
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })