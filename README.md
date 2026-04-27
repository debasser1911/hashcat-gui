# Hashcat GUI

A modern, interactive, and user-friendly GUI wrapper for the popular Hashcat password recovery tool, built with Electron, React, and TypeScript.

## Features

- **Interactive Terminal Emulator**: Uses `node-pty` to provide full standard interaction with Hashcat, including real-time Status (s), Pause (p), Resume (r), Bypass (b), Checkpoint (c), and Quit (q) commands.
- **Smart Log Parser**: Intelligently colorizes and parses the terminal output from Hashcat to display warnings, errors, progress, speed, and recovered passwords with a clean, readable UI.
- **Easy Attack Configuration**: Supports multiple attack modes:
  - **Dictionary Attack**: Easily select your `.txt` wordlists and rules.
  - **Mask Attack (Brute-force)**: Visual builder to quickly craft masks (e.g., `?a?a?a?a`) with built-in presets.
- **Persistent State**: Remembers your configured directories and recent settings using local storage.
- **Auto-Detection**: Automatically detects hash types from file extensions (e.g., `.hc22000`, `.hccapx`).

## Tech Stack

- **Framework**: Electron (via electron-vite)
- **Frontend**: React 18, TypeScript
- **Styling**: Vanilla CSS (Glassmorphism design)
- **Terminal Backend**: `node-pty`

## Development

### Recommended IDE Setup
- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

*(Note: Since this project relies on `node-pty`, native compilation tools like `node-gyp` and Python/C++ build tools may be required depending on your OS)*

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

## Copyright & License
&copy; Hashcat GUI Open Source Project. Created by Andrii Istomin.
This project is an independent GUI wrapper and is not officially affiliated with the core Hashcat project.
