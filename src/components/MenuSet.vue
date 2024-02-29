<script setup lang="ts">
import { getVersion } from '@tauri-apps/api/app';
import { ref, onMounted } from "vue";
import { listen } from "@tauri-apps/api/event";
import { useClipBoardStore } from "../stores/clipBoard";

interface Props {
  title?: string;
}
defineProps<Props>();
const store = useClipBoardStore();
const version = ref('');
const show = ref(false);
const showsc = ref(false);
const opensc = () => {
  showsc.value = !showsc.value;
};

onMounted(async() => {
  const v = await getVersion();
  if (v) {
    version.value = v
  }
  listen("active_about", () => {
    if (!show.value) {
      show.value = true;
    }
  });
});
</script>

<template>
  <div class="menu-set" @click="show = !show">
    <div class="btn" :class="{ rmbg: store.showSidebar === 0 }">
      <span class="iconfont icon-set"></span>
    </div>
    <a-modal v-model:visible="show" :footer="false" :hide-title="true">
      <div class="about">
        <img src="/128x128@2x.png" alt="" />
        <a href="https://github.com/wechat/ClipBot/releases" target="_blank"
          >https://github.com/wechat/ClipBot/releases</a
        >
        <p class="version">版本 {{ version }}</p>
        <p class="copyright">Copyright © 2024 ClipBot</p>
        <p class="support">
          鼓励 ClipBot 开发者，<span @click="opensc"
            >点击{{ showsc ? "隐藏" : "展示" }}赞赏码</span
          >
        </p>
        <img v-if="showsc" class="supportcode" src="/supportcode.png" alt="" />
      </div>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.menu-set {
  display: flex;
  flex-shrink: 0;
  cursor: pointer;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-right: 4px;
    background-color: #e6e4e4;
    border-radius: 4px;

    &.rmbg {
      background-color: transparent;
      &:hover {
        background-color: #e6e4e4;
      }
    }
  }
}
.about {
  padding-bottom: 20px;
  text-align: center;
  color: #666;
  img {
    display: block;
    width: 80px;
    margin: 0 auto 20px;
  }
  .version {
    padding: 10px 0;
  }
  .copyright {
    margin-bottom: 20px;
    color: #999;
    font-size: 12px;
  }
  .support {
    color: #666;
    span {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .supportcode {
    width: 210px;
    margin-top: 20px;
    border-radius: 8px;
  }
}
</style>
