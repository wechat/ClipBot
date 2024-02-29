<script setup lang="ts">
import { useClipBoardStore } from "../stores/clipBoard";

const store = useClipBoardStore();
</script>

<template>
  <div class="menu-list" v-if="store.showSidebar === 1">
    <h2>快捷入口</h2>
    <ul>
      <li
        :class="[{ activate: store.selectTabType === 0 }]"
        @click="store.changeTab(0)"
      >
        <div class="menu-left">
          <span class="iconfont icon-time"></span>
          <span>最近</span>
        </div>
        <div class="menu-right">{{ store.totalNum }}</div>
      </li>
      <li
        :class="[{ activate: store.selectTabType === 1 }]"
        @click="store.changeTab(1)"
      >
        <div class="menu-left">
          <span class="iconfont icon-bookmark"></span>
          <span>标记</span>
        </div>
        <div class="menu-right">{{ store.markNum }}</div>
      </li>
    </ul>
    <h2>剪切类型</h2>
    <ul>
      <li
        :class="[{ activate: store.selectTabType === 2 }]"
        @click="store.changeTab(2)"
      >
        <div class="menu-left">
          <span class="iconfont icon-text"></span>
          <span>文本</span>
        </div>
        <div class="menu-right">{{ store.textNum }}</div>
      </li>
      <li
        :class="[{ activate: store.selectTabType === 3 }]"
        @click="store.changeTab(3)"
      >
        <div class="menu-left">
          <span class="iconfont icon-pic"></span>
          <span>图片</span>
        </div>
        <div class="menu-right">{{ store.imageNum }}</div>
      </li>
      <li
        :class="[{ activate: store.selectTabType === 4 }]"
        @click="store.changeTab(4)"
      >
        <div class="menu-left">
          <span class="iconfont icon-link"></span>
          <span>链接</span>
        </div>
        <div class="menu-right">{{ store.linkNum }}</div>
      </li>
      <li
        :class="[{ activate: store.selectTabType === 5 }]"
        @click="store.changeTab(5)"
      >
        <div class="menu-left">
          <span class="iconfont icon-file"></span>
          <span>文件</span>
        </div>
        <div class="menu-right">{{ store.fileNum }}</div>
      </li>
    </ul>
  </div>
  <ul class="btn" v-else>
    <li><MenuBtn /></li>
    <li :class="{ on: store.selectTabType === 0 }" @click="store.changeTab(0)">
      <span class="iconfont icon-time"></span>
    </li>
    <li :class="{ on: store.selectTabType === 1 }" @click="store.changeTab(1)">
      <span class="iconfont icon-bookmark"></span>
    </li>
    <li :class="{ on: store.selectTabType === 2 }" @click="store.changeTab(2)">
      <span class="iconfont icon-text"></span>
    </li>
    <li :class="{ on: store.selectTabType === 3 }" @click="store.changeTab(3)">
      <span class="iconfont icon-pic"></span>
    </li>
    <li :class="{ on: store.selectTabType === 4 }" @click="store.changeTab(4)">
      <span class="iconfont icon-link"></span>
    </li>
    <li :class="{ on: store.selectTabType === 5 }" @click="store.changeTab(5)">
      <span class="iconfont icon-file"></span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.menu-list {
  padding: 0 14px 10px;
  h2 {
    position: relative;
    margin-bottom: 10px;
    padding-left: 14px;
    color: #666;
    font-size: 18px;
    &::before {
      position: absolute;
      top: 4px;
      left: 0;
      display: inline-block;
      width: 6px;
      height: 16px;
      background-color: #3d50f5;
      content: "";
    }
  }
  ul {
    margin-bottom: 20px;
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      border-radius: 4px;
      cursor: pointer;

      &.activate,
      &:hover {
        background-color: #e6e4e4;
      }

      .iconfont {
        margin-right: 6px;
        color: #3d50f5;
      }

      .menu-left {
        display: flex;
        align-items: center;
      }
      .menu-right {
        color: #999;
        font-size: 12px;
      }
    }
  }
}
.btn {
  margin-left: 16px;
  text-align: center;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-bottom: 10px;
    cursor: pointer;
    &.on,
    &:hover {
      background-color: #e6e4e4;
      border-radius: 4px;
    }
  }
}
</style>
