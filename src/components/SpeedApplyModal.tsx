import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  CheckCircle2, 
  FileText, 
  Upload, 
  Send, 
  Mail,
  Zap,
  Sparkles,
  Eye,
  Download
} from 'lucide-react';
import { JobLead } from '../types';

interface SpeedApplyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: JobLead[];
  onComplete: () => void;
}

type Step = {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'complete';
};

export function SpeedApplyModal({ isOpen, onOpenChange, jobs, onComplete }: SpeedApplyModalProps) {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showApplicationPreview, setShowApplicationPreview] = useState(false);
  const [selectedJobForPreview, setSelectedJobForPreview] = useState<JobLead | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'format',
      label: 'Formatting resume for ATS parsing',
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'autofill',
      label: 'Auto-filling application form fields',
      icon: <Sparkles className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'upload',
      label: 'Uploading resume',
      icon: <Upload className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'submit',
      label: 'Submitting application',
      icon: <Send className="w-5 h-5" />,
      status: 'pending',
    },
    {
      id: 'message',
      label: 'Sending message to hiring manager',
      icon: <Mail className="w-5 h-5" />,
      status: 'pending',
    },
  ]);

  const currentJob = jobs[currentJobIndex];
  const completedJobs = isComplete ? jobs.length : currentJobIndex;
  const progress = (completedJobs / jobs.length) * 100;

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setCurrentJobIndex(0);
      setIsComplete(false);
      setIsProcessing(false);
      setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    }
  }, [isOpen]);

  const processNextStep = async (stepIndex: number) => {
    if (stepIndex >= steps.length) {
      // All steps complete for current job
      if (currentJobIndex < jobs.length - 1) {
        // Move to next job
        setCurrentJobIndex(prev => prev + 1);
        setSteps(steps.map(step => ({ ...step, status: 'pending' })));
        setTimeout(() => processNextStep(0), 500);
      } else {
        // All jobs complete
        setIsComplete(true);
        onComplete();
      }
      return;
    }

    // Update current step to processing
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status: 'processing' } : step
    ));

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Update current step to complete
    setSteps(prev => prev.map((step, idx) => 
      idx === stepIndex ? { ...step, status: 'complete' } : step
    ));

    // Move to next step
    setTimeout(() => processNextStep(stepIndex + 1), 200);
  };

  const handleStart = () => {
    setIsProcessing(true);
    processNextStep(0);
  };

  const getStepColor = (status: Step['status']) => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleViewApplication = (job: JobLead) => {
    setSelectedJobForPreview(job);
    setShowApplicationPreview(true);
  };

  const handleDownloadApplicationPDF = (job: JobLead) => {
    // Create a mock application data structure
    const applicationData = `
JOB APPLICATION SUMMARY
========================

Position: ${job.title}
Company: ${job.company}
Application Date: ${new Date().toLocaleDateString()}

APPLICANT INFORMATION
---------------------
[Your resume and profile information was auto-filled]

APPLICATION DETAILS
-------------------
- Resume uploaded and optimized for ATS parsing
- All required fields auto-completed
- Cover letter tailored to position
- Contact information verified

MESSAGE TO HIRING MANAGER
-------------------------
Dear Hiring Manager,

I am excited to submit my application for the ${job.title} position at ${job.company}. 
With my background and experience, I believe I would be a strong fit for this role.

I have attached my resume for your review and would welcome the opportunity to discuss 
how my skills align with your team's needs.

Thank you for your consideration.

Best regards,
[Your Name]

---
This application was submitted via Speed Apply on ${new Date().toLocaleString()}
Application Link: ${job.applicationLink}
    `.trim();

    const blob = new Blob([applicationData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpeedApply_${job.company}_${job.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Speed Apply
          </DialogTitle>
          <DialogDescription>
            Automatically submit your applications with AI-powered form filling
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isProcessing && !isComplete && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 mb-1">Ready to Speed Apply</h4>
                  <p className="text-sm text-blue-800">
                    Your resume and profile details will be automatically formatted, filled, and submitted to{' '}
                    <strong>{jobs.length} job{jobs.length > 1 ? 's' : ''}</strong>.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {(isProcessing || isComplete) && (
            <>
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Overall Progress: {currentJobIndex + 1} of {jobs.length} jobs
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Current Job */}
              {currentJob && !isComplete && (
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="text-blue-900">Currently Applying</h4>
                  </div>
                  <p className="text-blue-800">
                    <strong>{currentJob.title}</strong> at {currentJob.company}
                  </p>
                </Card>
              )}

              {/* Steps */}
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 transition-all ${
                      step.status === 'processing' ? 'scale-105' : ''
                    }`}
                  >
                    <div className={`mt-0.5 ${getStepColor(step.status)}`}>
                      {step.status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${getStepColor(step.status)}`}>
                        {step.label}
                        {step.status === 'processing' && (
                          <span className="ml-2 inline-flex gap-1">
                            <span className="animate-pulse">.</span>
                            <span className="animate-pulse delay-100">.</span>
                            <span className="animate-pulse delay-200">.</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Success State */}
              {isComplete && (
                <>
                  <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-green-900 mb-1">Speed Apply Complete!</h4>
                        <p className="text-sm text-green-800">
                          Your applications have been successfully submitted to {jobs.length} job{jobs.length > 1 ? 's' : ''}. 
                          Personalized messages have been sent to the hiring managers.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* View Submitted Applications */}
                  <Card className="p-4">
                    <h4 className="mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Submitted Applications
                    </h4>
                    <ScrollArea className="max-h-48">
                      <div className="space-y-2">
                        {jobs.map((job) => (
                          <div key={job.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1">
                              <p className="text-sm">{job.title}</p>
                              <p className="text-xs text-muted-foreground">{job.company}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewApplication(job)}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadApplicationPDF(job)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </Card>
                </>
              )}
            </>
          )}

          {/* Jobs List Preview (before processing) */}
          {!isProcessing && !isComplete && (
            <div className="space-y-2">
              <h4 className="text-sm">Jobs to Apply:</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {jobs.map((job) => (
                  <Card key={job.id} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm text-purple-900">{job.title}</p>
                        <p className="text-xs text-purple-700">{job.company}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isProcessing && !isComplete && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStart}
                  className="flex-1 bg-gradient-to-r from-[#3E6BAF] to-[#569ead] hover:opacity-90 text-white"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Start Speed Apply
                </Button>
              </>
            )}
            {isComplete && (
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Application Preview Dialog */}
      <Dialog open={showApplicationPreview} onOpenChange={setShowApplicationPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Details - {selectedJobForPreview?.title}
            </DialogTitle>
            <DialogDescription>
              Review what was submitted on your behalf
            </DialogDescription>
          </DialogHeader>

          {selectedJobForPreview && (
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Job Information */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Position Details
                  </h4>
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-muted-foreground">Position:</span>
                          <p className="text-blue-900">{selectedJobForPreview.title}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Company:</span>
                          <p className="text-blue-900">{selectedJobForPreview.company}</p>
                        </div>
                      </div>
                      {selectedJobForPreview.location && (
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <p className="text-blue-900">{selectedJobForPreview.location}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Application Link:</span>
                        <p className="text-blue-900 text-xs break-all">{selectedJobForPreview.applicationLink}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted:</span>
                        <p className="text-blue-900">{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Separator />

                {/* Auto-filled Information */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Auto-Filled Application Data
                  </h4>
                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <div className="space-y-3 text-sm">
                      <div>
                        <Badge className="mb-2 bg-purple-600">Form Fields Completed</Badge>
                        <ul className="space-y-1 ml-4 text-purple-900">
                          <li>✓ Full Name & Contact Information</li>
                          <li>✓ Email Address & Phone Number</li>
                          <li>✓ Work Authorization Status</li>
                          <li>✓ Availability & Start Date</li>
                          <li>✓ Salary Expectations (if requested)</li>
                          <li>✓ LinkedIn Profile URL</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>

                <Separator />

                {/* Resume Upload */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-green-600" />
                    Resume & Documents
                  </h4>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="space-y-2 text-sm text-green-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Resume_Professional.pdf</span>
                        <Badge className="bg-green-600 text-xs">Uploaded</Badge>
                      </div>
                      <p className="text-xs text-green-700">
                        • Optimized for ATS parsing<br />
                        • Formatted for maximum compatibility<br />
                        • File size: 245 KB
                      </p>
                    </div>
                  </Card>
                </div>

                <Separator />

                {/* Cover Letter / Message */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Message to Hiring Manager
                  </h4>
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700 whitespace-pre-line">
                        Dear Hiring Manager,
                        {'\n\n'}
                        I am excited to submit my application for the <strong>{selectedJobForPreview.title}</strong> position at <strong>{selectedJobForPreview.company}</strong>. 
                        With my background and experience, I believe I would be a strong fit for this role.
                        {'\n\n'}
                        I have attached my resume for your review and would welcome the opportunity to discuss how my skills align with your team's needs.
                        {'\n\n'}
                        Thank you for your consideration.
                        {'\n\n'}
                        Best regards,{'\n'}
                        [Your Name]
                      </p>
                      <Badge className="bg-blue-600 text-xs">AI-Generated & Personalized</Badge>
                    </div>
                  </Card>
                </div>

                <Separator />

                {/* Additional Information */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gray-600" />
                    Additional Details
                  </h4>
                  <Card className="p-4 bg-gray-50 border-gray-200">
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span>Application Status:</span>
                        <Badge className="bg-green-600">Successfully Submitted</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Method:</span>
                        <Badge variant="outline">Speed Apply (AI-Powered)</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Confirmation:</span>
                        <span className="text-xs font-mono">SA-{selectedJobForPreview.id.substring(0, 8).toUpperCase()}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowApplicationPreview(false)}
              className="flex-1"
            >
              Close
            </Button>
            {selectedJobForPreview && (
              <Button
                onClick={() => handleDownloadApplicationPDF(selectedJobForPreview)}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Summary
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
