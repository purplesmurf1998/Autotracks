import { createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import CoreuiVue from '@coreui/vue-pro'
import App from '@/App'

const localVue = createLocalVue()
localVue.use(VueRouter)


localVue.use(CoreuiVue)

describe('App.vue', () => {
  it('has a name', () => {
    expect(App.name).toBe('App')
  })
})
