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
- [VSCode](https://code.visualstudio.com/) + [Biome](https://biomejs.dev/)

### Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Code Formatting & Linting (Biome)
```bash
# Format and fix code
npm run format

# Run linter
npm run lint
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
