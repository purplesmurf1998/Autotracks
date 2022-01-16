import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import CoreuiVue from '@coreui/vue-pro'
import User from './../../../../src/views/users/User.vue'
import appRouter from '@/router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = appRouter
router.push({path: '/users/1'})

localVue.use(CoreuiVue)

describe('User.vue', () => {
  const wrapper = shallowMount(User, { localVue, router })
  it('has a name', () => {
    expect(User.name).toBe('User')
  })
  it('is Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })
  it('is User', () => {
    expect(wrapper.findComponent(User)).toBeTruthy()
  })
  it('should have methods', () => {
    expect(typeof User.methods.goBack).toEqual('function')
  })
  test('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
