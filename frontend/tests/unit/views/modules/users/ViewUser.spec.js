import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import ViewUser from './../../../../../src/modules/users/ViewUser.vue'

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

  describe('ViewUser.vue', () => {
    const wrapper = shallowMount(ViewUser, { 
      store, 
      localVue,
      user: {
        first_name: "TestFName",
        last_name: "TestLName",
        email: "TestEmail",
        role: "TestRole",
        permissions: "TestRole",
      }
    })
    it('has a name', () => {
      expect(ViewUser.name).toBe('ViewUser')
    })
    it('should render correct content', () => {

    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })