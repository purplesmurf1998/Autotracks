import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import UserCard from './../../../../../src/modules/users/UserCard.vue'

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

  describe('UserCard.vue', () => {
    const wrapper = shallowMount(UserCard, { 
      store, 
      localVue
    })
    it('has a name', () => {
      expect(UserCard.name).toBe('UserCard')
    })
    it('should render correct content', () => {

    })
    test('renders correctly', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
  })