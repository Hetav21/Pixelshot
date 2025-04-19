import { app } from "electron";
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ipcMainEmit } from "../electron-utils/ipcMain.js";
import { isEnv } from "../lib/environment.js";
import { deleteFile, saveFile } from "../lib/filesystem.js";
import applicationOptionsSchema from "../schema/applicationOptions.js";
import startUpOptionsSchema from "../schema/startUpOptions.js";
import type { ConfigType } from "../types/config.js";

const configFileName = "config.json";
const debugConfigFileName = "config.debug.json";

export function loadConfig(startUpConfig: ConfigType) {
  const configFilePath = path.join(app.getPath("userData"), configFileName);

  if (startUpConfig.deleteConfig) deleteFile(configFilePath);

  const configFromFile = getConfigFromFile(configFilePath);

  // Combines config from file and commandline
  const config = createConfig(configFromFile);

  if (config.saveConfig || !config.configFileExists) {
    saveFile(sanitizeConfig(config), configFilePath);
    config.configFileExists = true;
  }

  if (isEnv("debug")) {
    const debugConfigFilePath = path.join(
      app.getPath("userData"),
      "debug",
      debugConfigFileName,
    );

    console.debug("Creating debug config file");
    console.debug("DEBUG: \n", "config: \n", config);
    // Deleting config file if there already exists
    deleteFile(debugConfigFilePath);
    saveFile(config, debugConfigFilePath);
    console.debug("Debug config file created");
  }

  // Reloads the application on changes in config file
  if (config.configFileExists && config.watchConfig) watchChanges();

  return { ...config };
}

function createConfig<T extends object>(configFromFile: Partial<T>): T {
  const config = yargs(hideBin(process.argv))
    .config(configFromFile)
    .env(isEnv("dev", "debug") ? true : false)
    .options({
      ...applicationOptionsSchema,
      ...startUpOptionsSchema,
    })
    .parserConfiguration({
      "combine-arrays": true,
      "strip-aliased": true,
      "strip-dashed": true,
    })
    .parse();

  return config as T;
}

function getConfigFromFile(configFilePath: string): Partial<ConfigType> {
  // Checking if config file exists at the given path
  if (fs.existsSync(configFilePath)) {
    console.info("Loading config from file");

    try {
      // Reading config file
      const configFromFile = fs.readFileSync(configFilePath, "utf8");
      console.debug("DEBUG: \n", "configFromFile: \n", configFromFile);
      const parsedConfig = JSON.parse(configFromFile);

      if (parsedConfig) return { ...parsedConfig, configFileExists: true };
      else {
        console.warn(`Config not found at ${configFilePath}`);
        console.debug("DEBUG: \n", "parsedConfig: \n", parsedConfig);
      }
    } catch (err) {
      console.warn("Failed loading config");
      console.warn("Using default values");
      console.info("ERROR: \n", err);

      const error =
        err instanceof Error ? err.message : "Unknown error occurred";

      // Deleting config file in case of syntax error
      // and user has requested to delete the file
      if ((err as Error).name && (err as Error).name === "SyntaxError") {
        console.warn("Syntax Error in config file");
      }

      return {
        error,
        configFileExists: true,
      };
    }
  } else {
    console.warn("No config file found at ", configFilePath);
    console.warn("Creating a config file");
  }

  return { configFileExists: false };
}

function watchChanges() {
  // Watching for changes in config file
  try {
    fs.watch(
      path.join(app.getPath("userData"), configFileName),
      (event, filename) => {
        console.debug(
          "DEBUG: \n",
          "event: \n",
          event,
          "filename: \n",
          filename,
        );

        // Emitting event
        // Reloads the application
        // upon changes
        ipcMainEmit("config-file-changed");
      },
    );
  } catch (err) {
    console.warn("Failed watching config file");
    console.info("ERROR: ", err);
  }
}

function sanitizeConfig(config: ConfigType) {
  // Removing alien keys and keys of startUpOptionsSchema
  // also sorting the keys alphabetically
  const allowedKeys = new Set([...Object.keys(applicationOptionsSchema)]);

  const sanitizedConfig: Partial<ConfigType> = Object.fromEntries(
    Object.entries(config)
      .filter(([key]) => allowedKeys.has(key))
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  );

  // Further removing keys
  const keysToRemove: (keyof ConfigType)[] = ["configFileExists"];

  for (const key of keysToRemove) {
    delete sanitizedConfig[key];
  }

  console.debug("DEBUG: \n", "sanitizedConfig: \n", sanitizedConfig);

  return sanitizedConfig;
}
