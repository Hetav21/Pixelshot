import {
  BrowserWindow,
  desktopCapturer,
  dialog,
  nativeImage,
  session,
} from "electron";
import windowStateKeeper from "electron-window-state";
import { registerListeners } from "../app/listeners.js";
import { isEnv } from "../lib/environment.js";
import {
  getUIPath,
  pathResolver,
  pathResolverAssets,
} from "../lib/pathResolver.js";
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

  const mainWindow = new BrowserWindow({
    title: config.title,

    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,

    autoHideMenuBar: config.menubar,
    frame: config.frame,

    icon: nativeImage.createFromPath(
      pathResolverAssets(
        `public/icons/${config.appIcon || (isPlatform("win32") ? "alternate" : "default")}.png`,
      ),
    ),

    webPreferences: {
      preload: pathResolver("preload.cjs"),
      partition: config.partition,
      nodeIntegration: config.nodeIntegration,
      contextIsolation: true,
      sandbox: false,
    },
  });

  state.manage(mainWindow);
  createTray(config, mainWindow);
  createMenu(mainWindow);

  if (isEnv("prod")) {
    // Overriding eval function from both global and window objects
    Object.defineProperty(global, "eval", {
      value: () => {
        throw new Error("Sorry, this app does not support window.eval().");
      },
      writable: false,
      configurable: false,
    });

    Object.defineProperty(mainWindow, "eval", {
      value: () => {
        throw new Error("Sorry, this app does not support window.eval().");
      },
      writable: false,
      configurable: false,
    });
  } else {
    mainWindow.webContents.openDevTools();
  }

  session.defaultSession.setDisplayMediaRequestHandler(
    (request, callback) => {
      desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
        // Grant access to the first screen found.
        callback({ video: sources[0], audio: "loopback" });
      });
    },
    { useSystemPicker: true },
  );

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

  registerListeners(mainWindow, config);

  handleCloseEvents(mainWindow, config.exitToTray);
  console.info("Window created successfully");
  return mainWindow;
}
