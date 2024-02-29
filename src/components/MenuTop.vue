<script setup lang="ts">
import { useClipBoardStore } from "../stores/clipBoard";

interface Props {
  title?: string;
}
defineProps<Props>();
const store = useClipBoardStore();
</script>

<template>
  <div class="menu-top" data-tauri-drag-region>
    <div class="left"></div>
    <MenuBtn v-if="store.showSidebar === 1" />
  </div>
</template>

<style lang="scss" scoped>
.menu-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  .left {
    height: 36px;
  }
}
</style>
