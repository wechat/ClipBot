<script setup lang="ts">
import { useClipBoardStore } from "../stores/clipBoard";

interface Props {
  title?: string;
}
defineProps<Props>();
const store = useClipBoardStore();
</script>

<template>
  <div
    class="menu-btn"
    :class="{ rmbg: store.showSidebar === 0 }"
    @click="store.setShowSidebar(store.showSidebar ? 0 : 1)"
    none-drag-region
  >
    <span
      :class="`iconfont ${
        store.showSidebar === 1 ? 'icon-menu-close' : 'icon-menu-open'
      }`"
    ></span>
  </div>
</template>

<style lang="scss" scoped>
.menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  color: #2d2d2d;
  background-color: #e6e4e4;
  border-radius: 4px;
  -webkit-app-region: no-drag;
  &.rmbg {
    background-color: transparent;
    &:hover {
      background-color: #e6e4e4;
    }
  }
}
</style>
