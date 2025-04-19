import { LogLevel } from "electron-log";
import { Options } from "yargs";
import { Env } from "../lib/environment.js";

// Startup options (not saved in the config file)
const startUpOptionsSchema = {
  clearCache: {
    default: false,
    describe: "Clear cached data before startup.",
    type: "boolean",
  },
  clearStorage: {
    default: false,
    describe: "Clear stored application data before startup.",
    type: "boolean",
  },
  contextIsolation: {
    default: true,
    describe: "Enable context isolation for security (Do not change).",
    type: "boolean",
  },
  deleteConfig: {
    default: false,
    describe: "Delete the existing configuration file.",
    type: "boolean",
  },
  logLevel: {
    default: undefined,
    describe: "Set the console logging level.",
    choices: ["debug", "info", "warn", "error"] satisfies LogLevel[],
    type: "string",
  },
  mode: {
    default: "prod",
    describe: "Define the app running mode.",
    choices: ["debug", "test", "prod"] satisfies Env[],
    type: "string",
  },
  sandbox: {
    default: true,
    describe: "Enable sandboxing for security (Do not change).",
    type: "boolean",
  },
  saveConfig: {
    default: false,
    describe: "Save current settings to the configuration file.",
    type: "boolean",
  },
  userData: {
    default: null,
    describe: "Define the path to store user data.",
    type: "string",
  },
} satisfies { [key: string]: Options };

export default startUpOptionsSchema;
