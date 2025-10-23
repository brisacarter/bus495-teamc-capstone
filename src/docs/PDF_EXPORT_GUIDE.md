# PDF Export Guide

## Overview

The JobTracker application now includes a comprehensive PDF export feature that allows you to save your job search data and application screens for your records or to share with career advisors.

## Features

### 1. **Data Report Export**
Exports a comprehensive text-based report containing:
- User profile information
- Job application statistics (saved, applied, interviewing, offers, rejections)
- Interview summary (upcoming and past interviews)
- Detailed job application information (title, company, status, notes, dates)
- Detailed interview information (date, type, duration, interviewers, notes)

**Best for:** Data portability, sharing with career advisors, keeping offline records

### 2. **All Screens Export (Screenshots)**
Captures screenshots of all main application screens:
- Dashboard
- Calendar
- Notifications
- Profile
- Billing

**Best for:** Creating a visual portfolio of your job search process, presentations

### 3. **Current View Export**
Quickly exports a screenshot of the current screen you're viewing.

**Best for:** Quick exports, specific screen captures

## How to Use

### Access PDF Export

You can access the PDF export feature in two ways:

1. **From the Dashboard:**
   - Click the "Export to PDF" button in the top right corner of the Dashboard

2. **From Profile Settings:**
   - Navigate to Profile → Account tab
   - Scroll to the "Export Data" section
   - Click "Export to PDF"

### Export Process

1. Click "Export to PDF" button
2. Choose your export type:
   - **Data Report** (Recommended for most use cases)
   - **All Screens** (Takes longer, creates visual record)
   - **Current View** (Quick export)
3. Click "Export PDF"
4. Wait for the export to complete (progress bar shows status)
5. PDF will automatically download to your default downloads folder

### File Naming

- **Data Report:** `jobtracker-data-report-YYYY-MM-DD.pdf`
- **All Screens:** `jobtracker-export-YYYY-MM-DD.pdf`
- **Current View:** `jobtracker-current-view.pdf`

## Technical Details

### Libraries Used
- **jsPDF**: PDF generation library
- **html2canvas**: Screenshot capture library

### Export Quality
- Screenshots are captured at 2x scale for high quality
- PDF format is A4 for data reports, dynamic sizing for screenshots
- All PDFs include metadata (title, author, date)

### Performance Notes
- **Data Report:** ~1-2 seconds
- **All Screens:** ~5-10 seconds (depends on data volume)
- **Current View:** ~1-2 seconds

### Privacy & Security
- All exports are generated client-side in your browser
- No data is sent to external servers
- PDF files are saved directly to your device

## Tips

1. **Before Exporting All Screens:**
   - Ensure you have data in each section for better results
   - Close any open dialogs or modals
   - Wait for the export to complete (don't navigate away)

2. **For Best Results:**
   - Use Data Report for sharing with career advisors
   - Use All Screens when you need visual documentation
   - Export regularly to maintain offline records

3. **Large Data Sets:**
   - If you have many job applications (50+), the Data Report will be multiple pages
   - Consider filtering before exporting if you only need specific data

## Troubleshooting

### Export Not Working?
- Check browser console for errors
- Ensure pop-up blocker isn't blocking downloads
- Try refreshing the page and attempting again

### PDF Quality Issues?
- All Screens export captures at 2x resolution
- Ensure your screen zoom is at 100%
- Close any overlays before exporting

### Large File Sizes?
- Screenshots naturally create larger files
- Data Reports are smaller and more efficient
- Consider exporting individual screens if needed

## Future Enhancements

Potential future features:
- Custom date range filtering for exports
- Excel/CSV export options
- Email integration to send exports directly
- Cloud storage integration
- Print optimization
