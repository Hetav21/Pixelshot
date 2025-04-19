import { exec } from "child_process";
import { BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import screenshot from "screenshot-desktop";
import { isPlatform } from "../lib/utils.js";

let captureInterval: NodeJS.Timeout | null = null;

export function registerListeners(mainWindow: BrowserWindow) {
  ipcMain.handle("select-folder", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return filePaths[0] || null;
  });

  ipcMain.on(
    "start-capturing",
    (
      _event,
      options: { interval: number; folderPath: string; format: "png" | "jpg" },
    ) => {
      const { interval, folderPath, format } = options;

      if (captureInterval) clearInterval(captureInterval);

      captureInterval = setInterval(() => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `screenshot_${timestamp}.${format}`;
        const savePath = path.join(folderPath, fileName);

        if (isPlatform("linux")) {
          exec(`grim "${savePath}"`, (err) => {
            if (err) console.error("Grim screenshot failed:", err);
          });
        } else {
          screenshot({ filename: savePath }).catch((err) =>
            console.warn("Screenshot failed:", err),
          );
        }
      }, interval * 1000);
    },
  );

  ipcMain.on("stop-capturing", () => {
    if (captureInterval) {
      clearInterval(captureInterval);
      captureInterval = null;
    }
  });
}
