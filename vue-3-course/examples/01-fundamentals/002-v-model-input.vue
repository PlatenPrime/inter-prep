<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const quantity = ref(1)
</script>

<template>
  <div>
    <input v-model="search" data-testid="search" type="text" />
    <p data-testid="search-display">{{ search }}</p>
    <input v-model.number="quantity" data-testid="qty" type="number" />
    <span data-testid="qty-display">{{ quantity }}</span>
  </div>
</template>
