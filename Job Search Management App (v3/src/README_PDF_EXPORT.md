# PDF Export Feature

## Quick Start

The JobTracker application now supports comprehensive PDF exports of your job search data and application screens.

### Access Points

1. **Dashboard** - Click "Export to PDF" button in the top right
2. **Profile > Account Tab** - Find "Export Data" section

### Export Options

#### 📄 Data Report (Recommended)
A formatted text report containing:
- User profile and settings
- Job application statistics
- Complete job listings with notes
- Interview schedules and details

**Use when:** You need a portable data backup or want to share your job search progress with a career advisor.

#### 📸 All Screens
Screenshots of all 5 main application screens:
- Dashboard
- Calendar
- Notifications  
- Profile
- Billing

**Use when:** You need visual documentation or want to create a portfolio of your job search process.

#### 🖼️ Current View
Quick export of the current screen only.

**Use when:** You need to capture a specific view quickly.

## Features

✅ **Client-side Processing** - All exports happen in your browser, no data sent to servers
✅ **High Quality** - Screenshots captured at 2x resolution
✅ **Progress Tracking** - Visual feedback during export
✅ **Auto-naming** - Files include timestamps (e.g., `jobtracker-data-report-2025-10-10.pdf`)
✅ **Metadata** - PDFs include proper titles, author, and creation date

## Technical Stack

- **jsPDF** - PDF generation
- **html2canvas** - Screenshot capture
- **React Dialog** - Export interface
- **Sonner** - Toast notifications

## Files Added

- `/utils/pdfExport.ts` - Core export functionality
- `/components/PdfExportDialog.tsx` - Export dialog component
- `/docs/PDF_EXPORT_GUIDE.md` - Detailed user guide

## Files Modified

- `/components/ProfileView.tsx` - Added export section
- `/components/Dashboard.tsx` - Added export button
- `/components/AppLayout.tsx` - Added ID for targeting

## Performance

- **Data Report:** ~1-2 seconds
- **All Screens:** ~5-10 seconds  
- **Current View:** ~1-2 seconds

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas API
- Blob/File APIs
- Download attribute

## Future Enhancements

Potential additions:
- [ ] Custom date range filtering
- [ ] Excel/CSV export
- [ ] Email integration
- [ ] Cloud storage backup
- [ ] Scheduled automated exports
- [ ] Print optimization mode

---

For detailed documentation, see `/docs/PDF_EXPORT_GUIDE.md`
