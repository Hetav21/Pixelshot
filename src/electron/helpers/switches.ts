import { app } from "electron";
import {
  appCommandLineAppendSwitch,
  appCommandLineGetSwitchValue,
  appCommandLineHasSwitch,
} from "../electron-utils/app.js";
import { ConfigType } from "../types/config.js";

export function handleDefaultSwitches(config: ConfigType) {
  // Ensures Electron tries supported audio channel layouts for better compatibility
  appCommandLineAppendSwitch("try-supported-channel-layouts");

  // Disabling features
  // const featuresToDisable = new Set(
  //   appCommandLineHasSwitch("disable-features")
  //     ? appCommandLineGetSwitchValue("disable-features").split(",")
  //     : [],
  // );

  // appCommandLineAppendSwitch(
  //   "disable-features",
  //   Array.from(featuresToDisable).join(","),
  // );

  // console.debug(
  //   "DEBUG:\n",
  //   "disable-features: \n",
  //   Array.from(featuresToDisable).join(","),
  // );

  if (process.env.XDG_SESSION_TYPE === "wayland") handleWayland(config);

  // Disable GPU rendering if specified in the config
  if (config.disableGpu) {
    console.warn("Disabling GPU support");

    appCommandLineAppendSwitch("disable-gpu"); // Disables GPU hardware acceleration
    appCommandLineAppendSwitch("disable-gpu-compositing"); // Prevents GPU-based compositing
    appCommandLineAppendSwitch("disable-software-rasterizer"); // Ensures no GPU-based rasterization fallback
    app.disableHardwareAcceleration(); // Disables all hardware-accelerated rendering
  }

  // Apply Electron CLI flags
  if (Array.isArray(config.electronCLIFlags)) {
    for (const flag of config.electronCLIFlags) {
      if (typeof flag === "string") {
        console.debug(`Adding electron CLI flag: '${flag}'`);
        app.commandLine.appendSwitch(flag);
      } else if (Array.isArray(flag) && typeof flag[0] === "string") {
        if (
          typeof flag[1] !== "undefined" &&
          typeof flag[1] !== "object" &&
          typeof flag[1] !== "function"
        ) {
          console.debug(
            `Adding electron CLI flag: '${flag[0]}' with value '${flag[1]}'`,
          );
          app.commandLine.appendSwitch(flag[0], flag[1]);
        } else {
          console.debug(`Adding electron CLI flag: '${flag[0]}'`);
          app.commandLine.appendSwitch(flag[0]);
        }
      }
    }
  }
}

function handleWayland(config: ConfigType) {
  console.warn("Running under Wayland, using additional switches...");

  // Set the Ozone platform to Wayland (required for Electron on Wayland)
  appCommandLineAppendSwitch("ozone-platform", "wayland");

  // Enabling additional features for Wayland support
  const featuresToEnable = new Set(
    appCommandLineHasSwitch("enable-features")
      ? appCommandLineGetSwitchValue("enable-features").split(",")
      : [],
  );
  featuresToEnable.add("UseOzonePlatform"); // Enables Chromium's Ozone platform for Wayland support

  appCommandLineAppendSwitch(
    "enable-features",
    Array.from(featuresToEnable).join(","),
  );

  console.debug(
    "DEBUG: \n ",
    "enable-features: \n",
    Array.from(featuresToEnable).join(","),
  );

  if (config.enableExperimentalFeaturesWayland) {
    appCommandLineAppendSwitch("enable-wayland-ime"); // Enables Input Method Editor support for Wayland
    appCommandLineAppendSwitch("enable-gpu-rasterization"); // Uses GPU for rasterization, improving rendering performance
  }
}
