import type { UnlistenFn } from "@tauri-apps/api/event";
import {
  onClipboardUpdate,
  onImageUpdate,
  onTextUpdate,
  onFilesUpdate,
  startListening,
  listenToMonitorStatusUpdate,
} from "tauri-plugin-clipboard-api";

let unlistenTextUpdate: UnlistenFn;
let unlistenImageUpdate: UnlistenFn;
let unlistenClipboard: () => Promise<void>;
let unlistenFiles: UnlistenFn;

/**
 * 开始监听剪贴板变化
 */
async function start() {
  unlistenClipboard = await startListening();

  // 当剪贴板内容发生变化时触发的事件监听函数
  onClipboardUpdate(() => {
    console.log("plugin:clipboard://clipboard-monitor/update event received");
  });
}

start();

export const listenStatus = (cb: (b: boolean) => void) => {
  listenToMonitorStatusUpdate((running: boolean) => {
    cb && cb(running);
  });
};

export const textUpdate = async (cb: (s: string) => void) => {
  unlistenTextUpdate = await onTextUpdate((newText) => {
    cb && cb(newText);
  });
};

export const imageUpdate = async (cb: (s: string) => void) => {
  unlistenImageUpdate = await onImageUpdate((b64Str) => {
    cb && cb(b64Str);
  });
};

export const filesUpdate = async (cb: (s: string[]) => void) => {
  unlistenFiles = await onFilesUpdate((newFiles) => {
    cb && cb(newFiles);
  });
};

export const removeListener = () => {
  unlistenTextUpdate();
  unlistenImageUpdate();
  unlistenFiles();
  unlistenClipboard();
};
