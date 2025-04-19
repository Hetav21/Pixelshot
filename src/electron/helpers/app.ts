import { BrowserWindow, dialog, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import screenshot from "screenshot-desktop";
import { pathResolver } from "../lib/pathResolver.js";
import { exec } from "child_process";
import { isPlatform } from "../lib/utils.js";

export function getMainAppStarted(
  mainWindow: BrowserWindow,
  captureInterval: NodeJS.Timeout | null = null,
) {
  mainWindow.loadFile(pathResolver("app/index.html"));

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

        screenshot({ format })
          .then((img) => fs.writeFileSync(savePath, img))
          .catch((err) => console.error("Screenshot failed:", err));
      }, interval * 1000);
    },
  );

  ipcMain.on("start-capturing-simple", () => {
    console.log("DAJSSD");

    const {
      interval,
      folderPath,
      format,
    }: { interval: number; folderPath: string; format: "png" | "jpg" } = {
      interval: 10,
      folderPath: "/home/hetav/Desktop/CODE/Pixelshot/data",
      format: "png",
    };

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
          console.error("Screenshot failed:", err),
        );
      }
    }, interval * 1000);
  });

  ipcMain.on("stop-capturing", () => {
    if (captureInterval) {
      clearInterval(captureInterval);
      captureInterval = null;
    }
  });
}
