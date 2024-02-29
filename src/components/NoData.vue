<script setup lang="ts">
interface Props {
  title?: string;
}
defineProps<Props>();
</script>

<template>
  <div class="nodata">
    <div class="inner">
      <span class="iconfont icon-nodata"></span>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nodata {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;

  p {
    color: #b1afaf;
  }
  .iconfont {
    color: #eee;
    font-size: 100px;
  }
}
</style>
