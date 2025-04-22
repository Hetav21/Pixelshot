import { app, nativeImage } from "electron";
import path from "node:path";
import { ConfigType } from "../types/config.js";
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

export function getAppIcon(config: ConfigType) {
  return nativeImage.createFromPath(
    pathResolverAssets(`public/icons/${config.appIcon || "default"}.png`),
  );
}
