import { app, Menu, nativeImage, Tray } from "electron";
import { BrowserWindow } from "electron/main";
import { pathResolver } from "../lib/pathResolver.js";
import { isPlatform } from "../lib/utils.js";
import { ConfigType } from "../types/config.js";

export function createTray(config: ConfigType, mainWindow: BrowserWindow) {
  const icon =
    (config.trayIcon === "monochrome"
      ? `${config.trayIcon}Template`
      : config.trayIcon) ||
    (isPlatform("darwin")
      ? "monochromeTemplate"
      : isPlatform("win32")
        ? "alternate"
        : "default");

  console.info("Creating tray");

  const tray = new Tray(
    nativeImage.createFromPath(pathResolver(`assets/tray-icons/${icon}.png`)),
  );

  tray.on("click", () => {
    if (!mainWindow.isVisible()) {
      mainWindow.show();

      if (app.dock) app.dock.show();
    }
  });

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Quit", click: () => app.quit() },
      { type: "separator" },
      {
        label: "Show",
        click: () => {
          mainWindow.show();

          if (app.dock) app.dock.show();
        },
      },
    ]),
  );

  console.info("Tray created successfully");
  return tray;
}
