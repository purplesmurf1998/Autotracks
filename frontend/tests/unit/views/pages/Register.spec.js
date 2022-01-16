import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import Register from './../../../../src/views/pages/authentication/Login.vue'

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

describe('Register.vue', () => {
  it('has a name', () => {
    expect(Register.name).toBe('Register')
  })
  it('is Vue instance', () => {
    const wrapper = shallowMount(Register, { store, localVue })
    expect(wrapper.vm).toBeTruthy()
  })
  it('is Register', () => {
    const wrapper = shallowMount(Register, { store, localVue })
    expect(wrapper.findComponent(Register)).toBeTruthy()
  })
  it('should render correct content', () => {
    const wrapper = shallowMount(Register, { store, localVue })
    expect(wrapper.find('h1').text()).toMatch('Step 1: Register new account!')
  })
  test('renders correctly', () => {
    const wrapper = shallowMount(Register, { store, localVue })
    expect(wrapper.element).toMatchSnapshot()
  })
})
