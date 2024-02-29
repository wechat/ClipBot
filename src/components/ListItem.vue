<script setup lang="ts">
import { writeText, writeImage } from "tauri-plugin-clipboard-api";
import { Message, Modal } from "@arco-design/web-vue";
import { replaceNewlinesWithSpaces, timeFormat } from "../utils";
import { useClipBoardStore } from "../stores/clipBoard";

interface IResultData {
  id: number;
  type: number; // 1文本 2图片 3链接 4文件
  mark: number;
  text: string;
  image: string;
  file: string[];
  createtime: number;
}
interface Props {
  item: IResultData;
}

const props = defineProps<Props>();
const store = useClipBoardStore();

/**
 * 复制
 * @param item
 */
const handerCopy = (item: IResultData) => {
  try {
    const { type, text, image } = item;
    if (type === 1 || type === 3) {
      const _text = text.trim();
      if (_text) {
        writeText(_text);
      }
    } else if (type === 2) {
      console.log(image);
      writeImage(image);
    }
    Message.info("复制成功");
  } catch (error) {
    Message.info("复制失败");
  }
};

/**
 * 打标记
 * @param item
 */
const handerAddMark = async (item: IResultData) => {
  const obj = { ...item, mark: item.mark === 1 ? 0 : 1 };
  const result = await window.IBDatabase.updateDB(window.db, "list", obj);
  if (result) {
    if (item.mark === 1) {
      Message.info("标记取消");
    } else {
      Message.info("标记成功");
    }
    store.getList();
    store.selectTabType = 0;
  }
};

/**
 * 删除
 * @param id
 */
const handerDelete = async (id: number) => {
  Modal.confirm({
    title: "提示",
    content: "确认删除吗？",
    okText: "确认",
    cancelText: "取消",
    modalStyle: {
      width: "220px",
    },
    onOk: async () => {
      const result = await window.IBDatabase.deleteDB(window.db, "list", id);
      result && store.getList();
    },
  });
};
</script>

<template>
  <div class="list-item" :class="{grid: store.showType === 0}">
    <div class="inner">
      <div class="time">
        {{ timeFormat(props.item.createtime, "YYYY/MM/DD HH:mm") }}
      </div>
      <div class="list-content">
        <div class="text" v-if="props.item.type === 1 && props.item.text">
          {{ replaceNewlinesWithSpaces(props.item.text) }}
        </div>
        <div class="img" v-else-if="props.item.type === 2 && props.item.image">
          <img :src="`data:image/png;base64,${props.item.image}`" alt="" />
        </div>
        <div class="text" v-else-if="props.item.type === 3 && props.item.text">
          <a :href="props.item.text" target="_blank">
            {{ props.item.text }}
          </a>
        </div>
        <div class="text" v-if="props.item.type === 4 && props.item.file">
          {{ props.item.file }}
        </div>
        <div class="text" v-else></div>
        <div class="btn-list">
          <div
            title="复制"
            class="btn-list-item copy"
            v-if="props.item.type !== 4"
            @click="handerCopy(props.item)"
          >
            <span class="iconfont icon-copy"></span>
          </div>
          <div
            title="标记"
            class="btn-list-item bookmark"
            v-if="props.item.type !== 4"
            @click="handerAddMark(props.item)"
          >
            <span class="iconfont icon-bookmark"></span>
          </div>
          <div
            title="删除"
            class="btn-list-item delete"
            @click="handerDelete(props.item.id!)"
          >
            <span class="iconfont icon-delete"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  .inner {
    position: relative;
    display: flex;
    align-items: center;
    height: 98px;
    margin-bottom: 12px;
    padding: 0 20px;
    color: #555;
    background-color: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      background-color: rgba(61, 80, 245, 0.05);
      .list-content {
        .btn-list {
          display: flex;
        }
      }
    }
  }

  .time {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 2px 8px 0px;
    color: #999;
    border-radius: 0 4px 0 4px;
    text-align: right;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .list-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .text {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 1.5;
      word-break: break-all;

      a {
        color: #3d50f5;
      }
    }

    .img {
      border-radius: 6px;
      img {
        width: auto;
        height: 48px;
        border-radius: 6px;
      }
    }

    .btn-list {
      display: none;
      align-items: center;
      justify-content: flex-end;
      padding-left: 20px;

      &-item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        margin-left: 4px;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;

        &.copy {
          background-color: #00caaa;
        }

        &.bookmark {
          background-color: #6572e8;
        }

        &.delete {
          background-color: #d95040;
        }
      }
    }
  }

  &.grid {
    overflow: hidden;
    width: 25%;
    .inner {
      display: block;
      margin-right: 12px;
      height: 180px;
    }
    &:nth-child(4n) {
      .inner {
        margin-right: 0;
      }
    }
    .time {
      white-space: nowrap;
    }
    .list-content {
      display: block;
      padding-top: 40px;
      .text {
        margin-bottom: 10px;
        -webkit-line-clamp: 3;
      }
      .img {
        overflow: hidden;
        margin-bottom: 10px;
        border-radius: 6px;
        img {
          height: 58px;
        }
      }
    }
    .btn-list {
      padding-left: 0;
    }
  }
}
</style>
