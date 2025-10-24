import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  User, 
  Briefcase, 
  FileText, 
  Upload,
  Trash2,
  CheckCircle,
  Shield,
  Mail,
  Camera,
  Mic,
  CreditCard
} from 'lucide-react';
import { SeniorityLevel } from '../types';
import { PdfExportDialog } from './PdfExportDialog';

export function ProfileView() {
  const { user, updateUser } = useApp();
  const [accountData, setAccountData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    jobInterests: user?.profile.jobInterests.join(', ') || '',
    seniorityLevel: user?.profile.seniorityLevel || 'mid-level',
    careerGoalsShort: user?.profile.careerGoalsShort || '',
    careerGoalsLong: user?.profile.careerGoalsLong || '',
    salaryMin: user?.profile.salaryMin || 0,
    salaryMax: user?.profile.salaryMax || 0,
  });
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: '',
    nameOnCard: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cardSaved, setCardSaved] = useState(false);

  const handleAccountSave = () => {
    if (user) {
      updateUser({
        username: accountData.username,
        email: accountData.email,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSaveCreditCard = () => {
    if (creditCardInfo.cardNumber && creditCardInfo.nameOnCard && creditCardInfo.expiryDate && creditCardInfo.cvv) {
      setCardSaved(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      // In a real app, this would securely save to a payment processor
    }
  };

  const handleProfileSave = () => {
    if (user) {
      updateUser({
        profile: {
          ...user.profile,
          jobInterests: profileData.jobInterests.split(',').map(s => s.trim()).filter(Boolean),
          seniorityLevel: profileData.seniorityLevel as SeniorityLevel,
          careerGoalsShort: profileData.careerGoalsShort,
          careerGoalsLong: profileData.careerGoalsLong,
          salaryMin: profileData.salaryMin,
          salaryMax: profileData.salaryMax,
        },
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggle2FA = () => {
    if (user) {
      updateUser({ twoFactorEnabled: !user.twoFactorEnabled });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
      const newResume = {
        id: `r${Date.now()}`,
        name: file.name,
        uploadDate: new Date(),
        fileType,
        isActive: true,
      };
      
      // Set all other resumes to inactive
      const updatedResumes = user.profile.resumes.map(r => ({ ...r, isActive: false }));
      
      updateUser({
        profile: {
          ...user.profile,
          resumes: [...updatedResumes, newResume],
        },
      });
    }
  };

  const setActiveResume = (resumeId: string) => {
    if (user) {
      const updatedResumes = user.profile.resumes.map(r => ({
        ...r,
        isActive: r.id === resumeId,
      }));
      updateUser({
        profile: {
          ...user.profile,
          resumes: updatedResumes,
        },
      });
    }
  };

  const deleteResume = (resumeId: string) => {
    if (user && confirm('Are you sure you want to delete this resume?')) {
      const updatedResumes = user.profile.resumes.filter(r => r.id !== resumeId);
      updateUser({
        profile: {
          ...user.profile,
          resumes: updatedResumes,
        },
      });
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and professional information
        </p>
      </div>

      {saveSuccess && (
        <Card className="p-3 md:p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <p>Changes saved successfully!</p>
          </div>
        </Card>
      )}

      <Tabs defaultValue="professional" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="professional">
            <Briefcase className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Professional</span>
          </TabsTrigger>
          <TabsTrigger value="resume">
            <FileText className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Resume</span>
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <Card className="p-4 md:p-6">
            <h3 className="mb-6">Account Settings</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={accountData.username}
                  onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={accountData.currentPassword}
                      onChange={(e) => setAccountData({ ...accountData, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={accountData.newPassword}
                      onChange={(e) => setAccountData({ ...accountData, newPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={accountData.confirmPassword}
                      onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4">Payment Information</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Securely store your payment method for faster checkout
                </p>

                {cardSaved && (
                  <Card className="p-3 md:p-4 mb-4 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-green-900">Payment method saved</p>
                          <p className="text-xs text-green-700">
                            {creditCardInfo.nameOnCard} • •••• {creditCardInfo.cardNumber.slice(-4)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setCardSaved(false);
                          setCreditCardInfo({
                            cardNumber: '',
                            nameOnCard: '',
                            expiryDate: '',
                            cvv: '',
                            saveCard: false,
                          });
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </Card>
                )}

                {!cardSaved && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            className="pl-10"
                            value={creditCardInfo.cardNumber}
                            onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cardNumber: e.target.value })}
                            maxLength={19}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name-on-card">Name on Card</Label>
                        <Input
                          id="name-on-card"
                          placeholder="John Doe"
                          value={creditCardInfo.nameOnCard}
                          onChange={(e) => setCreditCardInfo({ ...creditCardInfo, nameOnCard: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiry-date">Expiry Date</Label>
                        <Input
                          id="expiry-date"
                          placeholder="MM/YY"
                          value={creditCardInfo.expiryDate}
                          onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiryDate: e.target.value })}
                          maxLength={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={creditCardInfo.cvv}
                          onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleSaveCreditCard}
                      variant="outline"
                      className="w-full"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Save Payment Method
                    </Button>

                    <Card className="p-3 bg-gray-50 border-gray-200">
                      <div className="flex gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">
                          Your payment information is encrypted and securely stored. We never store your CVV.
                        </p>
                      </div>
                    </Card>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-5 h-5" />
                      <Label htmlFor="2fa" className="cursor-pointer">
                        Two-Factor Authentication
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="2fa"
                    checked={user?.twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
                
                {user?.twoFactorEnabled && (
                  <Card className="mt-4 p-3 md:p-4 bg-blue-50 border-blue-200">
                    <p className="text-sm text-blue-900">
                      Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when signing in.
                    </p>
                  </Card>
                )}
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4">Interview Prep Permissions</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Camera className="w-5 h-5" />
                        <Label htmlFor="camera" className="cursor-pointer">
                          Camera Access
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow access to camera for interview practice
                      </p>
                    </div>
                    <Switch
                      id="camera"
                      checked={user?.cameraPermission || false}
                      onCheckedChange={(checked) => updateUser({ cameraPermission: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mic className="w-5 h-5" />
                        <Label htmlFor="microphone" className="cursor-pointer">
                          Microphone Access
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow access to microphone for interview practice
                      </p>
                    </div>
                    <Switch
                      id="microphone"
                      checked={user?.microphonePermission || false}
                      onCheckedChange={(checked) => updateUser({ microphonePermission: checked })}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleAccountSave} className="w-full">
                Save Account Settings
              </Button>

              {/* PDF Export Section */}
              <div className="border-t pt-6">
                <h4 className="mb-4">Export Data</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your job search data and application screens to PDF for your records or to share with career advisors.
                </p>
                <PdfExportDialog />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Professional Profile */}
        <TabsContent value="professional">
          <Card className="p-4 md:p-6">
            <h3 className="mb-6">Professional Profile</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job-interests">Job Interests</Label>
                <Input
                  id="job-interests"
                  placeholder="e.g. Software Development, Product Management"
                  value={profileData.jobInterests}
                  onChange={(e) => setProfileData({ ...profileData, jobInterests: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of your job interests
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seniority">Seniority Level</Label>
                <Select
                  value={profileData.seniorityLevel}
                  onValueChange={(value) => setProfileData({ ...profileData, seniorityLevel: value })}
                >
                  <SelectTrigger id="seniority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry Level</SelectItem>
                    <SelectItem value="mid-level">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals-short">Short-term Career Goals</Label>
                <Textarea
                  id="goals-short"
                  rows={3}
                  placeholder="What are your career goals for the next 1-2 years?"
                  value={profileData.careerGoalsShort}
                  onChange={(e) => setProfileData({ ...profileData, careerGoalsShort: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals-long">Long-term Career Goals</Label>
                <Textarea
                  id="goals-long"
                  rows={3}
                  placeholder="What are your career goals for the next 5+ years?"
                  value={profileData.careerGoalsLong}
                  onChange={(e) => setProfileData({ ...profileData, careerGoalsLong: e.target.value })}
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4">Desired Salary Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary-min">Minimum</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="salary-min"
                        type="number"
                        className="pl-7"
                        placeholder="100000"
                        value={profileData.salaryMin || ''}
                        onChange={(e) => setProfileData({ ...profileData, salaryMin: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary-max">Maximum</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="salary-max"
                        type="number"
                        className="pl-7"
                        placeholder="150000"
                        value={profileData.salaryMax || ''}
                        onChange={(e) => setProfileData({ ...profileData, salaryMax: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleProfileSave} className="w-full">
                Save Professional Profile
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Resume Management */}
        <TabsContent value="resume">
          <Card className="p-4 md:p-6">
            <h3 className="mb-6">Resume Management</h3>
            
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h4 className="mb-2">Upload New Resume</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: PDF, DOCX (Max 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>

              {/* Resume List */}
              {user && user.profile.resumes.length > 0 && (
                <div className="space-y-3">
                  <h4>Your Resumes</h4>
                  {user.profile.resumes.map((resume) => (
                    <Card key={resume.id} className="p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate">{resume.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          {resume.isActive && (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!resume.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveResume(resume.id)}
                            >
                              Set Active
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteResume(resume.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Version History Info */}
              <Card className="p-3 md:p-4 bg-blue-50 border-blue-200">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-900 mb-1">Resume Version History</h4>
                    <p className="text-sm text-blue-800">
                      Keep track of different resume versions. The active resume will be used when you apply to jobs.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}