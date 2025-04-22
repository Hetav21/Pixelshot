# Logging System

Pixelshot uses a structured logging system based on [electron-log](https://www.npmjs.com/package/electron-log) that adapts logging behavior based on the application environment. This document outlines how logging works across different environments and provides guidance for effective debugging.

## Environment Log Levels

The application supports four distinct environments (which can be set using `--mode`), each with its own logging configuration:

| Environment | File Logging | Console Logging | Description |
|-------------|-------------|-----------------|-------------|
| `dev`       | Disabled    | `warn`          | Development environment with minimal logging |
| `prod`      | `info`      | `warn`          | Production environment with standard logging |
| `test`      | `debug`     | `info`          | Testing environment with detailed logging |
| `debug`     | `debug`     | `info`          | Debugging environment with maximum detail |

## Running in Debug Mode

To run the application in debug mode and generate detailed logs:

```bash
pixelshot --mode=debug
```

You can also override the log level for any environment:

```bash
pixelshot --logLevel=debug
```

**IMPORTANT**: Debug mode (`--mode=debug`) is distinct from debug log level (`--logLevel=debug`). The former enables comprehensive diagnostic features, while the latter only adjusts the verbosity of logs.

## Log File Locations

Log files are stored in different locations depending on the environment and operating system:

### Windows
- **Debug Mode**: `%APPDATA%\pixelshot\debug\logs\main.debug.log`
- **Other Environments**: `%APPDATA%\pixelshot\logs\<timestamp>\main.log`

### macOS
- **Debug Mode**: `~/Library/Application Support/pixelshot/debug/logs/main.debug.log`
- **Other Environments**: `~/Library/Application Support/pixelshot/logs/<timestamp>/main.log`

### Linux
- **Debug Mode**: `~/.config/pixelshot/debug/logs/main.debug.log`
- **Other Environments**: `~/.config/pixelshot/logs/<timestamp>/main.log`

Where `<timestamp>` follows the format: `YYYY-MM-DD_HH-MM-SS`

## Debugging Configuration

When running in debug mode, the application automatically creates a special debug configuration file:

```
<userData>/debug/config.debug.json
```

This file contains the complete application configuration with all settings and their default values, providing a valuable reference for troubleshooting configuration-related issues.
