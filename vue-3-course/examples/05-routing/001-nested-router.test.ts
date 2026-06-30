import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createRouter, createMemoryHistory, RouterView } from 'vue-router'

const Home = defineComponent({ template: '<p data-testid="home">Home</p>' })
const Child = defineComponent({ template: '<p data-testid="child">Child</p>' })
const Layout = defineComponent({
  components: { RouterView },
  template: '<div data-testid="layout"><RouterView /></div>',
})

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Home },
      {
        path: '/parent',
        component: Layout,
        children: [{ path: 'child', name: 'child', component: Child }],
      },
    ],
  })
}

describe('05-routing nested router', () => {
  it('renders home route', async () => {
    const router = createTestRouter()
    await router.push('/')
    const wrapper = mount(RouterView, { global: { plugins: [router] } })
    expect(wrapper.get('[data-testid="home"]').text()).toBe('Home')
  })

  it('renders nested child in layout', async () => {
    const router = createTestRouter()
    await router.push('/parent/child')
    const wrapper = mount(RouterView, { global: { plugins: [router] } })
    expect(wrapper.find('[data-testid="layout"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="child"]').text()).toBe('Child')
  })
})
