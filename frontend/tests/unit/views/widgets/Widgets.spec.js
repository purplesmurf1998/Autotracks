import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import WidgetsDropdown from '@/views/widgets/WidgetsDropdown.vue'

Vue.use(CoreuiVue)

describe('WidgetsDropdown.vue', () => {
  it('has a name', () => {
    expect(WidgetsDropdown.name).toBe('Widgets')
  })
  it('is Vue instance', () => {
    const wrapper = shallowMount(WidgetsDropdown)
    expect(wrapper.vm).toBeTruthy()
  })
  it('is Widgets', () => {
    const wrapper = shallowMount(WidgetsDropdown)
    expect(wrapper.findComponent(WidgetsDropdown)).toBeTruthy()
  })
  test('renders correctly', () => {
    const wrapper = shallowMount(WidgetsDropdown)
    expect(wrapper.element).toMatchSnapshot()
  })
})
