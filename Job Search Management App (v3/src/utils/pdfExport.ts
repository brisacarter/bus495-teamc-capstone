import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportProgress {
  current: number;
  total: number;
  currentScreen: string;
}

export type ProgressCallback = (progress: ExportProgress) => void;

// List of screens to export
const SCREENS = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'profile', name: 'Profile' },
  { id: 'billing', name: 'Billing' },
];

/**
 * Captures a screenshot of the specified element and returns it as a canvas
 */
async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  // Scroll to top before capturing
  window.scrollTo(0, 0);
  
  return await html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    width: element.scrollWidth,
    height: element.scrollHeight,
  });
}

/**
 * Exports the current view to PDF
 */
export async function exportCurrentViewToPDF(
  elementId: string,
  filename: string = 'jobtracker-export.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Capture the element
  const canvas = await captureElement(element);
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  // Add image to PDF
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

  // Save the PDF
  pdf.save(filename);
}

/**
 * Exports all application screens to a single PDF
 */
export async function exportAllScreensToPDF(
  setCurrentScreen: (screen: string) => void,
  onProgress?: ProgressCallback
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < SCREENS.length; i++) {
    const screen = SCREENS[i];
    
    // Update progress
    if (onProgress) {
      onProgress({
        current: i + 1,
        total: SCREENS.length,
        currentScreen: screen.name,
      });
    }

    // Navigate to screen
    setCurrentScreen(screen.id);
    
    // Wait for screen to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find the main content area
    const mainContent = document.querySelector('main');
    
    if (mainContent) {
      // Capture the screen
      const canvas = await captureElement(mainContent as HTMLElement);
      
      // Calculate dimensions to fit page
      const imgWidth = pageWidth - 40; // 20px margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add new page if not first screen
      if (i > 0) {
        pdf.addPage();
      }

      // Add title for the screen
      pdf.setFontSize(16);
      pdf.text(screen.name, pageWidth / 2, 30, { align: 'center' });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/png');
      
      // If image is taller than page, scale it down
      const maxHeight = pageHeight - 80; // Leave space for title and margins
      const finalHeight = Math.min(imgHeight, maxHeight);
      const finalWidth = (canvas.width * finalHeight) / canvas.height;
      
      pdf.addImage(
        imgData,
        'PNG',
        (pageWidth - finalWidth) / 2,
        50,
        finalWidth,
        finalHeight
      );
    }
  }

  // Add metadata
  pdf.setProperties({
    title: 'JobTracker Application Export',
    subject: 'Application Screenshots',
    author: 'JobTracker',
    keywords: 'job search, application tracking',
    creator: 'JobTracker App',
  });

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `jobtracker-export-${timestamp}.pdf`;

  // Save the PDF
  pdf.save(filename);
}

/**
 * Exports application data as a formatted PDF report
 */
export async function exportDataReportToPDF(
  user: any,
  jobs: any[],
  interviews: any[],
  notifications: any[]
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = 20;
  const lineHeight = 7;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
      return true;
    }
    return false;
  };

  // Title
  pdf.setFontSize(20);
  pdf.text('JobTracker Data Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += lineHeight * 2;

  // Date
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += lineHeight * 2;

  // User Information
  pdf.setFontSize(14);
  pdf.text('User Profile', 20, yPosition);
  yPosition += lineHeight;

  pdf.setFontSize(10);
  pdf.text(`Email: ${user?.email || 'N/A'}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Username: ${user?.username || 'N/A'}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Subscription: ${user?.subscriptionTier || 'free'}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Job Interests: ${user?.profile?.jobInterests?.join(', ') || 'N/A'}`, 25, yPosition);
  yPosition += lineHeight * 2;

  // Job Applications Summary
  checkPageBreak();
  pdf.setFontSize(14);
  pdf.text('Job Applications Summary', 20, yPosition);
  yPosition += lineHeight;

  const savedJobs = jobs.filter(j => j.status === 'saved').length;
  const appliedJobs = jobs.filter(j => j.status === 'applied').length;
  const interviewingJobs = jobs.filter(j => j.status === 'interviewing').length;
  const offerJobs = jobs.filter(j => j.status === 'offer').length;
  const rejectedJobs = jobs.filter(j => j.status === 'rejected').length;

  pdf.setFontSize(10);
  pdf.text(`Total Jobs Tracked: ${jobs.length}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Saved: ${savedJobs}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Applied: ${appliedJobs}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Interviewing: ${interviewingJobs}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Offers: ${offerJobs}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Rejected: ${rejectedJobs}`, 25, yPosition);
  yPosition += lineHeight * 2;

  // Interviews Summary
  checkPageBreak();
  pdf.setFontSize(14);
  pdf.text('Interviews Summary', 20, yPosition);
  yPosition += lineHeight;

  const upcomingInterviews = interviews.filter(i => new Date(i.date) > new Date()).length;
  const pastInterviews = interviews.filter(i => new Date(i.date) <= new Date()).length;

  pdf.setFontSize(10);
  pdf.text(`Total Interviews: ${interviews.length}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Upcoming: ${upcomingInterviews}`, 25, yPosition);
  yPosition += lineHeight;
  pdf.text(`Past: ${pastInterviews}`, 25, yPosition);
  yPosition += lineHeight * 2;

  // Job Details
  checkPageBreak(50);
  pdf.setFontSize(14);
  pdf.text('Job Applications Details', 20, yPosition);
  yPosition += lineHeight * 1.5;

  jobs.forEach((job, index) => {
    checkPageBreak(30);
    
    pdf.setFontSize(12);
    pdf.text(`${index + 1}. ${job.title} at ${job.company}`, 25, yPosition);
    yPosition += lineHeight;
    
    pdf.setFontSize(9);
    pdf.text(`Status: ${job.status}`, 30, yPosition);
    yPosition += lineHeight * 0.8;
    pdf.text(`Location: ${job.location || 'N/A'}`, 30, yPosition);
    yPosition += lineHeight * 0.8;
    pdf.text(`Salary: ${job.salary || 'N/A'}`, 30, yPosition);
    yPosition += lineHeight * 0.8;
    
    if (job.appliedDate) {
      pdf.text(`Applied: ${new Date(job.appliedDate).toLocaleDateString()}`, 30, yPosition);
      yPosition += lineHeight * 0.8;
    }
    
    if (job.notes) {
      const maxWidth = pageWidth - 40;
      const wrappedText = pdf.splitTextToSize(`Notes: ${job.notes}`, maxWidth);
      pdf.text(wrappedText, 30, yPosition);
      yPosition += wrappedText.length * lineHeight * 0.8;
    }
    
    yPosition += lineHeight;
  });

  // Interview Details
  if (interviews.length > 0) {
    checkPageBreak(50);
    pdf.setFontSize(14);
    pdf.text('Interview Details', 20, yPosition);
    yPosition += lineHeight * 1.5;

    interviews.forEach((interview, index) => {
      checkPageBreak(25);
      
      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${interview.jobTitle} at ${interview.company}`, 25, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(9);
      pdf.text(`Date: ${new Date(interview.date).toLocaleString()}`, 30, yPosition);
      yPosition += lineHeight * 0.8;
      pdf.text(`Type: ${interview.type}`, 30, yPosition);
      yPosition += lineHeight * 0.8;
      pdf.text(`Duration: ${interview.duration} minutes`, 30, yPosition);
      yPosition += lineHeight * 0.8;
      
      if (interview.interviewers && interview.interviewers.length > 0) {
        pdf.text(`Interviewers: ${interview.interviewers.join(', ')}`, 30, yPosition);
        yPosition += lineHeight * 0.8;
      }
      
      if (interview.notes) {
        const maxWidth = pageWidth - 40;
        const wrappedText = pdf.splitTextToSize(`Notes: ${interview.notes}`, maxWidth);
        pdf.text(wrappedText, 30, yPosition);
        yPosition += wrappedText.length * lineHeight * 0.8;
      }
      
      yPosition += lineHeight;
    });
  }

  // Add metadata
  pdf.setProperties({
    title: 'JobTracker Data Report',
    subject: 'Job Application and Interview Data',
    author: 'JobTracker',
    keywords: 'job search, applications, interviews, data export',
    creator: 'JobTracker App',
  });

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `jobtracker-data-report-${timestamp}.pdf`;

  // Save the PDF
  pdf.save(filename);
}
