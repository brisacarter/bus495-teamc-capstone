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
- **Job Application Tracking** - Dashboard with clickable filter cards
- **Speed Apply** - Bulk application system with progress tracking
- **Workday Integration** - Special handling for Workday applications
- **Interview Prep** - AI-powered interview preparation (TechCorp jobs)
- **Live Coach** - Real-time coaching features
- **Calendar View** - Track interviews and deadlines
- **Notifications Drawer** - Accessible from anywhere via side drawer
- **User Profile Management** - Complete profile and settings
- **Billing/Subscription** - Manage subscription and credits
- **PDF Export** - Export job data and screens to PDF
- **Dark/Light Theme** - Full theme support

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

### October 26, 2025: CRITICAL FIXES - Multiple UI Improvements

#### Speed Apply Modal Animation & Completion
- **FIXED: Progress calculation and completion state**
  - Progress now correctly shows "1 of 2 jobs, 0%" → "2 of 2 jobs, 50%" → "2 of 2 jobs, 100%"
  - Animation stops immediately at 100% completion
  - Added safety checks to prevent animation continuing past completion
  - Enhanced completion message: "✓ Applications Successfully Submitted!" with green styling
  - All checklist items show green checkmarks when complete
  - Progress formula fixed: completedJobs = isComplete ? jobs.length : currentJobIndex

#### Interview Prep Progress Circle
- **FIXED: Circle rendering and colors**
  - Unfilled portion: Light gray (#E5E7EB) - NO MORE DARK FILL
  - Filled portion: Gradient orange #FF8C42 → yellow #FFD93D → green #6BCF7F
  - Score number: Bold, green #6BCF7F (larger text-4xl)
  - "/100": Gray #6B7280
  - Improvement text: Green #6BCF7F with font-semibold
  - "Since last session": Gray #6B7280

#### AI Mock Interview Dark Theme
- **FIXED: Dark Navy Theme Applied with Inline Styles**
  - **Issue**: shadcn Card component's `bg-card` CSS variable was overriding Tailwind classes
  - **Solution**: Applied inline styles to force dark navy theme colors
  - **Colors Applied**:
    - Main background: `#2C3E50` (dark navy blue)
    - Header: `#1A242F` (very dark navy)
    - All three cards (AI Interviewer, Your Video, Interview Stages): `#334155` (slate blue)
    - Card borders: `#475569`
    - Question box: `#475569`
    - Webcam preview: `#1E293B`
    - Inactive stage items: `#475569` background, `#64748B` borders
    - Buttons: `#475569` background with `#64748B` borders
    - Text: Light colors (slate-300, white) for contrast
  - **Result**: AI Mock Interview now displays correct dark navy theme matching Figma design exactly

### October 25, 2025: Figma Design Alignment (DEPRECATED - See Oct 26 fix above)
- **AI Mock Interview Styling**: Attempted dark theme with Tailwind classes (did not work)
  - Issue: Card component's default background overrode Tailwind classes
  - Fixed with inline styles on October 26
- **Design Verification**: Confirmed all other screens match Figma specifications
  - Dashboard: Light gray background with proper stat cards and job cards
  - Interview Prep Dashboard: Blue gradient banner, white button, progress circle, tip cards
  - Interview Results: Green gradient score card, colored metric cards with progress bars
  - Profile & Billing: Standard shadcn/ui component styling
- **Color Palette**: AI Mock Interview now uses consistent `#1C2432` / `#2A3744` theme

### October 24, 2025: Major Feature Integration (v3)
- **Interview Prep Feature**: New interview preparation screen with AI coaching
  - Conditional "Start Interview Prep" button on TechCorp Senior Software Engineer jobs
  - Credit-based system with upgrade modal
  - Mic icon in navigation
- **Live Coach Feature**: New live coaching screen for real-time guidance
  - Users icon in navigation
  - Real-time coaching interface
- **Speed Apply Fix**: Fixed progress calculation bug
  - Now correctly shows "1 of 2 jobs, 0%" → "2 of 2 jobs, 100%"
  - Stops at 100% and shows success message
  - User manually closes with "Done" button
  - Dashboard stats update immediately
- **Apply Button Enhancement**: Disabled for applied/interviewing jobs
  - Button text changes to "Applied" when disabled
  - Prevents duplicate applications

### October 23, 2025: Initial Replit Setup
- Configured Vite to use port 5000 with host 0.0.0.0
- Added `allowedHosts: true` to allow Replit proxy hosts
- Added .gitignore for Node.js projects
- Installed TypeScript dependency
- Set up workflow for development server
- Configured deployment settings for production

## User Workflow

### Application Management
1. **Add Jobs**: Click "+" to add new job leads
2. **Filter by Status**: Click stat cards to filter (All, Saved, Applied, etc.)
3. **Speed Apply**: Bulk apply to multiple jobs with AI automation
4. **Workday Integration**: Special workflow for InnovateLabs jobs
5. **Interview Prep**: Start AI-powered prep for TechCorp interviews
6. **Track Progress**: Monitor all applications from dashboard

### Interview Preparation (TechCorp Jobs)
1. Job must be "TechCorp" with title "Senior Software Engineer"
2. Job status must be "interviewing"
3. Click "Start Interview Prep" button
4. If no credits: Upgrade modal appears → redirects to billing
5. If has credits: Navigate to Interview Prep screen

### Notifications
- Access via Bell icon in sidebar (desktop) or header (mobile)
- Slide-out drawer opens from right
- Shows unread count badge
- Mark as read/unread
- Manage notification preferences

## Technical Notes

### Speed Apply System
- Uses `bulkApplyToJobs` context function
- Progress tracks: "X of Y jobs, Z%"
- Simulates multi-step process per job:
  1. Format resume for ATS
  2. Auto-fill form fields
  3. Upload resume
  4. Submit application
  5. Send message to hiring manager
- Updates job status to "applied" on completion

### Workday Integration
- Detected by: `company === 'InnovateLabs' && !canApplyInApp`
- Blue branding (#3E6BAF) with Building2 icon
- Separate modal workflow
- Matches Workday brand colors

### Interview Prep Credits
- Stored in `user.interviewPrepCredits`
- Required to access Interview Prep feature
- Can be purchased via Billing screen
- Credit check before navigation

## Notes
- The application uses pre-compiled Tailwind CSS (no build step required for styles)
- All dependencies are configured in package.json
- The app is designed to work seamlessly in the Replit environment with proper proxy configuration
- HMR (Hot Module Replacement) is configured for the Replit proxy with clientPort 443
