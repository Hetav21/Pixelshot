import { app, BrowserWindow } from "electron";
import { LogLevel } from "electron-log";
import path from "path";
import { ipcMainOn } from "./electron-utils/ipc.js";
import { loadConfig } from "./helpers/config.js";
import { logger } from "./helpers/logger.js";
import { getAppReady } from "./helpers/ready.js";
import { getStartUpConfigFromCommandLine } from "./helpers/startUpConfig.js";
import { handleDefaultSwitches } from "./helpers/switches.js";
import { isEnv, setEnv } from "./lib/environment.js";

const startUpConfig = getStartUpConfigFromCommandLine();

if (startUpConfig.mode === "debug") {
  console.log("DEBUG MODE ENABLED");
  console.log("app version: ", app.getVersion());
  setEnv("debug");
} else if (startUpConfig.mode === "test") {
  console.log("TEST MODE ENABLED");
  console.debug = function () {};
  setEnv("test");
} else {
  if (isEnv("dev")) console.log("DEV MODE ENABLED");
  console.info = function () {};
  console.debug = function () {};
}

if (startUpConfig.userData) {
  console.info("Setting User Data to Path:", startUpConfig.userData);

  try {
    app.setPath("userData", startUpConfig.userData);
  } catch (err) {
    console.warn("Failed setting userData path");
    console.info("ERROR: ", err);
    console.warn("Using default userData path: ", app.getPath("userData"));
  }
}

console.log("USER DATA PATH:", app.getPath("userData"));
if (isEnv("debug"))
  console.debug(
    `DEBUG DATA PATH: ${path.join(app.getPath("userData"), "debug")}`,
  );

logger((startUpConfig.logLevel as LogLevel) || undefined);

console.debug("DEBUG: \n", "startUpConfig: \n", startUpConfig);

const config = loadConfig(startUpConfig);
let mainWindow: BrowserWindow;

if (!app.requestSingleInstanceLock()) {
  console.warn("Another instance of the app is already running");
  console.warn("Quitting the app");
  app.quit();
} else {
  handleDefaultSwitches(config);

  app.whenReady().then(async () => {
    console.info("Lock ackquired, starting the app");
    mainWindow = await getAppReady(config);
  });

  app.on("second-instance", () => {
    console.warn("A second instance was attempted to start.");
    if (mainWindow) {
      if (!mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });

  ipcMainOn("config-file-changed", () => {
    console.info("Config file changed, reloading app");
    app.relaunch();
    app.quit();
  });
}
