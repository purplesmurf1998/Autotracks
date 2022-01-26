import {createLocalVue, shallowMount} from '@vue/test-utils'
import CoreuiVue from '@coreui/vue-pro'
import Vuex from 'vuex'

import EditDealership from './../../../../../src/modules/dealerships/EditDealership.vue'

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

describe('EditDealership.vue', () => {
  const wrapper = shallowMount(EditDealership, { 
    store, 
    localVue,
    dealershipAccount: {
      dealershipName: "testName",
      dealershipDescription: "testDescription"
    } 
  })
  it('has a name', () => {
    expect(EditDealership.name).toBe('EditDealership')
  })
  it('should render correct content', () => {
    expect(wrapper.find('h1').text()).toMatch('Step 2: Register new dealership!')
    expect(wrapper.find('p').text()).toMatch('The dealership is the account everything will be tied to.')
  })
  test('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
