import dayjs from "dayjs";

/**
 * 判断字符是否为有效url
 * @param str
 * @returns boolean
 */
export function isValidUrl(str: string) {
  if (str) {
    let arr = str.split(" ");
    if (arr && arr.length === 1) {
      let url;
      try {
        url = new URL(arr[0]);
      } catch (e) {
        return false;
      }
      return url.protocol === "http:" || url.protocol === "https:";
    }
  }
  return false;
}

/**
 * 换行符替换成空格
 * @param {string} str
 * @returns {string}
 */
export function replaceNewlinesWithSpaces(str: string | undefined) {
  if (str) {
    return str.replace(/\n/g, " ");
  }
  return "";
}

/**
 * 时间戳格式化
 * @param time - 时间戳
 * @param format - 格式
 * @returns
 */
export function timeFormat(time: number, format: string) {
  return dayjs(time).format(format);
}

/**
 * 时间比较
 * @param time - 时间戳
 * @param format - 格式
 * @returns
 */
export function timeEqual(t1: number, t2: string) {
  return dayjs(t1).format("YYYY-MM-DD") === t2;
}

/**
 * 操作本地缓存
 * @param {*} name
 */
export const storage = {
  getItem(key: string) {
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
  },
};

/**
 * 是否大于多少天
 * @param time 
 * @param day 
 */
export const isGreaterDay = (time: number, day: number) => {
  if (time) {
    const now = dayjs().valueOf();
    const dayNum = 1000 * 60 * 60 * 24 * day;
    return now - time > dayNum; 
  }
};
