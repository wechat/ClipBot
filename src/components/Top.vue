<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
const show = ref(false);

const handleScrollTop = () => {
  document.querySelector(".scrollbox")?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleScroll = () => {
  const scrollTop = document.querySelector(".scrollbox")?.scrollTop;
  if (Number(scrollTop) > 300) {
    show.value = true;
  } else {
    show.value = false;
  }
};

onMounted(() => {
  document.addEventListener("scroll", handleScroll, true);
  document.onresize = () => {
    handleScroll();
  };
});

onUnmounted(() => {
  document.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div v-if="show" class="gototop" @click="handleScrollTop">
    <span class="iconfont icon-top"></span>
  </div>
</template>

<style lang="scss" scoped>
.gototop {
  position: fixed;
  right: 36px;
  bottom: 36px;
  z-index: 998;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.1);
  animation: tada 0.5s;
  span {
    color: #999;
    font-size: 24px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
@keyframes tada {
  from {
    transform: scale3d(0, 0, 0);
  }
  80% {
    transform: scale3d(1.2, 1.2, 1.2);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}
</style>
