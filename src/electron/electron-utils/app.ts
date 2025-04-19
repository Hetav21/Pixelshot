import { app } from "electron";
import type { Switch } from "../types/electron.js";

export function appCommandLineHasSwitch(switchName: Switch) {
  return app.commandLine.hasSwitch(switchName);
}

export function appCommandLineGetSwitchValue(switchName: Switch) {
  return app.commandLine.getSwitchValue(switchName);
}

export function appCommandLineAppendSwitch(switchName: Switch, value?: string) {
  app.commandLine.appendSwitch(switchName, value);
}
