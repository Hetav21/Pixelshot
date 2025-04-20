import { exec } from "child_process";
import {
  BrowserWindow,
  Notification,
  dialog,
  ipcMain,
  nativeImage,
} from "electron";
import fs from "fs";
import path from "path";
import screenshot from "screenshot-desktop";
import { ipcMainHandle, ipcWebContentsSend } from "../electron-utils/ipc.js";
import { pathResolverAssets } from "../lib/pathResolver.js";
import { isPlatform } from "../lib/utils.js";
import { ConfigType } from "../types/config.js";
import { signIn, signUp } from "./session.js";
import { addPath, getAllValidPaths } from "./filePaths.js";

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
      options: {
        username: Session["username"];
        interval: number;
        folderPath: string;
        format: "png" | "jpg";
      },
    ) => {
      // Getting interval, folderPath and format from frontend
      const { username, interval, folderPath, format } = options;

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
          const now = new Date();

          // Format: 2025-04-18 and 14-30-00
          const datePart = now.toISOString().split("T")[0];
          const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");

          const fileName = `screenshot_${datePart}_${timePart}.${format}`;
          const dateFolderPath = path.join(folderPath, datePart);
          const savePath = path.join(dateFolderPath, fileName);

          // Ensure the date-based folder exists
          if (!fs.existsSync(dateFolderPath)) {
            fs.mkdirSync(dateFolderPath, { recursive: true });
          }

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
                    `public/icons/${
                      config.appIcon ||
                      (isPlatform("win32") ? "alternate" : "default")
                    }.png`,
                  ),
                ),
                timeoutType: "default",
                urgency: "low",
              }).show();
            }
          };

          if (isPlatform("linux")) {
            exec(`${config.customScreenshotCommand} "${savePath}"`, (err) => {
              if (!err) {
                addPath(username, savePath);
                if (!config.disableNotifications) notifyScreenshot();
              } else {
                console.warn("Screenshot failed:", err);
              }
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

ipcMainHandle("signIn", (_, session) =>
  signIn(session.username, session.password),
);

ipcMainHandle("signUp", (_, session) =>
  signUp(session.username, session.password),
);

ipcMainHandle("getPaths", (_, params) => getAllValidPaths(params.username));
