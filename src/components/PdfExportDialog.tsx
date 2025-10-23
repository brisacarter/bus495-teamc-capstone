import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { FileDown, FileText, Camera, Loader2 } from 'lucide-react';
import { exportAllScreensToPDF, exportDataReportToPDF, exportCurrentViewToPDF } from '../utils/pdfExport';
import { toast } from 'sonner@2.0.3';

interface PdfExportDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PdfExportDialog({ isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }: PdfExportDialogProps = {}) {
  const { setCurrentScreen, user, jobs, interviews, notifications } = useApp();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;
  const [exportType, setExportType] = useState<'screens' | 'data' | 'current'>('data');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [currentExportScreen, setCurrentExportScreen] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      if (exportType === 'screens') {
        // Export all screens as screenshots
        await exportAllScreensToPDF(setCurrentScreen, (progress) => {
          setExportProgress((progress.current / progress.total) * 100);
          setCurrentExportScreen(progress.currentScreen);
        });
        toast.success('All screens exported successfully!');
      } else if (exportType === 'data') {
        // Export data as a formatted report
        await exportDataReportToPDF(user, jobs, interviews, notifications);
        setExportProgress(100);
        toast.success('Data report exported successfully!');
      } else if (exportType === 'current') {
        // Export current view
        await exportCurrentViewToPDF('app-content', 'jobtracker-current-view.pdf');
        setExportProgress(100);
        toast.success('Current view exported successfully!');
      }

      // Close dialog after successful export
      setTimeout(() => {
        setIsOpen(false);
        setIsExporting(false);
        setExportProgress(0);
        setCurrentExportScreen('');
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export PDF. Please try again.');
      setIsExporting(false);
      setExportProgress(0);
      setCurrentExportScreen('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {!externalIsOpen && (
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <FileDown className="w-4 h-4 mr-2" />
            Export to PDF
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export to PDF</DialogTitle>
          <DialogDescription>
            Choose what you'd like to export from your JobTracker account.
          </DialogDescription>
        </DialogHeader>

        {!isExporting ? (
          <div className="space-y-6 py-4">
            <RadioGroup value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <div className="space-y-4">
                {/* Data Report Option */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="data" id="data" className="mt-1" />
                  <label htmlFor="data" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="font-medium">Data Report</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Export a comprehensive text report with all your job applications, interviews, and profile data.
                      Recommended for data portability.
                    </p>
                  </label>
                </div>

                {/* All Screens Option */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="screens" id="screens" className="mt-1" />
                  <label htmlFor="screens" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Camera className="w-4 h-4 text-primary" />
                      <span className="font-medium">All Screens (Screenshots)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Export screenshots of all main application screens (Dashboard, Calendar, Notifications, Profile, Billing).
                      This may take a moment.
                    </p>
                  </label>
                </div>

                {/* Current View Option */}
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="current" id="current" className="mt-1" />
                  <label htmlFor="current" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <FileDown className="w-4 h-4 text-primary" />
                      <span className="font-medium">Current View</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Export a screenshot of the current screen you're viewing.
                    </p>
                  </label>
                </div>
              </div>
            </RadioGroup>

            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex-1">
                <FileDown className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Generating PDF...</p>
                {currentExportScreen && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Capturing: {currentExportScreen}
                  </p>
                )}
              </div>
            </div>
            <Progress value={exportProgress} className="w-full" />
            <p className="text-xs text-center text-muted-foreground">
              {exportProgress < 100 ? 'Please wait...' : 'Finalizing export...'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
