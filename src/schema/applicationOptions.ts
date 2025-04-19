import { Options } from "yargs";

// Configurable application options
const applicationOptionsSchema = {
  appIcon: {
    default: undefined,
    describe: "Choose a custom application window icon style.",
    choices: ["alternate", "default"],
    type: "string",
  },
  disableGpu: {
    default: false,
    describe: "Disable GPU acceleration for rendering.",
    type: "boolean",
  },
  electronCLIFlags: {
    default: [],
    describe: "Specify additional Electron CLI flags.",
    type: "array",
  },
  enableExperimentalFeaturesWayland: {
    default: false,
    describe: "Enable experimental features for Wayland display support.",
    type: "boolean",
  },
  exitToTray: {
    default: false,
    describe: "Minimize the app to the system tray instead of closing it.",
    type: "boolean",
  },
  frame: {
    default: true,
    describe: "Enable or disable the window frame.",
    type: "boolean",
  },
  menubar: {
    default: true,
    describe: "Show or hide the application menu bar.",
    type: "boolean",
  },
  partition: {
    default: "persist:pixelshot",
    describe: "Defines the session partition name for persistent storage.",
    type: "string",
  },
  start: {
    default: "maximized",
    describe: "Define the initial window state.",
    choices: ["minimized", "maximized", "tray"],
    type: "string",
  },
  title: {
    default: "Pixelshot",
    describe: "Sets the application window title.",
    type: "string",
  },
  trayIcon: {
    default: undefined,
    describe: "Choose a custom system tray icon style.",
    choices: ["monochrome", "alternate", "default"],
    type: "string",
  },
  userAgent: {
    default: `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36`,
    describe: "Override the default user agent string.",
    type: "string",
  },
  watchConfig: {
    default: true,
    describe: "Reload the app when the config file changes.",
    type: "boolean",
  },
} satisfies { [key: string]: Options };

export default applicationOptionsSchema;
