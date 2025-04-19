import { contextBridge, ipcRenderer } from "electron";
const os = require("os");

contextBridge.exposeInMainWorld("electronAPI", {
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
