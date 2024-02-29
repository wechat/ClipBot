import {
  textUpdate,
  imageUpdate,
  filesUpdate,
  removeListener,
} from "./clipboard";
import IBDatabase from "./db";
import { isValidUrl } from "../utils";
import { useClipBoardStore } from "../stores/clipBoard";

export async function main(cb: () => void) {
  const db = await IBDatabase.openDB("clipbotBD", 1);
  const { getList } = useClipBoardStore();

  window.db = db;
  window.IBDatabase = IBDatabase;
  cb && cb();

  textUpdate((text) => {
    IBDatabase.addData(db, "list", {
      type: isValidUrl(text.trim()) ? 3 : 1,
      text: text.trim(),
      mark: 0,
      createtime: Date.now(),
    });
    getList();
  });

  imageUpdate((b64Str) => {
    IBDatabase.addData(db, "list", {
      type: 2,
      image: b64Str,
      mark: 0,
      createtime: Date.now(),
    });
    getList();
  });

  filesUpdate((files) => {
    IBDatabase.addData(db, "list", {
      type: 4,
      file: files,
      mark: 0,
      createtime: Date.now(),
    });
    getList();
  });
}

export function remove() {
  removeListener();
}
