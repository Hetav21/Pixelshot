import { ipcMain } from "electron";
import type { Event } from "../types/electron.js";

export function ipcMainEmit(event: Event) {
  return ipcMain.emit(event);
}

export function ipcMainOn(
  event: Event,
  callback: (event: Electron.IpcMainEvent, ...args: undefined[]) => void,
): Electron.IpcMain {
  return ipcMain.on(event, callback);
}
