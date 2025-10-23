import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, JobLead, Interview, Notification, NotificationPreferences } from '../types';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, password: string, username: string) => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  
  jobs: JobLead[];
  addJob: (job: Omit<JobLead, 'id'>) => void;
  updateJob: (id: string, updates: Partial<JobLead>) => void;
  deleteJob: (id: string) => void;
  bulkApplyToJobs: (jobIds: string[]) => Promise<{ successful: string[], failed: string[] }>;
  
  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const mockUser: User = {
  id: '1',
  email: 'demo@jobtracker.com',
  username: 'demo_user',
  twoFactorEnabled: false,
  subscriptionTier: 'free',
  aiAssistantEnabled: true,
  profile: {
    jobInterests: ['Software Development', 'Product Management'],
    seniorityLevel: 'mid-level',
    careerGoalsShort: 'Secure a senior software engineer position at a tech company',
    careerGoalsLong: 'Become a technical leader and eventually transition into engineering management',
    salaryMin: 100000,
    salaryMax: 150000,
    resumes: [
      {
        id: 'r1',
        name: 'Resume_2025.pdf',
        uploadDate: new Date('2025-01-15'),
        fileType: 'pdf',
        isActive: true,
      }
    ],
    coverLetters: [
      {
        id: 'c1',
        name: 'General Cover Letter',
        content: 'Dear Hiring Manager...',
        createdDate: new Date('2025-01-15'),
        isDefault: true,
      }
    ],
  },
};

const mockJobs: JobLead[] = [
  {
    id: 'j1',
    title: 'Senior Software Engineer',
    company: 'TechCorp',
    postingDate: new Date('2025-10-01'),
    applicationLink: 'https://techcorp.com/careers/123',
    hiringManager: 'Jane Smith',
    status: 'interviewing',
    notes: 'Strong team culture, remote-first company. Interview scheduled for next week.',
    appliedDate: new Date('2025-10-02'),
    salary: '$120k - $160k',
    location: 'Remote',
    applicationMethod: 'in-app',
    canApplyInApp: true,
    lastContactDate: new Date('2025-10-03'),
    followUpDate: new Date('2025-10-11'),
  },
  {
    id: 'j2',
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    postingDate: new Date('2025-09-28'),
    applicationLink: 'https://startupxyz.com/jobs/456',
    hiringManager: 'John Doe',
    status: 'applied',
    notes: 'Early stage startup, equity opportunity. Waiting for response.',
    appliedDate: new Date('2025-09-29'),
    salary: '$90k - $130k',
    location: 'San Francisco, CA',
    applicationMethod: 'external',
    canApplyInApp: false,
    lastContactDate: new Date('2025-09-29'),
    followUpDate: new Date('2025-10-13'),
    aiSuggestions: ['Send follow-up email', 'Check application status'],
  },
  {
    id: 'j3',
    title: 'Full Stack Engineer',
    company: 'InnovateLabs',
    postingDate: new Date('2025-10-05'),
    applicationLink: 'https://innovatelabs.com/careers/789',
    status: 'saved',
    notes: 'Great tech stack (React, Node.js, PostgreSQL). Need to tailor resume before applying.',
    salary: '$110k - $145k',
    location: 'New York, NY (Hybrid)',
    applicationMethod: 'external',
    canApplyInApp: false,
    aiSuggestions: ['Customize resume for React/Node stack', 'Research company culture'],
  },
  {
    id: 'j4',
    title: 'Product Designer',
    company: 'DesignHub',
    postingDate: new Date('2025-10-06'),
    applicationLink: 'https://designhub.com/jobs/321',
    status: 'saved',
    notes: 'Focusing on UX/UI for SaaS products',
    salary: '$95k - $125k',
    location: 'Austin, TX',
    applicationMethod: 'in-app',
    canApplyInApp: true,
    speedApply: true,
  },
  {
    id: 'j5',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    postingDate: new Date('2025-10-04'),
    applicationLink: 'https://cloudscale.com/careers/654',
    status: 'saved',
    notes: 'AWS/Kubernetes experience required',
    salary: '$130k - $170k',
    location: 'Seattle, WA',
    applicationMethod: 'in-app',
    canApplyInApp: true,
    speedApply: true,
  },
];

const mockInterviews: Interview[] = [
  {
    id: 'i1',
    jobId: 'j1',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    date: new Date('2025-10-10T14:00:00'),
    duration: 60,
    type: 'video',
    interviewers: ['Jane Smith', 'Mike Johnson'],
    notes: 'Technical interview - prepare for system design questions',
  },
  {
    id: 'i2',
    jobId: 'j1',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp',
    date: new Date('2025-10-15T10:00:00'),
    duration: 45,
    type: 'video',
    interviewers: ['Sarah Williams'],
    notes: 'Behavioral interview with hiring manager',
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'interview-reminder',
    title: 'Interview Tomorrow',
    message: 'Technical interview with TechCorp at 2:00 PM',
    date: new Date('2025-10-09T14:00:00'),
    read: false,
    jobId: 'j1',
    actionable: true,
    action: 'View Interview',
  },
  {
    id: 'n2',
    type: 'follow-up',
    title: 'Follow Up Reminder',
    message: 'Send follow-up email for Frontend Developer at StartupXYZ',
    date: new Date('2025-10-07T09:00:00'),
    read: false,
    jobId: 'j2',
    actionable: true,
    action: 'Send Follow-Up',
  },
  {
    id: 'n3',
    type: 'ai-suggestion',
    title: 'AI Assistant Suggestion',
    message: 'Your resume could be tailored for the Full Stack Engineer position at InnovateLabs',
    date: new Date('2025-10-07T10:00:00'),
    read: false,
    jobId: 'j3',
    actionable: true,
    action: 'Customize Resume',
  },
  {
    id: 'n4',
    type: 'reapply',
    title: 'Re-apply Opportunity',
    message: 'DesignHub has posted a similar position - consider applying',
    date: new Date('2025-10-06T14:00:00'),
    read: false,
    jobId: 'j4',
    actionable: true,
    action: 'View Job',
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobs, setJobs] = useState<JobLead[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    interviewReminders: true,
    reminderTiming: 24,
    followUpReminders: true,
    deadlineAlerts: true,
    emailNotifications: true,
    pushNotifications: false,
  });
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      setUser(mockUser);
      setJobs(mockJobs);
      setInterviews(mockInterviews);
      setNotifications(mockNotifications);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email && password) {
      setIsAuthenticated(true);
      setUser(mockUser);
      setJobs(mockJobs);
      setInterviews(mockInterviews);
      setNotifications(mockNotifications);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setJobs([]);
    setInterviews([]);
    setNotifications([]);
    localStorage.removeItem('isAuthenticated');
    setCurrentScreen('login');
  };

  const signup = async (email: string, password: string, username: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email && password && username) {
      const newUser = { ...mockUser, email, username };
      setIsAuthenticated(true);
      setUser(newUser);
      setJobs([]);
      setInterviews([]);
      setNotifications([]);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const addJob = (job: Omit<JobLead, 'id'>) => {
    const newJob = { ...job, id: `j${Date.now()}` };
    setJobs([...jobs, newJob]);
  };

  const updateJob = (id: string, updates: Partial<JobLead>) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, ...updates } : job));
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const addInterview = (interview: Omit<Interview, 'id'>) => {
    const newInterview = { ...interview, id: `i${Date.now()}` };
    setInterviews([...interviews, newInterview]);
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews(interviews.map(interview => 
      interview.id === id ? { ...interview, ...updates } : interview
    ));
  };

  const deleteInterview = (id: string) => {
    setInterviews(interviews.filter(interview => interview.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { ...notification, id: `n${Date.now()}` };
    setNotifications([newNotification, ...notifications]);
  };

  const bulkApplyToJobs = async (jobIds: string[]): Promise<{ successful: string[], failed: string[] }> => {
    const successful: string[] = [];
    const failed: string[] = [];
    
    // Simulate bulk application process
    for (const jobId of jobIds) {
      const job = jobs.find(j => j.id === jobId);
      if (job && job.canApplyInApp) {
        // Simulate application delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Update job status
        updateJob(jobId, { 
          status: 'applied', 
          appliedDate: new Date(),
          lastContactDate: new Date(),
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week follow-up
        });
        
        successful.push(jobId);
      } else {
        failed.push(jobId);
      }
    }
    
    // Create notification for successful applications
    if (successful.length > 0) {
      addNotification({
        type: 'ai-suggestion',
        title: 'Bulk Application Complete',
        message: `Successfully applied to ${successful.length} job${successful.length > 1 ? 's' : ''}.${failed.length > 0 ? ` ${failed.length} job${failed.length > 1 ? 's' : ''} require external application.` : ''}`,
        date: new Date(),
        read: false,
        actionable: false,
      });
    }
    
    return { successful, failed };
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences({ ...notificationPreferences, ...prefs });
  };

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      signup,
      updateUser,
      jobs,
      addJob,
      updateJob,
      deleteJob,
      bulkApplyToJobs,
      interviews,
      addInterview,
      updateInterview,
      deleteInterview,
      notifications,
      markNotificationAsRead,
      addNotification,
      notificationPreferences,
      updateNotificationPreferences,
      currentScreen,
      setCurrentScreen,
    }}>
      {children}
    </AppContext.Provider>
  );
};