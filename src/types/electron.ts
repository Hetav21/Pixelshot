// Switches supported by Electron:
// https://www.electronjs.org/docs/latest/api/command-line-switches
// Chromium command-line switches:
// https://peter.sh/experiments/chromium-command-line-switches/
const _SWITCH = [
  "try-supported-channel-layouts",
  "use-native-audio-output",
  "disable-features",
  "enable-features",
  "disable-gpu",
  "disable-gpu-compositing",
  "disable-software-rasterizer",
  "enable-gpu-rasterization",
  "ozone-platform",
  "enable-wayland-ime",
] as const;

export type Switch = (typeof _SWITCH)[number];

// Events emitted by the application
const _EVENT = ["config-file-changed"] as const;

export type Event = (typeof _EVENT)[number];
