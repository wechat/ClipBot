<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { trackEvent } from "@aptabase/tauri";
import { remove } from "./common/index";
import { useClipBoardStore } from "./stores/clipBoard";
import { storage } from "./utils/index";

const clipBoardStore = useClipBoardStore();
const lock = ref(false);
const searchValue = ref("");
storage.setItem("mainSwitch", "1");

// 获取列表数据
clipBoardStore.getList();

const onInput = (e: any) => {
  if (!lock.value) {
    const value = e.target.value;
    if (value) {
      clipBoardStore.geSearchList(value);
    } else {
      clipBoardStore.getList();
    }
  }
};

const onCompositionStart = () => {
  lock.value = true;
};

const onCompositionEnd = (e: any) => {
  clipBoardStore.geSearchList(e.data);
  lock.value = false;
};

const onDateChange = (date: any) => {
  clipBoardStore.getDataByDate(date);
};

onMounted(() => {
  trackEvent("screen_view", { name: "open" });
});

onUnmounted(() => {
  remove();
});
</script>

<template>
  <div class="container">
    <div
      class="container-left"
      :class="{ hide: clipBoardStore.showSidebar === 0 }"
    >
      <MenuTop />
      <Menu />
      <MenuFooter />
    </div>
    <div class="container-right">
      <div class="header" data-tauri-drag-region>
        <div class="search" none-drag-region>
          <input
            class="searchbox"
            type="text"
            placeholder="输入搜索内容"
            maxlength="100"
            v-model.trim="searchValue"
            @input="onInput"
            @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
          />
          <span class="iconfont icon-search"></span>
        </div>
        <ul class="operation" none-drag-region>
          <li @click="clipBoardStore.setShowType(0)">
            <span class="iconfont icon-grid"></span>
          </li>
          <li @click="clipBoardStore.setShowType(1)">
            <span class="iconfont icon-list"></span>
          </li>
          <li>
            <a-date-picker position="tr" @change="onDateChange">
              <span class="iconfont icon-date"></span>
            </a-date-picker>
          </li>
        </ul>
      </div>
      <div class="scrollbox">
        <List v-if="clipBoardStore.list.length" :list="clipBoardStore.list" />
        <NoData v-else />
      </div>
    </div>
    <Top />
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  &-left {
    flex-shrink: 0;
    width: 200px;
    height: 100vh;
    background-color: #f0f0f0;
    &.hide {
      width: 74px;
    }
  }
  &-right {
    flex: 1;
    overflow: hidden;
    height: 100vh;
    background-color: #f8f8f8;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 20px;
      border-bottom: 1px solid #e8e8e8;
      background-color: #fff;
    }
    .search {
      padding-right: 10px;
      border-radius: 4px;
      background-color: #f8f8f8;
      -webkit-app-region: no-drag;
      .searchbox {
        width: 300px;
        height: 38px;
        padding: 0 10px;
        font-size: 16px;
        border: none;
        box-sizing: border-box;
      }
      .iconfont {
        color: #999;
      }
    }
    .operation {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      -webkit-app-region: no-drag;

      li {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        margin-left: 4px;
        background-color: #f8f8f8;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
          background-color: #f3f3f3;
        }
        span {
          display: block;
        }
      }
    }

    .scrollbox {
      overflow-x: hidden;
      overflow-y: scroll;
      height: calc(100vh - 46px);
    }
  }
}
</style>
