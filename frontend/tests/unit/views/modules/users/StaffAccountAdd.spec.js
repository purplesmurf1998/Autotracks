import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import StaffAccountAdd from './../../../../../src/modules/users/StaffAccountAdd.vue'

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

  describe('StaffAccountAdd.vue', () => {
    const wrapper = shallowMount(StaffAccountAdd, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(StaffAccountAdd.name).toBe('StaffAccountAdd')
    })
    it('should render correct content', () => {
        expect(wrapper.find('#role-select').exists())
        expect(wrapper.find('#Add Dealerships').exists())
        expect(wrapper.find('#View Dealerships').exists())
        expect(wrapper.find('#Edit Dealerships').exists())
        expect(wrapper.find('#Add Staff Users').exists())
        expect(wrapper.find('#View Staff Users').exists())
        expect(wrapper.find('#Edit Staff Users').exists())
        expect(wrapper.find('#Delete Staff Users').exists())
        expect(wrapper.find('#Add Vehicles').exists())
        expect(wrapper.find('#View Vehicles').exists())
        expect(wrapper.find('#Edit Vehicles').exists())
        expect(wrapper.find('#Edit Vehicle Locations').exists())
        expect(wrapper.find('#Sell Vehicles').exists())
        expect(wrapper.find('#Delete Vehicles').exists())
        expect(wrapper.find('#Add Vehicle Properties').exists())
        expect(wrapper.find('#Edit Vehicle Properties').exists())
        expect(wrapper.find('#View Vehicle Properties').exists())
        expect(wrapper.find('#Delete Vehicle Properties').exists())
        expect(wrapper.find('#create-staff').exists())
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })