import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { NotificationsView } from './NotificationsView';
import { 
  Plus, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Briefcase,
  MapPin,
  DollarSign,
  Calendar as CalendarIcon,
  Building2,
  FileDown,
  Info,
  Bell,
  Zap,
  Mic
} from 'lucide-react';
import { JobLead, ApplicationStatus } from '../types';
import { SpeedApplyModal } from './SpeedApplyModal';
import { WorkdayApplicationModal } from './WorkdayApplicationModal';
import { InterviewPrepUpgradeModal } from './InterviewPrepUpgradeModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function Dashboard() {
  const { jobs, addJob, updateJob, deleteJob, user, notifications, bulkApplyToJobs, setCurrentScreen } = useApp();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobLead | null>(null);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [isApplying, setIsApplying] = useState(false);
  const [showBulkApplyDialog, setShowBulkApplyDialog] = useState(false);
  const [showSpeedApplyModal, setShowSpeedApplyModal] = useState(false);
  const [showWorkdayModal, setShowWorkdayModal] = useState(false);
  const [selectedWorkdayJob, setSelectedWorkdayJob] = useState<JobLead | null>(null);
  const [showInterviewPrepUpgrade, setShowInterviewPrepUpgrade] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    applicationLink: '',
    hiringManager: '',
    status: 'saved' as ApplicationStatus,
    notes: '',
    salary: '',
    location: '',
    canApplyInApp: false,
    applicationMethod: 'external' as 'in-app' | 'external' | 'email',
  });

  const statusColors = {
    saved: 'bg-blue-100 text-blue-800',
    applied: 'bg-yellow-100 text-yellow-800',
    interviewing: 'bg-purple-100 text-purple-800',
    offered: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const filteredJobs = filterStatus === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filterStatus);

  const handleStatCardClick = (status: ApplicationStatus | 'all') => {
    setFilterStatus(status);
  };

  const savedJobs = jobs.filter(job => job.status === 'saved');
  const applicableJobs = savedJobs.filter(job => job.canApplyInApp);
  const externalJobs = savedJobs.filter(job => !job.canApplyInApp);
  const speedApplyJobs = applicableJobs.filter(job => job.speedApply);

  const handleBulkApply = async () => {
    if (applicableJobs.length === 0) return;
    
    // Check if any jobs have Speed Apply
    if (speedApplyJobs.length > 0) {
      setShowBulkApplyDialog(false);
      setShowSpeedApplyModal(true);
      return;
    }
    
    setIsApplying(true);
    const result = await bulkApplyToJobs(applicableJobs.map(job => job.id));
    setIsApplying(false);
    setShowBulkApplyDialog(false);
    
    // Show toast notification
    if (result.successful.length > 0) {
      // Toast will be shown by the context
    }
  };

  const handleSpeedApplyComplete = async () => {
    setIsApplying(true);
    const result = await bulkApplyToJobs(speedApplyJobs.map(job => job.id));
    setIsApplying(false);
    setShowSpeedApplyModal(false);
    
    if (result.successful.length > 0) {
      toast.success(`Successfully applied to ${result.successful.length} job${result.successful.length > 1 ? 's' : ''} via Speed Apply!`);
    }
  };

  const handleOpenDialog = (job?: JobLead) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        company: job.company,
        applicationLink: job.applicationLink,
        hiringManager: job.hiringManager || '',
        status: job.status,
        notes: job.notes,
        salary: job.salary || '',
        location: job.location || '',
        canApplyInApp: job.canApplyInApp,
        applicationMethod: job.applicationMethod,
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        company: '',
        applicationLink: '',
        hiringManager: '',
        status: 'saved',
        notes: '',
        salary: '',
        location: '',
        canApplyInApp: false,
        applicationMethod: 'external',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingJob) {
      updateJob(editingJob.id, formData);
    } else {
      addJob({
        ...formData,
        postingDate: new Date(),
        appliedDate: formData.status === 'applied' ? new Date() : undefined,
      });
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job lead?')) {
      deleteJob(id);
    }
  };

  const handleExcelExport = () => {
    try {
      // Get filtered jobs data
      const dataToExport = filteredJobs.map(job => ({
        'Job Title': job.title,
        'Company': job.company,
        'Location': job.location || 'N/A',
        'Salary': job.salary || 'N/A',
        'Status': job.status.charAt(0).toUpperCase() + job.status.slice(1),
        'Application Link': job.applicationLink,
        'Posted Date': new Date(job.postingDate).toLocaleDateString(),
        'Applied Date': job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'N/A',
        'Hiring Manager': job.hiringManager || 'N/A',
        'Notes': job.notes || 'N/A',
        'Application Method': job.applicationMethod || 'N/A',
        'Cover Letter': job.coverLetter || 'N/A',
        'Can Apply In App': job.canApplyInApp ? 'Yes' : 'No'
      }));

      if (dataToExport.length === 0) {
        toast.error('No data to export');
        return;
      }

      // Create CSV content
      const headers = Object.keys(dataToExport[0] || {});
      const csvContent = [
        headers.join(','),
        ...dataToExport.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape commas and quotes in values
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          }).join(',')
        )
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `JobTracker_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${dataToExport.length} job${dataToExport.length > 1 ? 's' : ''} to CSV`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1>Job Search Dashboard</h1>
          
          {/* Notifications Drawer */}
          <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" variant="destructive">
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto pl-8 pr-8">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Stay updated with your job search activities
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 pr-[30px]">
                <NotificationsView />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-muted-foreground">
          Track your job applications and manage your career search
        </p>
      </div>



      {/* Stats - Clickable Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-8">
        <Card 
          className={`p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'all' ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => handleStatCardClick('all')}
        >
          <p className="text-sm text-muted-foreground">All Leads</p>
          <p className="text-2xl mt-1">{jobs.length}</p>
        </Card>
        <Card 
          className={`p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'saved' ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => handleStatCardClick('saved')}
        >
          <p className="text-sm text-muted-foreground">Saved</p>
          <p className="text-2xl mt-1">{jobs.filter(j => j.status === 'saved').length}</p>
        </Card>
        <Card 
          className={`p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'applied' ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => handleStatCardClick('applied')}
        >
          <p className="text-sm text-muted-foreground">Applied</p>
          <p className="text-2xl mt-1">{jobs.filter(j => j.status === 'applied').length}</p>
        </Card>
        <Card 
          className={`p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'interviewing' ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => handleStatCardClick('interviewing')}
        >
          <p className="text-sm text-muted-foreground">Interviewing</p>
          <p className="text-2xl mt-1">{jobs.filter(j => j.status === 'interviewing').length}</p>
        </Card>
        <Card 
          className={`p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'offered' ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => handleStatCardClick('offered')}
        >
          <p className="text-sm text-muted-foreground">Offers</p>
          <p className="text-2xl mt-1">{jobs.filter(j => j.status === 'offered').length}</p>
        </Card>
        <Card 
          className={`p-3 md:p-4 cursor-pointer transition-all hover:shadow-md ${filterStatus === 'rejected' ? 'ring-2 ring-primary shadow-md' : ''}`}
          onClick={() => handleStatCardClick('rejected')}
        >
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl mt-1">{jobs.filter(j => j.status === 'rejected').length}</p>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Job Lead
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? 'Edit Job Lead' : 'Add New Job Lead'}</DialogTitle>
              <DialogDescription>
                {editingJob ? 'Update the job details below' : 'Add a new job opportunity to track'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationLink">Application Link *</Label>
                <Input
                  id="applicationLink"
                  type="url"
                  value={formData.applicationLink}
                  onChange={(e) => setFormData({ ...formData, applicationLink: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Remote, New York, NY"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    placeholder="e.g. $100k - $150k"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hiringManager">Hiring Manager</Label>
                  <Input
                    id="hiringManager"
                    value={formData.hiringManager}
                    onChange={(e) => setFormData({ ...formData, hiringManager: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ApplicationStatus })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interviewing">Interviewing</SelectItem>
                      <SelectItem value="offered">Offered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Add any notes about this opportunity..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingJob ? 'Update' : 'Add'} Job Lead
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ApplicationStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="saved">Saved</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Button 
            variant="outline" 
            onClick={handleExcelExport}
            className="w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        {/* Speed Apply Button */}
        {applicableJobs.length > 0 && (
          <Dialog open={showBulkApplyDialog} onOpenChange={setShowBulkApplyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#3E6BAF] to-[#569ead] hover:opacity-90 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Speed Apply ({applicableJobs.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bulk Apply to Jobs</DialogTitle>
                <DialogDescription>
                  Apply to multiple jobs at once using your active resume and settings
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900">
                        You have <strong>{applicableJobs.length} saved job{applicableJobs.length > 1 ? 's' : ''}</strong> that can be applied to within the app.
                      </p>
                    </div>
                  </div>
                </Card>

                {externalJobs.length > 0 && (
                  <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="text-amber-900 mb-1">External Applications</h4>
                        <p className="text-sm text-amber-800">
                          <strong>{externalJobs.length} job{externalJobs.length > 1 ? 's' : ''}</strong> require external application and will not be included in this bulk apply:
                        </p>
                        <ul className="text-sm text-amber-800 mt-2 space-y-1">
                          {externalJobs.map(job => (
                            <li key={job.id} className="ml-4">• {job.title} at {job.company}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="pt-4">
                  <h4 className="mb-3">Jobs to Apply:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {applicableJobs.map(job => (
                      <Card key={job.id} className="p-3 bg-green-50 border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-900">{job.title}</p>
                            <p className="text-sm text-green-700">{job.company}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">In-App</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowBulkApplyDialog(false)}
                    className="flex-1"
                    disabled={isApplying}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBulkApply}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isApplying}
                  >
                    {isApplying ? 'Applying...' : `Apply to ${applicableJobs.length} Job${applicableJobs.length > 1 ? 's' : ''}`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Job Leads */}
      <div className="space-y-3 md:space-y-4">
        {filteredJobs.length === 0 ? (
          <Card className="p-8 md:p-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No job leads yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your job search by adding your first job lead
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Job Lead
            </Button>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3>{job.title}</h3>
                        {job.speedApply && (
                          <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-300">
                            <Zap className="w-3 h-3 mr-1" />
                            Speed Apply
                          </Badge>
                        )}
                        {job.company === 'InnovateLabs' && !job.canApplyInApp && (
                          <Badge variant="outline" style={{ backgroundColor: '#3E6BAF15', color: '#3E6BAF', borderColor: '#3E6BAF' }}>
                            <Building2 className="w-3 h-3 mr-1" />
                            Workday Application
                          </Badge>
                        )}
                        {job.company !== 'InnovateLabs' && !job.canApplyInApp && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            External
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[job.status]}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {job.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Posted {new Date(job.postingDate).toLocaleDateString()}
                    </div>
                  </div>

                  {job.hiringManager && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Hiring Manager:</span>{' '}
                      {job.hiringManager}
                    </p>
                  )}

                  {job.notes && (
                    <p className="text-sm text-muted-foreground">
                      {job.notes}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  {/* Interview Prep Button - Only for TechCorp Senior Software Engineer */}
                  {job.company === 'TechCorp' && job.title === 'Senior Software Engineer' && job.status === 'interviewing' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        const hasCredits = (user?.interviewPrepCredits || 0) > 0;
                        if (hasCredits) {
                          setCurrentScreen('interview-prep');
                        } else {
                          setShowInterviewPrepUpgrade(true);
                        }
                      }}
                      className="flex-1 md:flex-none border-[#3E6BAF] text-[#3E6BAF] hover:bg-[#3E6BAF] hover:text-white"
                    >
                      <Mic className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Start Interview Prep</span>
                      <span className="md:hidden">🎤 Prep</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(job.applicationLink, '_blank')}
                    className="flex-1 md:flex-none"
                    disabled={job.status === 'applied' || job.status === 'interviewing'}
                  >
                    <ExternalLink className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">
                      {job.status === 'applied' || job.status === 'interviewing' ? 'Applied' : 'Apply'}
                    </span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (job.company === 'InnovateLabs' && !job.canApplyInApp) {
                        setSelectedWorkdayJob(job);
                        setShowWorkdayModal(true);
                      } else {
                        handleOpenDialog(job);
                      }
                    }}
                    className="flex-1 md:flex-none"
                  >
                    <Pencil className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(job.id)}
                    className="flex-1 md:flex-none text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Speed Apply Modal */}
      <SpeedApplyModal 
        isOpen={showSpeedApplyModal}
        onOpenChange={setShowSpeedApplyModal}
        jobs={speedApplyJobs}
        onComplete={handleSpeedApplyComplete}
      />

      {/* Workday Application Modal */}
      {selectedWorkdayJob && (
        <WorkdayApplicationModal
          isOpen={showWorkdayModal}
          onOpenChange={setShowWorkdayModal}
          job={selectedWorkdayJob}
          onComplete={() => {
            updateJob(selectedWorkdayJob.id, { 
              status: 'applied',
              appliedDate: new Date()
            });
            toast.success(`Successfully applied to ${selectedWorkdayJob.title} at ${selectedWorkdayJob.company} via Workday!`);
          }}
        />
      )}

      {/* Interview Prep Upgrade Modal */}
      <InterviewPrepUpgradeModal
        isOpen={showInterviewPrepUpgrade}
        onOpenChange={setShowInterviewPrepUpgrade}
        onUpgrade={() => {
          setShowInterviewPrepUpgrade(false);
          setCurrentScreen('billing');
        }}
      />
    </div>
  );
}