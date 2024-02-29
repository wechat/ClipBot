import { timeEqual, storage, isGreaterDay } from "../utils";

interface IResultData {
  id?: number;
  type: number; // 1文本 2图片 3链接 4文件
  mark: number;
  text?: string;
  image?: string;
  file?: string[];
  createtime: number;
}

/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
const openDB = (dbName: string, version = 1): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    let db: IDBDatabase;
    const request = indexedDB.open(dbName, version);

    // 打开数据库成功回调
    request.onsuccess = (e: any) => {
      db = e.target.result;
      resolve(db);
    };

    // 打开失败的回调
    request.onerror = (e) => {
      reject(e);
    };

    // 数据库有更新时候的回调
    request.onupgradeneeded = (e: any) => {
      db = e.target.result;
      let objectStore = null;
      // 创建存储库
      objectStore = db.createObjectStore("list", {
        keyPath: "id", // 这是主键
        autoIncrement: true, // 实现自增
      });
      // 创建索引，在后面查询数据的时候可以根据索引查
      objectStore.createIndex("id", "id", { unique: true });
      objectStore.createIndex("type", "type", { unique: false });
      objectStore.createIndex("mark", "mark", { unique: false });
      objectStore.createIndex("text", "text", { unique: false });
      objectStore.createIndex("createtime", "createtime", { unique: false });
    };
  });
};

/**
 * 事务
 * @param db
 * @param storeName
 * @param auth
 * @returns
 */
const objectStore = (
  db: IDBDatabase,
  storeName: string,
  auth: "readonly" | "readwrite" = "readonly"
): IDBObjectStore => {
  return db
    .transaction([storeName], auth) // 创建事务对象
    .objectStore(storeName); // 获取仓库对象
};

/**
 * 新增数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} data 数据
 */
const addData = (db: IDBDatabase, storeName: string, data: IResultData) => {
  return new Promise((resolve, reject) => {
    if (storage.getItem("mainSwitch") === "1") {
      const request: IDBRequest = objectStore(db, storeName, "readwrite").add(
        data
      );

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (e: any) => {
        reject(e);
      };
    } else {
      resolve(false);
    }
  });
};

/**
 * 删除对象仓库的所有记录
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
const deleteDB = (db: IDBDatabase, storeName: string, key: number) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName, "readwrite").delete(
      key
    );

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 更新数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {object} data 数据
 */
const updateDB = (db: IDBDatabase, storeName: string, data: IResultData) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName, "readwrite").put(
      data
    );

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 通过主键读取数据,没有则获取全部
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} key 主键值
 */
const getDataByKey = (db: IDBDatabase, storeName: string, key: number) => {
  return new Promise((resolve, reject) => {
    const _objectStore: IDBObjectStore = objectStore(db, storeName);
    const request: IDBRequest = key
      ? _objectStore.get(key)
      : _objectStore.getAll(); // 通过主键获取数据

    request.onsuccess = () => {
      const arr: IResultData[] = [];
      if (request.result?.length) {
        request.result.map((item: IResultData) => {
          if (isGreaterDay(item.createtime, 30)) {
            deleteDB(db, storeName, item.id!);
          } else {
            arr.push(item);
          }
        });
        arr?.sort((a: IResultData, b: IResultData) => b.id! - a.id!);
      }
      resolve(arr);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 通过索引读取符合条件的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {string} indexValue 索引值
 */
const getDataByIndex = (
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: number | string
) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName)
      .index(indexName) // 索引名
      .getAll(indexValue); // 索引值

    request.onsuccess = () => {
      const arr: IResultData[] = request.result?.sort(
        (a: IResultData, b: IResultData) => b.id! - a.id!
      );
      resolve(arr);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 通过索引模糊查询符合条件的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {string} indexValue 索引值
 */
const getDataBySearch = (
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  query: string
) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName)
      .index(indexName) // 索引名
      .getAll(); // 索引值

    request.onsuccess = () => {
      const result = request.result?.filter((item: IResultData) => {
        return item.text?.includes(query);
      });
      const arr: IResultData[] = result?.sort(
        (a: IResultData, b: IResultData) => b.id! - a.id!
      );
      resolve(arr);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 通过索引模糊查询符合条件的数据
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {string} indexValue 索引值
 */
const getDataByDate = (
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  query: string
) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName)
      .index(indexName) // 索引名
      .getAll(); // 索引值

    request.onsuccess = () => {
      const result = request.result?.filter((item: IResultData) => {
        return timeEqual(item.createtime, query);
      });
      const arr: IResultData[] = result?.sort(
        (a: IResultData, b: IResultData) => b.id! - a.id!
      );
      resolve(arr);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 获取数据总条数
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {string} indexValue 索引值
 */
const getCount = (db: IDBDatabase, storeName: string) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName).count();

    request.onsuccess = () => {
      const count = request.result;
      resolve(count);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

/**
 * 通过索引读取符合条件的数量
 * @param {object} db 数据库实例
 * @param {string} storeName 仓库名称
 * @param {string} indexName 索引名
 * @param {string} indexValue 索引值
 */
const getCountByIndex = (
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  indexValue: number
) => {
  return new Promise((resolve, reject) => {
    const request: IDBRequest = objectStore(db, storeName)
      .index(indexName) // 索引名
      .count(indexValue);

    request.onsuccess = () => {
      const count = request.result;
      resolve(count);
    };

    request.onerror = (e: any) => {
      reject(e);
    };
  });
};

export default {
  openDB,
  addData,
  deleteDB,
  updateDB,
  getCount,
  getCountByIndex,
  getDataByKey,
  getDataByIndex,
  getDataByDate,
  getDataBySearch,
};
