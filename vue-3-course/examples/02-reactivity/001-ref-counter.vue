<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>

<template>
  <div>
    <span data-testid="count">{{ count }}</span>
    <button type="button" data-testid="inc" @click="increment">+</button>
    <button type="button" data-testid="dec" @click="decrement">-</button>
  </div>
</template>
