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

let captureInterval: NodeJS.Timeout | null = null;

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
    (
      _event,
      options: { interval: number; folderPath: string; format: "png" | "jpg" },
    ) => {
      // Getting interval, folderPath and format from frontend
      const { interval, folderPath, format } = options;

      // Removing existing interval (if any)
      if (captureInterval) clearInterval(captureInterval);

      // Creating a new interval
      captureInterval = setInterval(() => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `screenshot_${timestamp}.${format}`;
        const savePath = path.join(folderPath, fileName);

        // Creating a notification of screenshot
        const notifyScreenshot = () => {
          const title = "Screenshot Taken";
          const body = `Saved to ${fileName}`;

          // In case of linux use native
          // notify-send api
          if (isPlatform("linux")) {
            console.debug(
              "DEBUG \n",
              `config.customNotificationCommand: ${config.customNotificationCommand}`,
            );
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

        // Taking screenshot and showing notification
        // based on user config
        // in case of linux use grim
        if (isPlatform("linux")) {
          exec(`${config.customScreenshotCommand} "${savePath}"`, (err) => {
            console.debug(
              "DEBUG \n",
              `config.customScreenshotCommand: ${config.customScreenshotCommand}`,
            );
            if (err) {
              console.warn("Custom screenshot command failed:", err);
            } else {
              if (!config.disableNotifications) notifyScreenshot();
            }
          });
        } else {
          screenshot({ filename: savePath })
            .then(() => {
              if (!config.disableNotifications) notifyScreenshot();
            })
            .catch((err) => console.warn("Screenshot failed:", err));
        }
      }, interval * 1000);
    },
  );

  // Stop capturing screenshots
  // clearing interval and setting it to null
  ipcMain.on("stop-capturing", () => {
    if (captureInterval) {
      clearInterval(captureInterval);
      captureInterval = null;
    }
  });
}
