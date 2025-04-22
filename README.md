# Pixelshot

Pixelshot is a cross-platform screenshot application built with Electron and React that allows users to capture screenshots at specified intervals and manage their screenshot collection.

## Index

1. [Download](#download)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Documentation](#documentation)
5. [Development](#development)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running in Development Mode](#running-in-development-mode)
   - [Building for Production](#building-for-production)
6. [Project Structure](#project-structure)
7. [CI/CD](#cicd)
8. [Acknowledgements](#acknowledgements)
9. [License](#license)

## Download

The latest version of Pixelshot is available to download from the [GitHub releases page](https://github.com/Hetav21/Pixelshot/releases).

## Features

- **User Authentication**: Secure local account system with username/password [Windows, macOS, Linux]
- **Session Management**: View and manage screenshots taken during specific sessions [Windows, macOS, Linux]
- **Auto Start on Boot**: Automatically launches on system startup [Windows, macOS]
- **Multiple Environments**: Support for dev, prod, debug, and test environments with appropriate configurations [Windows, macOS, Linux]
- **Custom Logger Implementation**: Configurable logging with different levels for file and console outputs [Windows, macOS, Linux]
- **CLI Support**: Comes with its own command-line interface for configuration and control [Windows, macOS, Linux]
- **Config File Support**: Persistent configuration through JSON files with auto-reload capabilities [Windows, macOS, Linux]
- **System Tray Support**: Minimize to system tray for background operation [Windows, macOS, Linux]
- **Notifications**: System notifications for each capture [Windows, macOS, Linux]
- **Automated Screenshots**: Take screenshots at user-defined intervals [Windows, macOS, Linux]
- **Folder Organization**: Automatically organize screenshots by date [Windows, macOS, Linux]
- **Image Gallery**: View all captured screenshots in a responsive grid layout [Windows, macOS, Linux]
- **Countdown Timer**: Visual countdown between captures [Windows, macOS, Linux]
- **Format Options**: Choose between PNG and JPEG formats [Windows, macOS, Linux]
- **Custom Destination**: Select where to save your screenshots [Windows, macOS, Linux]
- **Responsive Design**: Works well on various screen sizes [Windows, macOS, Linux]

## Tech Stack

- **TypeScript**: For type safety and improved developer experience
- **Electron**: Cross-platform desktop app framework
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Zod**: For Schema validation
- **React Router**: For Client-side routing
- **React Hook Form**: Form validation and handling
- **Electron Store**: Persistent storage
- **Electron Builder**: App packaging and distribution

## Documentation

Pixelshot includes comprehensive documentation to help users understand and maximize its capabilities:

- [CLI Documentation](docs/CLI.md) - Show Pixelshot's command-line interface functionality
- [Configuration Guide](docs/CONFIG.md) - Reference for all the application configuration options and file format specifications
- [Logging System](docs/LOGGING.md) - Detailed explanation of the logging system and instructions for generating debug logs for troubleshooting

## Development

### Prerequisites

- Node.js (v18+)
- npm (v8+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Hetav21/Pixelshot.git
cd Pixelshot

# Install dependencies
npm install
```

### Running in Development Mode

```bash
# Start the development server
npm run dev
```

### Building for Production

```bash
# Build for current platform
npm run build

# Build for all platforms
npm run build:all

# Build for specific platforms
npm run build:mac
npm run build:linux
npm run build:windows
```

## Project Structure

- `/src/electron`: Electron main process code
  - `/app`: Core application logic
  - `/electron-utils`: Electron-specific utilities
  - `/helpers`: Helper functions
  - `/lib`: Utility functions
  - `/schema`: Configuration schemas
  - `/types`: TypeScript type definitions
- `/src/ui`: React renderer process code
  - `/components`: UI components
  - `/pages`: Application pages
  - `/schema`: Validation schemas
  - `/hooks`: Custom React hooks
  - `/lib`: Utility functions
  - `/styles`: CSS styles

## CI/CD

This project uses GitHub Actions for continuous integration and deployment. The workflow builds the application for Windows, macOS, and Linux on every push to the main branch.

## Acknowledgements

- Icons used in the app are provided by [Icons8](https://icons8.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
