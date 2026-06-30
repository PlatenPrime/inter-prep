import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from './useCartStore'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds items and computes total', () => {
    const cart = useCartStore()
    cart.addItem({ id: '1', name: 'Book', price: 10 })
    cart.addItem({ id: '1', name: 'Book', price: 10 }, 2)
    expect(cart.itemCount).toBe(3)
    expect(cart.total).toBe(30)
  })

  it('removes items', () => {
    const cart = useCartStore()
    cart.addItem({ id: '1', name: 'Book', price: 10 })
    cart.removeItem('1')
    expect(cart.itemCount).toBe(0)
  })
})
