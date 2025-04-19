import { app } from "electron";
import log, { LogLevel } from "electron-log";
import path from "path";
import { getEnv, isEnv } from "../lib/environment.js";
import { logLevelMapping } from "../schema/logLevel.js";

const maxDebugLogSize = 10; // in MB

export function logger(logLevel: LogLevel | undefined) {
  log.transports.file.level = logLevelMapping[getEnv()].file;
  log.transports.console.level = logLevel || logLevelMapping[getEnv()].console;

  // Disabling timestamps
  log.transports.console.format = "{text}";

  if (isEnv("debug")) {
    log.eventLogger.startLogging();

    log.transports.file.resolvePathFn = (_) => {
      return path.join(
        app.getPath("userData"),
        "debug",
        "logs",
        "main.debug.log",
      );
    };

    log.transports.file.maxSize = 1024 * 1024 * maxDebugLogSize;
  } else {
    log.transports.file.resolvePathFn = (_) => {
      return path.join(app.getPath("logs"), getTimeStamp(), "main.log");
    };
  }

  log.initialize();

  // Override console functions
  console.warn = log.warn;
  console.error = log.error;
  console.info = log.info;
  console.debug = log.debug;

  console.log(
    log.transports.file.level === false
      ? "File logging disabled"
      : `File logging at ${log.transports.file.getFile().path} with level ${log.transports.file.level}`,
  );

  console.log(
    log.transports.console.level === false
      ? "Console logging disabled"
      : `Console logging enabled with level ${log.transports.console.level}`,
  );

  console.log("LOGGER INITIALIZED \n\n");
}

// Format: YYYY-MM-DD_HH-MM-SS
function getTimeStamp(): string {
  const date = new Date();
  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_` +
    `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
  );
}
