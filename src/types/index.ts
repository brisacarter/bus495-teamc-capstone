export type SeniorityLevel = 'entry-level' | 'mid-level' | 'senior' | 'executive';

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';

export type ApplicationMethod = 'in-app' | 'external' | 'email';

export type SubscriptionTier = 'free' | 'premium-monthly' | 'premium-yearly';

export interface User {
  id: string;
  email: string;
  username: string;
  twoFactorEnabled: boolean;
  subscriptionTier: SubscriptionTier;
  profile: UserProfile;
  aiAssistantEnabled: boolean;
}

export interface UserProfile {
  jobInterests: string[];
  seniorityLevel: SeniorityLevel;
  careerGoalsShort: string;
  careerGoalsLong: string;
  salaryMin: number;
  salaryMax: number;
  resumes: Resume[];
  coverLetters: CoverLetter[];
}

export interface CoverLetter {
  id: string;
  name: string;
  content: string;
  createdDate: Date;
  isDefault: boolean;
}

export interface Resume {
  id: string;
  name: string;
  uploadDate: Date;
  fileType: 'pdf' | 'docx';
  url?: string;
  isActive: boolean;
}

export interface JobLead {
  id: string;
  title: string;
  company: string;
  postingDate: Date;
  applicationLink: string;
  hiringManager?: string;
  status: ApplicationStatus;
  notes: string;
  appliedDate?: Date;
  salary?: string;
  location?: string;
  applicationMethod: ApplicationMethod;
  followUpDate?: Date;
  lastContactDate?: Date;
  aiSuggestions?: string[];
  canApplyInApp: boolean;
  speedApply?: boolean;
  coverLetter?: string;
}

export interface Interview {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  date: Date;
  duration: number; // in minutes
  type: 'phone' | 'video' | 'in-person';
  location?: string;
  interviewers?: string[];
  notes: string;
}

export interface Notification {
  id: string;
  type: 'interview-reminder' | 'follow-up' | 'deadline' | 'reapply' | 'ai-suggestion';
  title: string;
  message: string;
  date: Date;
  read: boolean;
  jobId?: string;
  actionable: boolean;
  action?: string;
}

export interface NotificationPreferences {
  interviewReminders: boolean;
  reminderTiming: number; // hours before
  followUpReminders: boolean;
  deadlineAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}