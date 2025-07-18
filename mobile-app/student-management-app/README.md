# Student Management App

A React Native mobile application for student management built with Expo and TypeScript.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the App

To start the development server:
```bash
npm start
```

This will open the Expo development tools in your browser. From there you can:
- Press 'a' to open Android emulator
- Press 'i' to open iOS simulator
- Scan the QR code with your phone (requires Expo Go app)

## Development

The project structure is organized as follows:

```
src/
  ├── api/          # API services and network calls
  ├── components/   # React Native components
  ├── types/       # TypeScript type definitions
  └── assets/      # Images and other static assets
```

## Features

- Student profile display
- Real-time data synchronization
- Cross-platform support (iOS & Android)
- TypeScript for better type safety 