import { exec } from "child_process";
import {
  BrowserWindow,
  Notification,
  dialog,
  ipcMain,
  nativeImage,
} from "electron";
import path from "path";
import screenshot from "screenshot-desktop";
import { pathResolverAssets } from "../lib/pathResolver.js";
import { isPlatform } from "../lib/utils.js";
import { ConfigType } from "../types/config.js";
import { ipcWebContentsSend } from "../electron-utils/ipc.js";

let captureInterval: NodeJS.Timeout | null = null;
let countdownTimeout: NodeJS.Timeout | null = null;

export function registerListeners(
  mainWindow: BrowserWindow,
  config: ConfigType,
) {
  // Select Folder Popup
  ipcMain.handle("select-folder", async () => {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    return filePaths[0] || null;
  });

  // Start Capturing using screenshot-desktop
  ipcMain.on(
    "start-capturing",
    async (
      event,
      options: { interval: number; folderPath: string; format: "png" | "jpg" },
    ) => {
      // Getting interval, folderPath and format from frontend
      const { interval, folderPath, format } = options;

      // Removing existing interval (if any)
      if (captureInterval) clearInterval(captureInterval);
      if (countdownTimeout) clearTimeout(countdownTimeout);

      // Countdown duration (in seconds)
      const countdownSeconds = 3;

      for (let i = countdownSeconds; i >= 0; i--) {
        setTimeout(
          () => {
            // sends data to the renderer process
            ipcWebContentsSend("counterTick", mainWindow.webContents, i);
          },
          (countdownSeconds - i) * 1000,
        );
      }

      // After countdown, start screenshot interval
      countdownTimeout = setTimeout(() => {
        const takeScreenshot = () => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const fileName = `screenshot_${timestamp}.${format}`;
          const savePath = path.join(folderPath, fileName);

          const notifyScreenshot = () => {
            const title = "Screenshot Taken";
            const body = `Saved to ${fileName}`;

            if (isPlatform("linux")) {
              exec(`${config.customNotificationCommand} "${title}" "${body}"`);
            } else {
              new Notification({
                title,
                body,
                silent: true,
                icon: nativeImage.createFromPath(
                  pathResolverAssets(
                    `public/icons/${config.appIcon || (isPlatform("win32") ? "alternate" : "default")}.png`,
                  ),
                ),
                timeoutType: "default",
                urgency: "low",
              }).show();
            }
          };

          // In case of linux use fallback
          if (isPlatform("linux")) {
            exec(`${config.customScreenshotCommand} "${savePath}"`, (err) => {
              if (!err && !config.disableNotifications) notifyScreenshot();
            });
          } else {
            screenshot({ filename: savePath })
              .then(() => {
                if (!config.disableNotifications) notifyScreenshot();
              })
              .catch((err) => console.warn("Screenshot failed:", err));
          }
        };

        // Take first screenshot immediately
        takeScreenshot();

        // Then start interval
        captureInterval = setInterval(takeScreenshot, interval * 1000);
      }, countdownSeconds * 1000);
    },
  );

  // Stop capturing screenshots
  // clearing interval and setting it to null
  ipcMain.on("stop-capturing", () => {
    if (captureInterval) {
      clearInterval(captureInterval);
      captureInterval = null;
    }
    if (countdownTimeout) {
      clearTimeout(countdownTimeout);
      countdownTimeout = null;
    }
  });
}
