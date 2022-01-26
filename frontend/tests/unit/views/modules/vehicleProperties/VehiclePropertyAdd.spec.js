import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import VehiclePropertyAdd from './../../../../../src/modules/vehicleProperties/VehiclePropertyAdd.vue'

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

  describe('VehiclePropertyAdd.vue', () => {
    const wrapper = shallowMount(VehiclePropertyAdd, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(VehiclePropertyAdd.name).toBe('VehiclePropertyAdd')
    })
    it('should render correct content', () => {
      expect(wrapper.find('#header-name-txt').exists())
      expect(wrapper.find('#input-type-cmb').exists())
      expect(wrapper.find('#create-staff').exists())
      expect(wrapper.find('#is-visible-cmb').exists())
      expect(wrapper.find('#is-required-cmb').exists())
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })