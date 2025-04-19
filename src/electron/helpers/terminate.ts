import { app } from "electron";
import { BrowserWindow } from "electron/main";
import { ConfigType } from "../types/config.js";

export function handleTerminate() {
  process.on("SIGTRAP", onTermiate);
  process.on("SIGINT", onTermiate);
  process.on("SIGTERM", onTermiate);
}

function onTermiate(signal: NodeJS.Signals) {
  if (signal === "SIGTERM") {
    process.abort();
  } else {
    app.quit();
  }
}

export function handleCloseEvents(
  window: BrowserWindow,
  exitToTray: ConfigType["exitToTray"],
) {
  if (!window || window.isDestroyed()) return;

  window.on("close", (event) => {
    if (exitToTray) {
      event.preventDefault();
      console.log("Minimizing to tray");
      if (app.dock) app.dock.hide();
      window.hide();
    } else {
      console.log("Quiting application");
      app.quit();
    }
  });

  app.on("before-quit", () => {
    console.info("Removing all listeners");
    window.removeAllListeners("close");
  });
}
