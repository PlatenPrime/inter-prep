import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0),
  )

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0),
  )

  function addItem(item: Omit<CartItem, 'qty'>, qty = 1) {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) {
      existing.qty += qty
      return
    }
    items.value.push({ ...item, qty })
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, total, itemCount, addItem, removeItem, clear }
})
