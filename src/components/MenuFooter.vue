<script setup lang="ts">
import { useClipBoardStore } from "../stores/clipBoard";

interface Props {
  title?: string;
}
defineProps<Props>();
const store = useClipBoardStore();
</script>

<template>
  <div class="menu-footer" :class="{ hide: store.showSidebar === 0 }">
    <ul
      v-if="store.showSidebar === 1"
      :class="store.mainSwitch ? 'switch open' : 'switch close'"
      @click="store.setMainSwitch"
    >
      <li><span>开</span></li>
      <li><span>关</span></li>
    </ul>
    <MenuSet />
  </div>
</template>

<style lang="scss" scoped>
.menu-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 200px;
  padding: 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-top: 1px solid #e6e4e4;
  background-color: #f0f0f0;

  &.hide {
    width: 74px;
    padding: 14px 16px;
    border-top: none;
  }

  .switch {
    overflow: hidden;
    display: flex;
    color: #666;
    font-size: 13px;
    background-color: #e6e4e4;
    border-radius: 4px;
    li {
      padding: 3px 10px;
      cursor: pointer;
      span {
        display: block;
        transform: scale(0.9);
      }
    }
  }

  .open {
    border: 1px solid #3d50f5;
    li:first-child {
      color: #fff;
      background-color: #3d50f5;
    }
  }

  .close {
    border: 1px solid #d0cfcf;
    li:last-child {
      background-color: #d0cfcf;
    }
  }
}
</style>
