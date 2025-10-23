import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
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
  Plus, 
  Video, 
  Phone, 
  MapPin, 
  Clock,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Interview } from '../types';

export function CalendarView() {
  const { interviews, addInterview, updateInterview, deleteInterview, jobs } = useApp();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'upcoming'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const [formData, setFormData] = useState({
    jobId: '',
    date: '',
    time: '',
    duration: '60',
    type: 'video' as 'phone' | 'video' | 'in-person',
    location: '',
    interviewers: '',
    notes: '',
  });

  const upcomingInterviews = interviews
    .filter(i => new Date(i.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastInterviews = interviews
    .filter(i => new Date(i.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const displayedInterviews = viewMode === 'upcoming' ? upcomingInterviews : interviews;

  const typeIcons = {
    video: Video,
    phone: Phone,
    'in-person': MapPin,
  };

  const typeColors = {
    video: 'bg-blue-100 text-blue-800',
    phone: 'bg-green-100 text-green-800',
    'in-person': 'bg-purple-100 text-purple-800',
  };

  const handleOpenDialog = (interview?: Interview) => {
    if (interview) {
      setEditingInterview(interview);
      const date = new Date(interview.date);
      setFormData({
        jobId: interview.jobId,
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5),
        duration: interview.duration.toString(),
        type: interview.type,
        location: interview.location || '',
        interviewers: interview.interviewers?.join(', ') || '',
        notes: interview.notes,
      });
    } else {
      setEditingInterview(null);
      setFormData({
        jobId: '',
        date: '',
        time: '',
        duration: '60',
        type: 'video',
        location: '',
        interviewers: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const job = jobs.find(j => j.id === formData.jobId);
    if (!job) return;

    const dateTime = new Date(`${formData.date}T${formData.time}`);
    const interviewData = {
      jobId: formData.jobId,
      jobTitle: job.title,
      company: job.company,
      date: dateTime,
      duration: parseInt(formData.duration),
      type: formData.type,
      location: formData.location || undefined,
      interviewers: formData.interviewers ? formData.interviewers.split(',').map(i => i.trim()) : undefined,
      notes: formData.notes,
    };

    if (editingInterview) {
      updateInterview(editingInterview.id, interviewData);
    } else {
      addInterview(interviewData);
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this interview?')) {
      deleteInterview(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Get interviews for selected date
  const selectedDateInterviews = selectedDate
    ? interviews.filter((interview) => {
        const interviewDate = new Date(interview.date);
        return (
          interviewDate.getDate() === selectedDate.getDate() &&
          interviewDate.getMonth() === selectedDate.getMonth() &&
          interviewDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Get dates that have interviews
  const datesWithInterviews = interviews.map((interview) => {
    const date = new Date(interview.date);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Interview Calendar</h1>
        <p className="text-muted-foreground">
          Manage and track all your interview appointments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
        <Card className="p-3 md:p-4">
          <p className="text-sm text-muted-foreground">Total Interviews</p>
          <p className="text-2xl mt-1">{interviews.length}</p>
        </Card>
        <Card className="p-3 md:p-4">
          <p className="text-sm text-muted-foreground">Upcoming</p>
          <p className="text-2xl mt-1">{upcomingInterviews.length}</p>
        </Card>
        <Card className="p-3 md:p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="text-2xl mt-1">{pastInterviews.length}</p>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
              </DialogTitle>
              <DialogDescription>
                {editingInterview ? 'Update the interview details below' : 'Add a new interview to your calendar'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobId">Job Position *</Label>
                <Select
                  value={formData.jobId}
                  onValueChange={(value) => setFormData({ ...formData, jobId: value })}
                  required
                >
                  <SelectTrigger id="jobId">
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Interview Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Link</Label>
                <Input
                  id="location"
                  placeholder="e.g. Zoom link, office address, phone number"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interviewers">Interviewers</Label>
                <Input
                  id="interviewers"
                  placeholder="Comma-separated names"
                  value={formData.interviewers}
                  onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  placeholder="Add any preparation notes or details..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingInterview ? 'Update' : 'Schedule'} Interview
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setViewMode('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            All
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="p-4 md:p-6">
            <h3 className="mb-4">Interview Schedule</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasInterview: datesWithInterviews,
              }}
              modifiersStyles={{
                hasInterview: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  color: 'rgb(59 130 246)',
                },
              }}
            />
          </Card>

          {/* Selected Date Interviews */}
          <div>
            <Card className="p-4 md:p-6">
              <h3 className="mb-4">
                {selectedDate
                  ? formatDate(selectedDate)
                  : 'Select a date'}
              </h3>
              
              <div className="space-y-3">
                {selectedDateInterviews.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      No interviews scheduled for this date
                    </p>
                  </div>
                ) : (
                  selectedDateInterviews.map((interview) => {
                    const TypeIcon = typeIcons[interview.type];
                    
                    return (
                      <Card key={interview.id} className="p-3 md:p-4 bg-blue-50 border-blue-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={typeColors[interview.type]}>
                                <TypeIcon className="w-3 h-3 mr-1" />
                                {interview.type}
                              </Badge>
                              <span className="flex items-center gap-1 text-sm">
                                <Clock className="w-3 h-3" />
                                {formatTime(interview.date)}
                              </span>
                            </div>
                            <h4 className="mb-1">{interview.jobTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              {interview.company}
                            </p>
                            {interview.location && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {interview.location}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDialog(interview)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(interview.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Interview List */}
      {viewMode !== 'calendar' && (
        <div className="space-y-3 md:space-y-4">
        {displayedInterviews.length === 0 ? (
          <Card className="p-8 md:p-12 text-center">
            <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="mb-2">No interviews scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Schedule your first interview to get started
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </Card>
        ) : (
          displayedInterviews.map((interview) => {
            const TypeIcon = typeIcons[interview.type];
            const isPast = new Date(interview.date) < new Date();
            
            return (
              <Card key={interview.id} className={`p-4 md:p-6 ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="mb-1">{interview.jobTitle}</h3>
                        <p className="text-muted-foreground">{interview.company}</p>
                      </div>
                      <Badge className={typeColors[interview.type]}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(interview.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{formatTime(interview.date)} ({interview.duration} min)</span>
                      </div>
                    </div>

                    {interview.interviewers && interview.interviewers.length > 0 && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Interviewers:</span>{' '}
                        {interview.interviewers.join(', ')}
                      </p>
                    )}

                    {interview.location && (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Location:</span>{' '}
                        {interview.location}
                      </p>
                    )}

                    {interview.notes && (
                      <p className="text-sm text-muted-foreground">
                        {interview.notes}
                      </p>
                    )}

                    {isPast && (
                      <Badge variant="outline" className="w-fit">
                        Completed
                      </Badge>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(interview)}
                      className="flex-1 md:flex-none"
                    >
                      <Pencil className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(interview.id)}
                      className="flex-1 md:flex-none text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
        </div>
      )}
    </div>
  );
}