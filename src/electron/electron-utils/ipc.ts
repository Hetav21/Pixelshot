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

// wrapper around webContents.send, so as to increase type safety
export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: Electron.WebContents,
  payload: EventPayloadMapping[Key],
) {
  webContents.send(key, payload);
}
