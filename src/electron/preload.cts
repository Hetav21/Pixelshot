import { contextBridge, IpcMainEvent, ipcRenderer } from "electron";

const os = require("os");
const fs = require("fs");
const electron = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  subscribeCounter: (callback: (value: number) => void) => {
    return ipcOn("counterTick", (value) => callback(value));
  },
  getPaths: (params: { username: Session["username"] }) =>
    ipcInvoke("getPaths", params),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  startCapturing: (options: {
    username: Session["username"];
    interval: number;
    folderPath: string;
    format: "png" | "jpg";
  }) => ipcRenderer.send("start-capturing", options),
  stopCapturing: () => ipcRenderer.send("stop-capturing"),
  getHomeDir: () => os.homedir(),
  signIn: (options: {
    username: Session["username"];
    password: Session["password"];
  }) => ipcInvoke("signIn", options),
  signUp: (options: {
    username: Session["username"];
    password: Session["password"];
  }) => ipcInvoke("signUp", options),
  readImageAsDataUrl: (path: string) =>
    new Promise((resolve, reject) => {
      fs.readFile(
        path.replace("file://", ""),
        (err: Error | null, data: any) => {
          if (err) reject(err);
          else
            resolve(
              `data:image/${path.endsWith(".png") ? "png" : "jpeg"};base64,${data.toString("base64")}`,
            );
        },
      );
    }),
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

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
  ...args: any[]
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key, ...args);
}

function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key],
) {
  electron.ipcRenderer.send(key, payload);
}
