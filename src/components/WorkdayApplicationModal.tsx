import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { 
  CheckCircle2, 
  FileText, 
  Briefcase,
  GraduationCap,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Eye,
  EyeOff,
  Shield,
  ExternalLink,
  Sparkles,
  Info,
  Globe,
  FileDown,
  Plus,
  Trash2
} from 'lucide-react';
import { JobLead } from '../types';
import { toast } from 'sonner@2.0.3';

interface WorkdayApplicationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobLead;
  onComplete: () => void;
}

type ApplicationStep = 'preview' | 'login' | 'submit' | 'confirmation';

export function WorkdayApplicationModal({ 
  isOpen, 
  onOpenChange, 
  job, 
  onComplete 
}: WorkdayApplicationModalProps) {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('preview');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasWorkdayAccount] = useState(false); // Mock - could be from user context
  const [showResumePreview, setShowResumePreview] = useState(false);
  
  // Mock user data - expanded to match Workday form fields
  const [userData, setUserData] = useState({
    fullName: 'John Doe',
    email: 'demo@jobtracker.com',
    phone: '+1 (555) 123-4567',
    mobilePhone: '+1 (555) 987-6543',
    addressLine1: '123 Market Street',
    addressLine2: 'Apt 4B',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    country: 'United States',
    linkedIn: 'linkedin.com/in/johndoe',
    website: 'www.johndoe.com',
    school: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    graduationYear: '2020',
    currentEmployer: 'TechCorp Inc.',
    currentTitle: 'Senior Software Engineer',
    yearsOfExperience: '5 years',
  });

  // Current employment state
  const [currentEmployment, setCurrentEmployment] = useState({
    company: 'TechCorp Inc.',
    title: 'Senior Software Engineer',
    startDate: 'January 2020',
    endDate: 'Current',
    description: 'Led cross-functional teams to deliver enterprise-scale applications serving 2M+ users. Architected microservices infrastructure reducing system latency by 40%.',
  });

  // Past employment state
  const [pastEmployment, setPastEmployment] = useState([
    {
      id: '1',
      company: 'StartupHub Technologies',
      title: 'Software Engineer',
      startDate: 'June 2018',
      endDate: 'December 2019',
      description: 'Built responsive web applications using React, TypeScript, and Node.js. Collaborated with product team to define technical requirements.',
    },
    {
      id: '2',
      company: 'Digital Solutions LLC',
      title: 'Junior Software Developer',
      startDate: 'July 2016',
      endDate: 'May 2018',
      description: 'Developed and maintained client-facing web applications. Fixed bugs and implemented new features based on user feedback.',
    },
  ]);

  // Mock employment history for resume preview
  const employmentHistory = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: 'January 2020',
      endDate: 'Present',
      responsibilities: [
        'Led cross-functional teams to deliver enterprise-scale applications serving 2M+ users',
        'Architected microservices infrastructure reducing system latency by 40%',
        'Implemented CI/CD pipelines improving deployment frequency by 300%',
        'Mentored 8 junior developers and conducted technical training sessions',
      ]
    },
    {
      title: 'Software Engineer',
      company: 'StartupHub Technologies',
      location: 'San Francisco, CA',
      startDate: 'June 2018',
      endDate: 'December 2019',
      responsibilities: [
        'Built responsive web applications using React, TypeScript, and Node.js',
        'Collaborated with product team to define technical requirements',
        'Optimized database queries resulting in 60% performance improvement',
        'Participated in code reviews and established coding standards',
      ]
    },
    {
      title: 'Junior Software Developer',
      company: 'Digital Solutions LLC',
      location: 'Oakland, CA',
      startDate: 'July 2016',
      endDate: 'May 2018',
      responsibilities: [
        'Developed and maintained client-facing web applications',
        'Fixed bugs and implemented new features based on user feedback',
        'Wrote unit tests achieving 85% code coverage',
        'Collaborated with designers to implement pixel-perfect UIs',
      ]
    }
  ];

  const [editingField, setEditingField] = useState<string | null>(null);
  
  // Auto-generated Workday password
  const workdayPassword = 'JobTrackr#2025!Secure';
  
  // Mock ATS score - increased to 96%
  const atsScore = 96;

  const handleFieldEdit = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
    setEditingField(null);
  };

  const handleAddPastEmployment = () => {
    const newEmployment = {
      id: Date.now().toString(),
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setPastEmployment([newEmployment, ...pastEmployment]);
  };

  const handleRemovePastEmployment = (id: string) => {
    setPastEmployment(pastEmployment.filter(emp => emp.id !== id));
  };

  const handleUpdatePastEmployment = (id: string, field: string, value: string) => {
    setPastEmployment(pastEmployment.map(emp => 
      emp.id === id ? { ...emp, [field]: value } : emp
    ));
  };

  const handleLoginAndApply = () => {
    setCurrentStep('login');
    setTimeout(() => {
      setCurrentStep('submit');
      setIsSubmitting(true);
      
      // Simulate submission
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep('confirmation');
      }, 3000);
    }, 2000);
  };

  const handleComplete = () => {
    onComplete();
    onOpenChange(false);
    setCurrentStep('preview');
  };

  const handleSaveAndExit = () => {
    toast.success('Resume preview saved for later review');
    onOpenChange(false);
    setCurrentStep('preview');
  };

  const getStepNumber = (step: ApplicationStep): number => {
    const steps = { preview: 1, login: 2, submit: 3, confirmation: 4 };
    return steps[step];
  };

  const renderProgressTracker = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        {(['preview', 'login', 'submit', 'confirmation'] as ApplicationStep[]).map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  getStepNumber(currentStep) >= getStepNumber(step)
                    ? 'bg-[#3E6BAF] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {getStepNumber(currentStep) > getStepNumber(step) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1 text-center">
                {step === 'preview' && 'Resume Format'}
                {step === 'login' && 'Login'}
                {step === 'submit' && 'Submit'}
                {step === 'confirmation' && 'Confirmation'}
              </span>
            </div>
            {index < 3 && (
              <div
                className={`h-0.5 flex-1 ${
                  getStepNumber(currentStep) > getStepNumber(step)
                    ? 'bg-[#3E6BAF]'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      {/* Header with ATS Score */}
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#3E6BAF]" />
          Workday Application Form
        </h4>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-600 hover:bg-green-700">
            ATS Score: {atsScore}%
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowResumePreview(true)}
                  className="hover:opacity-80 transition-opacity"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="2" fill="#DC1F26"/>
                    <path d="M6 6h12v12H6z" fill="#DC1F26"/>
                    <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" textAnchor="middle">PDF</text>
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View formatted resume</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {/* Personal Information Section - Accordion */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="personal-info" className="border-none">
                <AccordionTrigger className="px-0 py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-[#3E6BAF]">
                    <User className="w-4 h-4" />
                    <h5>Personal Information: {userData.fullName} • {userData.email}</h5>
                    <Edit3 className="w-3.5 h-3.5 ml-1 text-gray-400" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <Card className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Full Name</Label>
                        <Input
                          value={userData.fullName}
                          onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <Input
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <Input
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Mobile Phone</Label>
                        <Input
                          value={userData.mobilePhone}
                          onChange={(e) => setUserData({ ...userData, mobilePhone: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                        <Input
                          value={userData.linkedIn}
                          onChange={(e) => setUserData({ ...userData, linkedIn: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Website</Label>
                        <Input
                          value={userData.website}
                          onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Address Section - Accordion */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="address" className="border-none">
                <AccordionTrigger className="px-0 py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-[#3E6BAF]">
                    <MapPin className="w-4 h-4" />
                    <h5>Address: {userData.city}, {userData.state}, {userData.country}</h5>
                    <Edit3 className="w-3.5 h-3.5 ml-1 text-gray-400" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <Card className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Street Address</Label>
                        <Input
                          value={userData.addressLine1}
                          onChange={(e) => setUserData({ ...userData, addressLine1: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Address Line 2</Label>
                        <Input
                          value={userData.addressLine2}
                          onChange={(e) => setUserData({ ...userData, addressLine2: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">City</Label>
                        <Input
                          value={userData.city}
                          onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">State</Label>
                        <Input
                          value={userData.state}
                          onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Zip Code</Label>
                        <Input
                          value={userData.zipCode}
                          onChange={(e) => setUserData({ ...userData, zipCode: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Country</Label>
                        <Input
                          value={userData.country}
                          onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Education Section - Accordion */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="education" className="border-none">
                <AccordionTrigger className="px-0 py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-[#3E6BAF]">
                    <GraduationCap className="w-4 h-4" />
                    <h5>Education: {userData.degree}, {userData.school}</h5>
                    <Edit3 className="w-3.5 h-3.5 ml-1 text-gray-400" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <Card className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">School</Label>
                        <Input
                          value={userData.school}
                          onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Degree</Label>
                        <Input
                          value={userData.degree}
                          onChange={(e) => setUserData({ ...userData, degree: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Major</Label>
                        <Input
                          value={userData.major}
                          onChange={(e) => setUserData({ ...userData, major: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Graduation Year</Label>
                        <Input
                          value={userData.graduationYear}
                          onChange={(e) => setUserData({ ...userData, graduationYear: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator />

          {/* Current Employment Section - Accordion */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="current-employment" className="border-none">
                <AccordionTrigger className="px-0 py-2 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-2 text-[#3E6BAF]">
                      <Briefcase className="w-4 h-4" />
                      <h5>Current Employment: {currentEmployment.title} • {currentEmployment.company}</h5>
                      <Edit3 className="w-3.5 h-3.5 ml-1 text-gray-400" />
                    </div>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {currentEmployment.startDate} - {currentEmployment.endDate}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <Card className="p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Company</Label>
                        <Input
                          value={currentEmployment.company}
                          onChange={(e) => setCurrentEmployment({ ...currentEmployment, company: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Job Title</Label>
                        <Input
                          value={currentEmployment.title}
                          onChange={(e) => setCurrentEmployment({ ...currentEmployment, title: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Start Date</Label>
                        <Input
                          value={currentEmployment.startDate}
                          onChange={(e) => setCurrentEmployment({ ...currentEmployment, startDate: e.target.value })}
                          className="mt-1"
                          placeholder="e.g., January 2020"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">End Date</Label>
                        <Input
                          value={currentEmployment.endDate}
                          onChange={(e) => setCurrentEmployment({ ...currentEmployment, endDate: e.target.value })}
                          className="mt-1"
                          placeholder="Current or e.g., December 2023"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs text-muted-foreground">Description</Label>
                        <textarea
                          className="w-full mt-1 p-2 border rounded-md text-sm"
                          rows={3}
                          value={currentEmployment.description}
                          onChange={(e) => setCurrentEmployment({ ...currentEmployment, description: e.target.value })}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Separator />

          {/* Past Employment Section - Accordion */}
          <div>
            <Accordion type="single" collapsible defaultValue="past-employment">
              <AccordionItem value="past-employment" className="border-none">
                <AccordionTrigger className="px-0 py-2 hover:no-underline">
                  <div className="flex items-center gap-2 text-[#3E6BAF]">
                    <Briefcase className="w-4 h-4" />
                    <h5>Past Employment: {pastEmployment.length} previous position{pastEmployment.length !== 1 ? 's' : ''}</h5>
                    <Edit3 className="w-3.5 h-3.5 ml-1 text-gray-400" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="space-y-4">
                    {/* Add New Employment Button */}
                    <Button
                      variant="outline"
                      onClick={handleAddPastEmployment}
                      className="w-full border-dashed border-2 hover:border-[#3E6BAF] hover:bg-blue-50"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Past Employment
                    </Button>

                    {/* Past Employment List */}
                    {pastEmployment.map((employment, index) => (
                      <Card key={employment.id} className="p-4 bg-gray-50 relative">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h6 className="text-sm">Previous Position #{index + 1}</h6>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {employment.startDate && employment.endDate 
                                  ? `${employment.startDate} - ${employment.endDate}`
                                  : 'Dates not set'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePastEmployment(employment.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Company</Label>
                              <Input
                                value={employment.company}
                                onChange={(e) => handleUpdatePastEmployment(employment.id, 'company', e.target.value)}
                                className="mt-1"
                                placeholder="Company name"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Job Title</Label>
                              <Input
                                value={employment.title}
                                onChange={(e) => handleUpdatePastEmployment(employment.id, 'title', e.target.value)}
                                className="mt-1"
                                placeholder="Job title"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Start Date</Label>
                              <Input
                                value={employment.startDate}
                                onChange={(e) => handleUpdatePastEmployment(employment.id, 'startDate', e.target.value)}
                                className="mt-1"
                                placeholder="e.g., June 2018"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">End Date</Label>
                              <Input
                                value={employment.endDate}
                                onChange={(e) => handleUpdatePastEmployment(employment.id, 'endDate', e.target.value)}
                                className="mt-1"
                                placeholder="e.g., December 2019"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-xs text-muted-foreground">Key Responsibilities</Label>
                              <textarea
                                className="w-full mt-1 p-2 border rounded-md text-sm"
                                rows={3}
                                value={employment.description}
                                onChange={(e) => handleUpdatePastEmployment(employment.id, 'description', e.target.value)}
                                placeholder="Describe your key responsibilities and achievements..."
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ScrollArea>

      {/* ATS Compatibility Score */}
      <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-green-900 mb-2">ATS Compatibility</h4>
            <Progress value={atsScore} className="h-2 mb-2" />
            <p className="text-sm text-green-800">
              Your resume is <strong>{atsScore}%</strong> optimized for Workday parsing
            </p>
            <ul className="text-xs text-green-700 mt-2 space-y-1">
              <li>✓ All required fields detected</li>
              <li>✓ Contact information parsed correctly</li>
              <li>✓ Experience dates formatted properly</li>
              <li>✓ Education credentials verified</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderLoginStep = () => (
    <div className="space-y-4 py-8">
      <Card className="p-6 bg-gradient-to-br from-[#3E6BAF]/10 to-blue-50 border-[#3E6BAF]/30">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-[#3E6BAF] mt-0.5" />
          <div>
            <h4 className="text-[#3E6BAF] mb-2">Secure Workday Authentication</h4>
            <p className="text-sm text-gray-700 mb-4">
              {hasWorkdayAccount 
                ? 'Using your existing Workday account credentials...'
                : 'Creating secure temporary credentials for Workday application...'}
            </p>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-[#3E6BAF]" />
                  <span className="text-sm">{userData.email}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Auto-Generated Password</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 font-mono text-sm bg-white px-3 py-2 rounded border">
                    {showPassword ? workdayPassword : '••••••••••••••••'}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This password is temporary and will be masked after use
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Security Note:</strong> For your security, some Workday portals require you to finalize submission. 
            We'll handle the form filling and you'll confirm the final step.
          </p>
        </div>
      </Card>
    </div>
  );

  const renderSubmitStep = () => (
    <div className="space-y-4 py-8">
      <Card className="p-6 bg-gradient-to-br from-[#3E6BAF]/10 to-blue-50 border-[#3E6BAF]/30">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#3E6BAF]/20 flex items-center justify-center">
              {isSubmitting ? (
                <div className="w-8 h-8 border-4 border-[#3E6BAF] border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-[#3E6BAF]" />
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-[#3E6BAF] mb-2">
              {isSubmitting ? 'Submitting Application...' : 'Preparing Submission'}
            </h4>
            <p className="text-sm text-gray-600">
              {isSubmitting 
                ? 'Your application is being submitted to Workday. Please wait...'
                : 'Getting ready to submit your application'}
            </p>
          </div>

          {isSubmitting && (
            <div className="space-y-2 text-left">
              <Progress value={66} className="h-2" />
              <div className="space-y-1 text-xs text-gray-600">
                <p>✓ Authenticating with Workday</p>
                <p>✓ Uploading resume and documents</p>
                <p className="text-[#3E6BAF]">→ Finalizing submission...</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-4 py-8">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-green-900 mb-2">Application Submitted Successfully!</h4>
            <p className="text-sm text-green-800 mb-4">
              Your Workday application has been submitted successfully to <strong>{job.company}</strong>.
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-muted-foreground">Position:</span>
                <span>{job.title}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-muted-foreground">Company:</span>
                <span>{job.company}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-muted-foreground">Submitted:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded">
                <span className="text-muted-foreground">Confirmation:</span>
                <span className="font-mono text-xs">WD-{job.id.substring(0, 8).toUpperCase()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open('https://workday.com/dashboard', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Application Status on Workday
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="mb-1">
              <strong>Next Steps:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Check your email for Workday confirmation</li>
              <li>• Monitor your application status through the Workday portal</li>
              <li>• We'll send you a reminder to follow up in 7 days</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] md:min-w-[1080px] md:w-[1080px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3E6BAF] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            Workday Resume Preview
          </DialogTitle>
          <DialogDescription>
            {job.title} at {job.company}
          </DialogDescription>
        </DialogHeader>

        {renderProgressTracker()}

        {currentStep === 'preview' && renderPreviewStep()}
        {currentStep === 'login' && renderLoginStep()}
        {currentStep === 'submit' && renderSubmitStep()}
        {currentStep === 'confirmation' && renderConfirmationStep()}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          {currentStep === 'preview' && (
            <>
              <Button
                variant="outline"
                onClick={handleSaveAndExit}
                className="flex-1"
              >
                💾 Save & Exit
              </Button>
              <Button
                onClick={handleLoginAndApply}
                className="flex-1 bg-gradient-to-r from-[#3E6BAF] to-[#569ead] hover:opacity-90 text-white"
              >
                🔵 Log in & Apply via Workday
              </Button>
            </>
          )}
          
          {currentStep === 'confirmation' && (
            <Button
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Resume Preview Dialog */}
      <Dialog open={showResumePreview} onOpenChange={setShowResumePreview}>
        <DialogContent className="w-[95vw] md:min-w-[960px] md:w-[960px] max-w-none max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3E6BAF]" />
              Formatted Resume Preview
            </DialogTitle>
            <DialogDescription>
              This is how your resume will appear to Workday's ATS system
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6 p-6 bg-white border rounded-lg">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h1 className="text-2xl mb-2">{userData.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {userData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {userData.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {userData.city}, {userData.state}
                  </span>
                </div>
                {userData.linkedIn && (
                  <div className="flex justify-center gap-3 mt-2 text-sm">
                    <span className="text-[#3E6BAF]">{userData.linkedIn}</span>
                    {userData.website && <span className="text-[#3E6BAF]">{userData.website}</span>}
                  </div>
                )}
              </div>

              {/* Professional Summary */}
              <div>
                <h2 className="text-lg border-b pb-2 mb-3">Professional Summary</h2>
                <p className="text-sm text-muted-foreground">
                  {userData.currentTitle} with {userData.yearsOfExperience} of experience in software development. 
                  Proven track record of delivering high-quality solutions and leading technical initiatives across multiple organizations. 
                  Expert in full-stack development, system architecture, and team leadership with a passion for building scalable applications.
                </p>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-lg border-b pb-2 mb-3">Experience</h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {employmentHistory.map((job, index) => (
                    <AccordionItem key={index} value={`job-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex flex-col items-start text-left flex-1 pr-4">
                          <div className="flex justify-between items-start w-full mb-1">
                            <h3 className="font-medium">{job.title}</h3>
                            <span className="text-sm text-muted-foreground ml-4">{job.startDate} - {job.endDate}</span>
                          </div>
                          <p className="text-sm text-[#3E6BAF]">{job.company} • {job.location}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-3">
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          {job.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-lg border-b pb-2 mb-3">Education</h2>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{userData.degree} - {userData.major}</h3>
                    <span className="text-sm text-muted-foreground">{userData.graduationYear}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{userData.school}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-lg border-b pb-2 mb-3">Technical Skills</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Languages & Frameworks</p>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Next.js', 'Express.js', 'GraphQL'].map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Cloud & DevOps</p>
                    <div className="flex flex-wrap gap-2">
                      {['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'GitHub Actions'].map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Databases & Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {['PostgreSQL', 'MongoDB', 'Redis', 'Git', 'Jira', 'Figma', 'REST APIs'].map((skill) => (
                        <Badge key={skill} variant="outline" className="bg-gray-50">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg border-b pb-2 mb-3">Contact Information</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Address:</span>
                    <p>{userData.addressLine1}</p>
                    {userData.addressLine2 && <p>{userData.addressLine2}</p>}
                    <p>{userData.city}, {userData.state} {userData.zipCode}</p>
                    <p>{userData.country}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone Numbers:</span>
                    <p>{userData.phone}</p>
                    <p>{userData.mobilePhone}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowResumePreview(false)}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success('Resume downloaded as PDF');
                setShowResumePreview(false);
              }}
              className="flex-1 bg-[#3E6BAF]"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
