import { ref } from "vue";
import { defineStore } from "pinia";
import { storage } from "../utils/index";

export const useClipBoardStore = defineStore("clipBoard", () => {
  const mainSwitch = ref(true); // 主开关 默认打开
  const showType = ref(1); // 0方格子 1列表
  const showSidebar = ref(1); // 0隐藏 1显示
  const list = ref([]); // 剪切列表
  const totalNum = ref(0); // 总条数
  const markNum = ref(0); // 标记数
  const textNum = ref(0); // 文本数
  const imageNum = ref(0); // 图片数
  const linkNum = ref(0); // 链接数
  const fileNum = ref(0); // 链接数
  const selectTabType = ref(0); // 0最近 1标记 2文本 3图片 4链接 5文件

  /**
   * 主开关
   */
  function setMainSwitch() {
    mainSwitch.value = !mainSwitch.value;
    storage.setItem("mainSwitch", mainSwitch.value ? "1" : "0");
  }

  /**
   * 切换列表展示类型
   */
  function setShowType(index: number) {
    showType.value = index;
  }

  /**
   * 切换侧边栏
   */
  function setShowSidebar(index: number) {
    showSidebar.value = index;
  }

  /**
   * 获取列表
   * @param key 主键
   */
  async function getList(key?: number) {
    const result = await window.IBDatabase.getDataByKey(window.db, "list", key);
    list.value = result;
    getAllNum();
  }

  /**
   * 模糊搜索
   * @param key 主键
   */
  async function geSearchList(key?: number) {
    const result = await window.IBDatabase.getDataBySearch(
      window.db,
      "list",
      "text",
      key
    );
    list.value = result;
    selectTabType.value = 0;
    getAllNum();
  }

  /**
   * 通过索引获取
   * @param indexName 索引名
   * @param indexValue 索引值
   */
  async function getDataByIndex(indexName: string, indexValue: number) {
    const result = await window.IBDatabase.getDataByIndex(
      window.db,
      "list",
      indexName,
      indexValue
    );
    list.value = result;
    getAllNum();
  }

  /**
   * 通过索引获取
   * @param indexValue 索引值
   */
  async function getDataByDate(indexValue: number) {
    const result = await window.IBDatabase.getDataByDate(
      window.db,
      "list",
      "createtime",
      indexValue
    );
    list.value = result;
    getAllNum();
  }

  /**
   * 获取总条数
   */
  async function gettotalNum() {
    const result = await window.IBDatabase.getCount(window.db, "list");
    totalNum.value = result;
  }

  /**
   * 获取总条数
   */
  async function getMarkNum() {
    const result = await window.IBDatabase.getCountByIndex(
      window.db,
      "list",
      "mark",
      1
    );
    markNum.value = result;
  }

  /**
   * 获取文本总条数
   */
  async function getTextNum() {
    const result = await window.IBDatabase.getCountByIndex(
      window.db,
      "list",
      "type",
      1
    );
    textNum.value = result;
  }

  /**
   * 获取图片总条数
   */
  async function getImageNum() {
    const result = await window.IBDatabase.getCountByIndex(
      window.db,
      "list",
      "type",
      2
    );
    imageNum.value = result;
  }

  /**
   * 获取链接总条数
   */
  async function getLinkNum() {
    const result = await window.IBDatabase.getCountByIndex(
      window.db,
      "list",
      "type",
      3
    );
    linkNum.value = result;
  }

  /**
   * 获取文件总条数
   */
  async function getFileNum() {
    const result = await window.IBDatabase.getCountByIndex(
      window.db,
      "list",
      "type",
      4
    );
    fileNum.value = result;
  }

  /**
   * 查询总入口
   */
  async function getAllNum() {
    await gettotalNum();
    await getMarkNum();
    await getTextNum();
    await getImageNum();
    await getLinkNum();
    await getFileNum();
  }

  /**
   * 切换列表数据
   * @param type
   */
  const changeTab = (type: number) => {
    selectTabType.value = type;
    switch (type) {
      case 0:
        getList();
        break;
      case 1:
        getDataByIndex("mark", 1);
        break;
      case 2:
        getDataByIndex("type", 1);
        break;
      case 3:
        getDataByIndex("type", 2);
        break;
      case 4:
        getDataByIndex("type", 3);
        break;
      case 5:
        getDataByIndex("type", 4);
        break;
      default:
        break;
    }
  };

  return {
    mainSwitch,
    setMainSwitch,
    showType,
    setShowType,
    showSidebar,
    setShowSidebar,
    list,
    totalNum,
    markNum,
    textNum,
    imageNum,
    linkNum,
    fileNum,
    getList,
    geSearchList,
    getAllNum,
    getDataByIndex,
    selectTabType,
    changeTab,
    getDataByDate,
  };
});
