# Configuration File Options

This document outlines the options available for the Pixelshot configuration file (`config.json`). The configuration file is used to store persistent application settings.

## Configuration File Location

The configuration file location depends on your operating system:

### Windows
```
%APPDATA%\pixelshot\config.json
```

### macOS
```
~/Library/Application Support/pixelshot/config.json
```

### Linux
```
~/.config/pixelshot/config.json
```

## Available Options

| Option | Description | Default Value |
|--------|-------------|---------------|
| `appIcon` | Custom application window icon style | `undefined` (choices: `alternate`, `default`) |
| `customNotificationCommand`* | Custom command to show notifications | `"notify-send"` |
| `customScreenshotCommand`* | Custom command to take screenshots | `"grim"` |
| `disableGpu` | Disable GPU acceleration for rendering | `false` |
| `disableNotifications` | Disable notifications | `false` |
| `disableWaylandChecks`* | Disable automatic injection of switches in case wayland protocol is detected | `false` |
| `electronCLIFlags` | Specify additional Electron CLI flags | `[]` |
| `enableExperimentalFeaturesWayland`* | Enable experimental features for Wayland display support | `false` |
| `exitToTray` | Minimize the app to the system tray instead of closing it | `true` |
| `frame` | Enable or disable the window frame | `true` |
| `menubar` | Show or hide the application menu bar | `true` |
| `partition` | Defines the session partition name for persistent storage | `"persist:pixelshot"` |
| `start` | Define the initial window state | `"maximized"` (choices: `minimized`, `maximized`, `tray`) |
| `title` | Sets the application window title | `"Pixelshot"` |
| `trayIcon` | Choose a custom system tray icon style | `undefined` (choices: `monochrome`, `alternate`, `default`) |
| `watchConfig` | Reload the app when the config file changes | `false` |

*\* Options only available on Linux platforms*

## Configuration Example

```json
{
  "appIcon": "default",
  "disableGpu": true,
  "disableNotifications": false,
  "exitToTray": true,
  "menubar": false,
  "start": "minimized",
  "trayIcon": "default",
  "watchConfig": true
}
```

## Special Configuration Options

### Partition

The `partition` setting ensures persistent session storage across application restarts. By default, it is set to `persist:pixelshot`. If the `persist:` prefix is omitted, the application will not retain session data across restarts.

```json
{
  "partition": "persist:my-custom-partition"
}
```

### Custom Commands (Linux only)

On Linux, you can specify custom commands for notifications and screenshots:

```json
{
  "customNotificationCommand": "notify-send",
  "customScreenshotCommand": "grim"
}
```

The notification command runs as: `<command> <notification-title> <notification-body>`
The screenshot command runs as: `<command> <screenshot-file>`

### Electron CLI Flags

You can include additional Electron CLI flags in the configuration:

```json
{
  "electronCLIFlags": [
    ["ozone-platform", "wayland"],
    "disable-software-rasterizer"
  ]
}
```

- Flags with values must be arrays where the first entry is the switch, and the second is its value
- Flags without values can be simple strings

### Watch Config

When `watchConfig` is enabled, the application will automatically reload when changes are detected in the configuration file:

```json
{
  "watchConfig": true
}
```

## Saving Configuration Changes

To save the current configuration settings to the file from the command line:

```bash
pixelshot --saveConfig
```
