import { contextBridge, IpcMainEvent, ipcRenderer } from "electron";

const os = require("os");
const electron = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  subscribeCounter: (callback: (value: number) => void) => {
    return ipcOn("counterTick", (value) => callback(value));
  },
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  startCapturing: (options: {
    interval: number;
    folderPath: string;
    format: "png" | "jpg";
  }) => ipcRenderer.send("start-capturing", options),
  stopCapturing: () => ipcRenderer.send("stop-capturing"),
  startCapturingSimple: () => ipcRenderer.send("start-capturing-simple"),
  getHomeDir: () => os.homedir(),
});

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void,
) {
  const cb = (_: IpcMainEvent, payload: EventPayloadMapping[Key]) =>
    callback(payload);

  electron.ipcRenderer.on(key, cb);

  // returning an method so that,
  // we do not immidiately unsubscribe
  // the event listener
  return () => {
    electron.ipcRenderer.off(key, cb);
  };
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key],
) {
  electron.ipcRenderer.send(key, payload);
}
