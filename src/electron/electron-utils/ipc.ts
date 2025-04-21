import { ipcMain, IpcMainInvokeEvent, WebFrameMain } from "electron";
import { pathToFileURL } from "url";
import { isEnv } from "../lib/environment.js";
import { getUIPath } from "../lib/pathResolver.js";
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

// wrapper around ipcMain.handle, so as to increase type safety
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (
    event: IpcMainInvokeEvent,
    ...args: any[]
  ) => EventPayloadMapping[Key],
) {
  ipcMain.handle(key, (event: IpcMainInvokeEvent, ...args: any[]) => {
    validateEventFrame(event.senderFrame!);
    return handler(event, ...args);
  });
}

export function validateEventFrame(frame: WebFrameMain) {
  const expectedUrl = pathToFileURL(getUIPath()).toString();
  const actualUrl = frame.url.split("#")[0];

  if (isEnv("dev") && new URL(frame.url).host === "localhost:3000") {
    return;
  }

  if (actualUrl !== expectedUrl) {
    throw new Error("Malicious Event");
  }
}
