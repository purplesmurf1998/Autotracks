import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import Register from './../../../../src/views/pages/authentication/Register.vue'

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
    expect(wrapper.find('p').text()).toMatch('This account will be the admin account to the dealership.')
    expect(wrapper.find('#email-txt-field').exists())
    expect(wrapper.find('#password-txt-field').exists())
    expect(wrapper.find('#email-txt-field').exists())
    expect(wrapper.find('#login-btn').exists())
    expect(wrapper.find('#forgot-pswrd-btn').exists())
  })
  test('renders correctly', () => {
    const wrapper = shallowMount(Register, { store, localVue })
    expect(wrapper.element).toMatchSnapshot()
  })
})
