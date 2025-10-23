# Job Search Management App

## Overview
This is a React-based job search management application that helps users track and manage their job applications. The app features a modern UI built with React, Tailwind CSS v4, and shadcn/ui components.

## Project Architecture

### Tech Stack
- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.4.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (pre-compiled)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Additional Features**: 
  - PDF export functionality (html2canvas, jspdf)
  - Calendar/date picker (react-day-picker)
  - Charts (recharts)
  - Theming (next-themes)
  - Form handling (react-hook-form)

### Project Structure
```
src/
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── figma/         # Figma-imported components
│   └── *.tsx          # Application components
├── context/           # React context providers
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── styles/            # Global styles
└── docs/              # Documentation
```

### Key Features
- Job application tracking dashboard
- Calendar view for interviews/deadlines
- User profile management
- Billing/subscription view
- Speed Apply functionality
- Workday integration
- PDF export capabilities
- Dark/light theme support
- Notifications system

## Development

### Running Locally
The app runs on port 5000 with Vite's development server:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Configuration
- **Vite Config**: Configured to run on host 0.0.0.0:5000 for Replit compatibility
- **HMR**: Hot Module Replacement enabled with clientPort 443 for proxy support
- **Build Output**: `build/` directory

## Recent Changes
- October 23, 2025: Initial Replit setup
  - Configured Vite to use port 5000 with host 0.0.0.0
  - Added .gitignore for Node.js projects
  - Installed TypeScript dependency
  - Set up workflow for development server

## Notes
- The application uses pre-compiled Tailwind CSS (no build step required for styles)
- All dependencies are already configured in package.json
- The app is designed to work seamlessly in the Replit environment with proper proxy configuration
