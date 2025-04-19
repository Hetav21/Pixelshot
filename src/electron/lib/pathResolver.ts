import { app } from "electron";
import path from "node:path";
import { isEnv } from "./environment.js";

export function pathResolver(requiredPath: string) {
  return path.join(app.getAppPath(), isEnv("dev") ? "./" : "../", requiredPath);
}

export function pathResolverAssets(requiredPath: string) {
  return path.join(
    app.getAppPath(),
    isEnv("dev") ? "../../" : "../",
    requiredPath,
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), "../ui/index.html");
}
