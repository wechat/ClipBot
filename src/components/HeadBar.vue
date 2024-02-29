<script setup lang="ts">
interface Props {
  title?: string;
}
defineProps<Props>();
</script>

<template>
  <div class="head-bar" data-tauri-drag-region>{{ title }}</div>
</template>

<style lang="scss" scoped>
.head-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.8rem;
}
</style>
