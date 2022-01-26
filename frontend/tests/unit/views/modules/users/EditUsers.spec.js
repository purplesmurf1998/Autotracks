import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import EditUsers from './../../../../../src/modules/users/EditUsers.vue'

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

  describe('EditUsers.vue', () => {
    const wrapper = shallowMount(EditUsers, { 
      store, 
      localVue,
      currUser: {
        first_name: "TestFName",
        last_name: "TestLName",
        email: "TestEmail",
        role: "TestRole",
        permissions: "TestRole",
      }
    })
    it('has a name', () => {
      expect(EditUsers.name).toBe('EditUsers')
    })
    it('should render correct content', () => {
      
    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })