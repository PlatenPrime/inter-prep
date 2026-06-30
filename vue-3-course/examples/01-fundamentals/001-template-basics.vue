<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello Vue')
const isVisible = ref(true)
const items = ref(['Vue', 'Vite', 'Pinia'])

function hide() {
  isVisible.value = false
}
</script>

<template>
  <div>
    <p data-testid="message">{{ message }}</p>
    <p v-if="isVisible" data-testid="visible">Visible block</p>
    <button type="button" @click="hide">Hide</button>
    <ul>
      <li v-for="item in items" :key="item" data-testid="item">{{ item }}</li>
    </ul>
  </div>
</template>
