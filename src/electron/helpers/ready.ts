import { dialog, nativeImage, session } from "electron";
import windowStateKeeper from "electron-window-state";
import { BrowserWindow } from "electron/main";
import { isEnv } from "../lib/environment.js";
import { getUIPath, pathResolver } from "../lib/pathResolver.js";
import { isPlatform } from "../lib/utils.js";
import { ConfigType } from "../types/config.js";
import { createMenu } from "./menu.js";
import { handleCloseEvents, handleTerminate } from "./terminate.js";
import { createTray } from "./tray.js";

export async function getAppReady(config: ConfigType) {
  console.info("Creating window");
  handleTerminate();

  if (config.error) {
    console.info("Config Error: Showing dialog");

    dialog.showMessageBox({
      title: "Configuration Error",
      message: `Error in config file '${config.error}'.\n Loading default configuration`,
    });
  }

  const state = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  if (config.clearCache) {
    console.info("Clearing Cache Data");
    try {
      await session.fromPartition(config.partition).clearCache();
    } catch (err) {
      console.warn("Failed to clear cache data");
      console.info("ERROR: ", err);
      console.debug("DEBUG: \n", "partition: ", config.partition);
    }
  }

  if (config.clearStorage) {
    console.info("Clearing Storage Data");
    try {
      await session.fromPartition(config.partition).clearStorageData();
    } catch (err) {
      console.warn("Failed to clear storage data");
      console.info("ERROR: ", err);
      console.debug("DEBUG: \n", "partition: ", config.partition);
    }
  }

  const icon =
    config.appIcon || (isPlatform("win32") ? "alternate" : "default");

  const mainWindow = new BrowserWindow({
    title: config.title,

    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,

    autoHideMenuBar: config.menubar,
    frame: config.frame,

    icon: nativeImage.createFromPath(pathResolver(`assets/icons/${icon}.png`)),

    webPreferences: {
      partition: config.partition,
      nodeIntegration: false,
      contextIsolation: config.contextIsolation,
      sandbox: config.sandbox,
    },
  });

  state.manage(mainWindow);
  createTray(config, mainWindow);
  createMenu(mainWindow);

  if (isEnv("dev")) {
    mainWindow.webContents.openDevTools();
  }

  if (config.userAgent && config.userAgent !== "")
    mainWindow.webContents.setUserAgent(config.userAgent);

  if (config.start === "maximized") {
    mainWindow.show();
  } else if (config.start === "minimized") {
    mainWindow.minimize();
  } else if (config.start === "tray") {
    mainWindow.hide();
  }

  console.log(`App started in ${config.start} state`);

  // Main App
  if (isEnv("dev")) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    // path from node,
    // ensures that we get the correct path
    // irrespective of the OS
    mainWindow.loadFile(getUIPath());
  }

  handleCloseEvents(mainWindow, config.exitToTray);
  console.info("Window created successfully");
  return mainWindow;
}
