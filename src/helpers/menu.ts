import { app, Menu, BrowserWindow } from "electron";
import { isEnv } from "../lib/environment.js";
import { isPlatform } from "../lib/utils.js";

export function createMenu(mainWindow: BrowserWindow) {
  console.info("Creating menu");

  const menu = Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: isPlatform("darwin") ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "Quit",
            click: () => {
              console.debug("DEBUG: \n", "Menu:App:Quit pressed");
              app.quit();
            },
          },
          {
            label: "Dev Tools",
            click: () => {
              console.debug("DEBUG: \n", "Menu:App:Debug pressed");
              mainWindow.webContents.openDevTools();
            },
            visible: isEnv("dev"),
          },
        ],
      },
    ]),
  );

  console.info("Menu created successfully");
  return menu;
}
