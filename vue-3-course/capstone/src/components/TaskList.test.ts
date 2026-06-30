import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import TaskList from '@capstone/components/TaskList.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/tasks/:id', component: { template: '<div />' } }],
})

describe('TaskList', () => {
  it('renders empty state', () => {
    const wrapper = mount(TaskList, {
      props: { tasks: [] },
      global: { plugins: [router] },
    })
    expect(wrapper.get('[data-testid="empty"]').text()).toContain('No tasks')
  })

  it('emits toggle on checkbox change', async () => {
    const wrapper = mount(TaskList, {
      props: {
        tasks: [{ id: '1', title: 'Test', done: false, createdAt: '' }],
      },
      global: { plugins: [router] },
    })
    await wrapper.get('[data-testid="task-checkbox"]').setValue(true)
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['1'])
  })
})
