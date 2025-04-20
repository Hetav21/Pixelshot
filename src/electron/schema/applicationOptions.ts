import { Options } from "yargs";
import { isPlatform } from "../lib/utils.js";

// Configurable application options
const applicationOptionsSchema = {
  appIcon: {
    default: undefined,
    describe: "Choose a custom application window icon style",
    choices: ["alternate", "default"],
    type: "string",
  },
  customNotificationCommand: {
    default: "notify-send",
    describe:
      "Custom command to show notifications. It will run as: <command> <notification-title> <notification-body>",
    type: "string",
    hidden: !isPlatform("linux"),
  },
  customScreenshotCommand: {
    default: "grim",
    describe:
      "Custom command to take screenshots. It will run as: <command> <screenshot-file>",
    type: "string",
    hidden: !isPlatform("linux"),
  },
  disableGpu: {
    default: false,
    describe: "Disable GPU acceleration for rendering",
    type: "boolean",
  },
  disableNotifications: {
    default: false,
    describe: "Disable notifications",
    type: "boolean",
  },
  disableWaylandChecks: {
    default: false,
    describe:
      "Disable automatic injection of switches in case wayland protocol is detected",
    type: "boolean",
    hidden: !isPlatform("linux"),
  },
  electronCLIFlags: {
    default: [],
    describe: "Specify additional Electron CLI flags",
    type: "array",
  },
  enableExperimentalFeaturesWayland: {
    default: false,
    describe: "Enable experimental features for Wayland display support",
    type: "boolean",
    hidden: !isPlatform("linux"),
  },
  exitToTray: {
    default: false,
    describe: "Minimize the app to the system tray instead of closing it",
    type: "boolean",
  },
  frame: {
    default: true,
    describe: "Enable or disable the window frame",
    type: "boolean",
  },
  menubar: {
    default: true,
    describe: "Show or hide the application menu bar",
    type: "boolean",
  },
  partition: {
    default: "persist:pixelshot",
    describe: "Defines the session partition name for persistent storage",
    type: "string",
  },
  start: {
    default: "maximized",
    describe: "Define the initial window state",
    choices: ["minimized", "maximized", "tray"],
    type: "string",
  },
  title: {
    default: "Pixelshot",
    describe: "Sets the application window title",
    type: "string",
  },
  trayIcon: {
    default: undefined,
    describe: "Choose a custom system tray icon style",
    choices: ["monochrome", "alternate", "default"],
    type: "string",
  },
  watchConfig: {
    default: true,
    describe: "Reload the app when the config file changes",
    type: "boolean",
  },
} satisfies { [key: string]: Options };

export default applicationOptionsSchema;
