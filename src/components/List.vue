<script setup lang="ts">
import { useClipBoardStore } from "../stores/clipBoard";

interface IResultData {
  id: number;
  type: number;
  mark: number;
  text: string;
  image: string;
  file: string[];
  createtime: number;
}

interface Props {
  list: IResultData[];
}

const props = defineProps<Props>();
const store = useClipBoardStore();
</script>

<template>
  <div class="list" :class="{ grid: store.showType === 0 }">
    <ListItem v-for="item in props.list" :key="item.id" :item="item" />
  </div>
</template>

<style lang="scss" scoped>
.list {
  margin: 12px 20px 20px;
  &.grid {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
