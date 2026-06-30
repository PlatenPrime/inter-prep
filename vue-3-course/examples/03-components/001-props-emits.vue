<script setup lang="ts">
const { label } = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  action: [payload: string]
}>()

function handleClick() {
  emit('action', label)
}
</script>

<template>
  <button type="button" data-testid="btn" @click="handleClick">
    {{ label }}
  </button>
</template>
