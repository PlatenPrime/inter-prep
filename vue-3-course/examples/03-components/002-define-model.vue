<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input v-model="model" data-testid="input" type="text" :aria-label="model || 'text'" />
</template>
