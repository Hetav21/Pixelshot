# CLI Options

This document outlines the command-line options available for Pixelshot. You can view these options by running:

```bash
pixelshot --help
```

The application uses [yargs](https://www.npmjs.com/package/yargs) to handle command-line arguments.

## Available Options

| Option | Description | Default Value |
|--------|-------------|---------------|
| `appIcon` | Custom application window icon style | `undefined` (choices: `alternate`, `default`) |
| `clearCache` | Clear cached data before startup | `false` |
| `clearStorage` | Clear stored application data before startup | `false` |
| `customNotificationCommand`* | Custom command to show notifications | `"notify-send"` |
| `customScreenshotCommand`* | Custom command to take screenshots | `"grim"` |
| `deleteConfig` | Delete the existing configuration file | `false` |
| `disableGpu` | Disable GPU acceleration for rendering | `false` |
| `disableNotifications` | Disable notifications | `false` |
| `disableWaylandChecks`* | Disable automatic injection of switches for Wayland protocol | `false` |
| `electronCLIFlags` | Specify additional Electron CLI flags | `[]` |
| `enableExperimentalFeaturesWayland`* | Enable experimental features for Wayland display support | `false` |
| `exitToTray` | Minimize the app to the system tray instead of closing it | `true` |
| `frame` | Enable or disable the window frame | `true` |
| `logLevel` | Set the console logging level | `undefined` (choices: `debug`, `info`, `warn`, `error`) |
| `menubar` | Show or hide the application menu bar | `true` |
| `mode` | Define the app running mode | `"prod"` (choices: `debug`, `test`, `prod`) |
| `nodeIntegration` | Enable node integration | `false` |
| `partition` | Defines the session partition name for persistent storage | `"persist:pixelshot"` |
| `saveConfig` | Save current settings to the configuration file | `false` |
| `start` | Define the initial window state | `"maximized"` (choices: `minimized`, `maximized`, `tray`) |
| `title` | Sets the application window title | `"Pixelshot"` |
| `trayIcon` | Choose a custom system tray icon style | `undefined` (choices: `monochrome`, `alternate`, `default`) |
| `userData` | Define the path to store user data | `null` |
| `watchConfig` | Reload the app when the config file changes | `false` |

*\* Options only available on Linux platforms*

## Usage Examples

To run with specific options for the current session:

```bash
pixelshot --disableGpu --disableNotifications
```

To save the configuration for future use:

```bash
pixelshot --disableGpu --disableNotifications --saveConfig
```

To set a specific logging level:

```bash
pixelshot --logLevel=debug
```

To start the application minimized to the tray:

```bash
pixelshot --start=tray
```

## Configuration Notes

### Partition

The `partition` option ensures persistent session storage across application restarts. By default, it is set to `persist:pixelshot`.

```bash
pixelshot --partition=persist:my-custom-partition
```

If the `persist:` prefix is omitted, the application will not retain session data across restarts.

### Electron CLI Flags

You can pass additional Electron CLI flags using the `electronCLIFlags` option:

```bash
pixelshot --electronCLIFlags=disable-software-rasterizer --electronCLIFlags=ozone-platform=wayland
```

- Flags without values: `--electronCLIFlags=disable-software-rasterizer`
- Flags with values: `--electronCLIFlags=ozone-platform=wayland`

### Watch Config

When enabled, the application will automatically reload when changes are detected in the configuration file:

```bash
pixelshot --watchConfig
```

This is especially useful during development or when you frequently adjust application settings.
