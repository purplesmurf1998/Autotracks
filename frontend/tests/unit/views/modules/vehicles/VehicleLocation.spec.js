import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import VehicleLocation from '../../../../../src/modules/vehicles/VehicleLocation.vue'

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

  describe('VehicleLocation.vue', () => {
    const wrapper = shallowMount(VehicleLocation, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(VehicleLocation.name).toBe('VehicleLocation')
    })
    it('should render correct content', () => {
        expect(wrapper.find('h4').text()).toMatch('Location')
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })