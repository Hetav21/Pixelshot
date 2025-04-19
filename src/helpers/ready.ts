import { dialog, nativeImage, session } from "electron";
import windowStateKeeper from "electron-window-state";
import { BrowserWindow } from "electron/main";
import { isEnv } from "../lib/environment.js";
import { pathResolver } from "../lib/pathResolver.js";
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

  const window = new BrowserWindow({
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

  state.manage(window);
  createTray(config, window);
  createMenu(window);

  if (isEnv("prod")) {
    // Overriding eval function from both global and window objects
    Object.defineProperty(global, "eval", {
      value: () => {
        throw new Error("Sorry, this app does not support window.eval().");
      },
      writable: false,
      configurable: false,
    });

    Object.defineProperty(window, "eval", {
      value: () => {
        throw new Error("Sorry, this app does not support window.eval().");
      },
      writable: false,
      configurable: false,
    });
  } else if (isEnv("dev")) {
    window.webContents.openDevTools();
  }

  if (config.userAgent && config.userAgent !== "")
    window.webContents.setUserAgent(config.userAgent);

  if (config.start === "maximized") {
    window.show();
  } else if (config.start === "minimized") {
    window.minimize();
  } else if (config.start === "tray") {
    window.hide();
  }

  console.log(`App started in ${config.start} state`);

  // Main App Logic

  handleCloseEvents(window, config.exitToTray);
  console.info("Window created successfully");
  return window;
}
