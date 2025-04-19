import { LevelOption } from "electron-log";
import { Env } from "../lib/environment.js";

type EnvToLogLevelMapping = {
  [K in Env]: {
    file: LevelOption;
    console: LevelOption;
  };
};

// Environment to log level mapping
export const logLevelMapping: EnvToLogLevelMapping = {
  dev: {
    file: false,
    console: "warn",
  },
  prod: {
    file: "info",
    console: "warn",
  },
  test: {
    file: "debug",
    console: "info",
  },
  debug: {
    file: "debug",
    console: "info",
  },
};
