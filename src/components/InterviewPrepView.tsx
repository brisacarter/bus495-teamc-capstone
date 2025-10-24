import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Video, 
  Play, 
  Pause, 
  Square, 
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Star,
  RotateCcw,
  Crown,
  Lock,
  Sparkles,
  Circle,
  Smile,
  Zap,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Avatar } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type InterviewStage = 'intro' | 'behavioral' | 'technical' | 'wrapup';
type Frame = 'dashboard' | 'interview' | 'feedback' | 'coaching';

interface InterviewSession {
  id: string;
  date: string;
  score: number;
  duration: string;
  feedback: string;
}

interface Question {
  text: string;
  tone: string;
  stage: InterviewStage;
  evaluationFocus: string[];
}

interface LiveTip {
  message: string;
  icon: 'smile' | 'lightbulb' | 'zap' | 'target';
  type: 'info' | 'success' | 'warning';
}

const mockSessions: InterviewSession[] = [
  {
    id: '1',
    date: 'Oct 20, 2025',
    score: 78,
    duration: '28 min',
    feedback: 'Good technical depth, work on conciseness'
  },
  {
    id: '2',
    date: 'Oct 15, 2025',
    score: 64,
    duration: '32 min',
    feedback: 'Strong examples, improve confidence'
  },
  {
    id: '3',
    date: 'Oct 10, 2025',
    score: 71,
    duration: '25 min',
    feedback: 'Clear communication, add more metrics'
  },
];

// Question bank with tone and pacing
const questionBank: Question[] = [
  {
    text: "Hi there! Welcome back. I'll be your AI interviewer today. This mock interview will last about 30 minutes and includes technical and behavioral questions tailored to your past applications.",
    tone: "warm",
    stage: 'intro',
    evaluationFocus: []
  },
  {
    text: "Let's start easy — tell me a bit about your background and what excites you most about this role.",
    tone: "enthusiastic",
    stage: 'intro',
    evaluationFocus: ['Confidence & energy', 'Verbal clarity', 'Structure']
  },
  {
    text: "Why are you interested in joining a company like this?",
    tone: "enthusiastic",
    stage: 'intro',
    evaluationFocus: ['Passion', 'Research', 'Clarity']
  },
  {
    text: "Tell me about a time you faced a major challenge at work. How did you handle it?",
    tone: "slow",
    stage: 'behavioral',
    evaluationFocus: ['STAR format', 'Problem-solving', 'Emotional intelligence']
  },
  {
    text: "Describe a situation where you had to collaborate with a difficult teammate. What did you learn?",
    tone: "slow",
    stage: 'behavioral',
    evaluationFocus: ['Empathy', 'Conflict resolution', 'Growth mindset']
  },
  {
    text: "Let's talk about your technical skills. How have you applied your expertise in past projects?",
    tone: "serious",
    stage: 'technical',
    evaluationFocus: ['Technical depth', 'Clear explanation', 'Impact metrics']
  },
  {
    text: "What's one technical decision you made that improved performance or scalability?",
    tone: "serious",
    stage: 'technical',
    evaluationFocus: ['Decision-making', 'Technical reasoning', 'Results']
  },
  {
    text: "Finally, do you have any questions for me as your interviewer?",
    tone: "warm",
    stage: 'wrapup',
    evaluationFocus: ['Engagement', 'Curiosity', 'Preparation']
  },
  {
    text: "That's the end of our mock session. How do you feel it went?",
    tone: "warm",
    stage: 'wrapup',
    evaluationFocus: ['Self-awareness', 'Reflection']
  }
];

// Live tips that appear during interview
const liveTips: LiveTip[] = [
  { message: 'Smile — first impressions matter!', icon: 'smile', type: 'info' },
  { message: 'Maintain eye contact with the camera', icon: 'target', type: 'info' },
  { message: 'Keep answers concise, ideally under 2 minutes', icon: 'lightbulb', type: 'info' },
  { message: 'Try structuring your response using STAR', icon: 'lightbulb', type: 'info' },
  { message: 'Great use of examples — keep that up!', icon: 'zap', type: 'success' },
  { message: 'You\'re speaking quickly — slow your pace slightly', icon: 'lightbulb', type: 'warning' },
  { message: 'Avoid reading from notes', icon: 'target', type: 'info' },
  { message: 'Use measurable examples if possible', icon: 'lightbulb', type: 'info' },
];

export function InterviewPrepView() {
  const { user } = useApp();
  const [currentFrame, setCurrentFrame] = useState<Frame>('dashboard');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStage, setCurrentStage] = useState<InterviewStage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [currentScore] = useState(82);
  const [previousScore] = useState(74);
  const [showConfetti, setShowConfetti] = useState(false);
  const [avatarSpeaking, setAvatarSpeaking] = useState(false);
  const [currentTip, setCurrentTip] = useState<LiveTip>(liveTips[0]);
  const [questionsAsked, setQuestionsAsked] = useState(3);
  const [avgResponseTime, setAvgResponseTime] = useState('2m 15s');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const isPremium = user?.subscriptionTier === 'premium';
  const hasCredits = (user?.interviewPrepCredits || 0) > 0 || user?.subscriptionTier === 'premium';

  // Filter questions by current stage
  const currentQuestions = questionBank.filter(q => q.stage === currentStage);
  const currentQuestion = currentQuestions[currentQuestionIndex] || currentQuestions[0];

  // Timer effect when recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Rotate tips every 15 seconds during interview
  useEffect(() => {
    if (isRecording && !isPaused) {
      const tipInterval = setInterval(() => {
        const randomTip = liveTips[Math.floor(Math.random() * liveTips.length)];
        setCurrentTip(randomTip);
      }, 15000);
      return () => clearInterval(tipInterval);
    }
  }, [isRecording, isPaused]);

  // Avatar speaking animation effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      // Simulate avatar speaking for first 5 seconds of each question
      setAvatarSpeaking(true);
      const timeout = setTimeout(() => setAvatarSpeaking(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [currentQuestionIndex, isRecording, isPaused]);

  // Analysis progress animation
  useEffect(() => {
    if (showAnalyzing) {
      setAnalysisProgress(0);
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showAnalyzing]);

  const handleStartInterview = () => {
    setCurrentFrame('interview');
    setCurrentStage('intro');
    setCurrentQuestionIndex(0);
    setTimeElapsed(0);
    setQuestionsAsked(0);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setAvatarSpeaking(true);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionsAsked(prev => prev + 1);
    } else {
      // Move to next stage
      const stages: InterviewStage[] = ['intro', 'behavioral', 'technical', 'wrapup'];
      const currentIndex = stages.indexOf(currentStage);
      if (currentIndex < stages.length - 1) {
        setCurrentStage(stages[currentIndex + 1]);
        setCurrentQuestionIndex(0);
        setQuestionsAsked(prev => prev + 1);
      }
    }
  };

  const handleEndInterview = () => {
    setIsRecording(false);
    setShowAnalyzing(true);
    
    setTimeout(() => {
      setShowAnalyzing(false);
      setCurrentFrame('feedback');
      if (currentScore > previousScore) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 5000);
  };

  const handleViewResults = (sessionId: string) => {
    setCurrentFrame('feedback');
  };

  const handleBookCoaching = () => {
    setCurrentFrame('coaching');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-green-500';
    return 'from-red-400 to-yellow-500';
  };

  const getTipIcon = (iconType: string) => {
    switch (iconType) {
      case 'smile': return <Smile className="w-3 h-3" />;
      case 'zap': return <Zap className="w-3 h-3" />;
      case 'target': return <Target className="w-3 h-3" />;
      default: return <Lightbulb className="w-3 h-3" />;
    }
  };

  const getTipColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-900/30 border-green-700 text-green-200';
      case 'warning': return 'bg-yellow-900/30 border-yellow-700 text-yellow-200';
      default: return 'bg-blue-900/30 border-blue-700 text-blue-200';
    }
  };

  const stages: { id: InterviewStage; label: string }[] = [
    { id: 'intro', label: 'Introduction' },
    { id: 'behavioral', label: 'Behavioral' },
    { id: 'technical', label: 'Technical' },
    { id: 'wrapup', label: 'Wrap-up' },
  ];

  const getToneIndicator = (tone: string) => {
    switch (tone) {
      case 'warm': return '💙';
      case 'enthusiastic': return '⚡';
      case 'serious': return '🎯';
      case 'slow': return '🤔';
      default: return '💬';
    }
  };

  // FRAME 1: Dashboard
  if (currentFrame === 'dashboard') {
    return (
      <div className="h-full overflow-auto bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Interview Preparation</h1>
              <p className="text-muted-foreground">
                Practice your interviews, get AI feedback, and improve your skills.
              </p>
            </div>
            {user?.subscriptionTier !== 'free' && (
              <Badge variant="outline" className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                {user?.subscriptionTier === 'premium' 
                  ? '∞ Credits' 
                  : `${user?.interviewPrepCredits || 0} Credits`
                }
              </Badge>
            )}
          </div>

          {/* Start Interview CTA */}
          <Card className="p-8 bg-gradient-to-r from-[#3E6BAF] to-[#5580C7] text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-white mb-2">Ready to practice?</h2>
                <p className="text-blue-100">
                  Start an AI-powered mock interview and receive instant feedback to improve your performance.
                </p>
              </div>
              <Button 
                onClick={handleStartInterview}
                size="lg"
                className="bg-white text-[#3E6BAF] hover:bg-blue-50 flex-shrink-0"
              >
                <Video className="w-5 h-5 mr-2" />
                Start AI Interview
              </Button>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Progress Overview */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#3E6BAF]" />
                Your Progress
              </h3>
              
              <div className="flex flex-col items-center py-6">
                {/* Circular Progress */}
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(currentScore / 100) * 351.86} 351.86`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" className="text-red-500" stopColor="currentColor" />
                        <stop offset="50%" className="text-yellow-500" stopColor="currentColor" />
                        <stop offset="100%" className="text-green-500" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl ${getScoreColor(currentScore)}`}>
                      {currentScore}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{currentScore - previousScore}% improvement</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Since last session</p>
                </div>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 md:col-span-2">
              <h3 className="mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#3E6BAF]" />
                Interview Tips
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#3E6BAF] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-gray-900 mb-1">Use the STAR Method</h4>
                      <p className="text-sm text-muted-foreground">
                        Structure your answers: Situation, Task, Action, Result. This helps you tell complete, compelling stories about your experience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-gray-900 mb-1">Practice Makes Perfect</h4>
                      <p className="text-sm text-muted-foreground">
                        "Success is where preparation and opportunity meet." — Regular practice builds confidence and helps you refine your delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Past Sessions */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3E6BAF]" />
              Past Interview Sessions
            </h3>
            
            <div className="space-y-3">
              {mockSessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`text-2xl ${getScoreColor(session.score)}`}>
                      {session.score}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{session.date}</p>
                        <Badge variant="outline" className="text-xs">
                          {session.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {session.feedback}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewResults(session.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // FRAME 2: AI Interview (Live Recording)
  if (currentFrame === 'interview') {
    return (
      <div className="h-full bg-gray-900 flex flex-col">
        {/* Analyzing Modal */}
        <Dialog open={showAnalyzing} onOpenChange={() => {}}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#3E6BAF] animate-pulse" />
                Analyzing Your Responses...
              </DialogTitle>
              <DialogDescription>
                Our AI is evaluating your performance. This will take a few moments.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <Progress value={analysisProgress} className="h-2" />
              <div className="space-y-2 mt-4">
                <p className="text-sm text-muted-foreground text-center">
                  {analysisProgress < 33 && 'Processing speech patterns and tone...'}
                  {analysisProgress >= 33 && analysisProgress < 66 && 'Analyzing body language and confidence...'}
                  {analysisProgress >= 66 && 'Generating personalized feedback...'}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-white">AI Mock Interview</h2>
              {isRecording && (
                <Badge className="bg-red-600 animate-pulse">
                  <Circle className="w-2 h-2 mr-1 fill-white" />
                  Recording
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="tabular-nums">
                  {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')} / 30:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid md:grid-cols-3 gap-4 p-4 overflow-hidden">
          {/* Left: AI Avatar */}
          <Card className="bg-gray-800 border-gray-700 p-6 flex flex-col">
            <h3 className="text-white mb-4 flex items-center gap-2">
              AI Interviewer
              <span className="text-lg">{getToneIndicator(currentQuestion?.tone || 'warm')}</span>
            </h3>
            
            {/* Avatar Placeholder */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-[#3E6BAF] to-[#5580C7] flex items-center justify-center relative transition-all duration-300 ${
                avatarSpeaking ? 'scale-105' : 'scale-100'
              }`}>
                <MessageSquare className="w-16 h-16 text-white" />
                {avatarSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Current Question */}
            <div className={`bg-gray-700 rounded-lg p-4 transition-all duration-500 ${
              avatarSpeaking ? 'ring-2 ring-blue-400' : ''
            }`}>
              <p className="text-xs text-gray-400 mb-2">Current Question:</p>
              <p className="text-white text-sm leading-relaxed">
                "{currentQuestion?.text}"
              </p>
              
              {currentQuestion?.evaluationFocus.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400 mb-1">Evaluation Focus:</p>
                  <div className="flex flex-wrap gap-1">
                    {currentQuestion.evaluationFocus.map((focus, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-gray-800 text-gray-300 border-gray-600">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Tips */}
            <div className={`mt-4 p-3 rounded-lg border transition-all duration-500 ${getTipColor(currentTip.type)}`}>
              <p className="text-xs flex items-center gap-2">
                {getTipIcon(currentTip.icon)}
                <span>{currentTip.message}</span>
              </p>
            </div>

            {/* Next Question Button (for demo purposes) */}
            {isRecording && !isPaused && (
              <Button
                onClick={handleNextQuestion}
                variant="outline"
                size="sm"
                className="mt-3 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                Next Question
              </Button>
            )}
          </Card>

          {/* Center: User Webcam */}
          <Card className="bg-gray-800 border-gray-700 p-6 flex flex-col">
            <h3 className="text-white mb-4">Your Video</h3>
            
            {/* Webcam Preview Placeholder */}
            <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500">Camera Preview</p>
                <p className="text-sm text-gray-600 mt-1">Your webcam feed appears here</p>
              </div>
              
              {/* Recording Indicator */}
              {isRecording && !isPaused && (
                <div className="absolute top-4 right-4">
                  <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse" />
                </div>
              )}

              {/* Visual feedback overlay */}
              {isRecording && !isPaused && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs text-white">
                    <div className="flex items-center justify-between mb-1">
                      <span>Posture</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="w-2 h-2 bg-gray-600 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Eye Contact</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <div className="w-2 h-2 bg-gray-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {!isRecording ? (
                <Button 
                  onClick={handleStartRecording}
                  className="bg-[#3E6BAF] hover:bg-[#2E5A9F]"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handlePauseRecording}
                    variant="outline"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleEndInterview}
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    End Interview
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Right: Stage Tracker */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <h3 className="text-white mb-4">Interview Stages</h3>
            
            <div className="space-y-3">
              {stages.map((stage, index) => {
                const isActive = stage.id === currentStage;
                const isCompleted = stages.findIndex(s => s.id === currentStage) > index;
                
                return (
                  <div 
                    key={stage.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-[#3E6BAF] border-[#3E6BAF] text-white' 
                        : isCompleted
                        ? 'bg-green-900/30 border-green-700 text-green-200'
                        : 'bg-gray-700 border-gray-600 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          isActive ? 'bg-white text-[#3E6BAF]' : 'bg-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                      <span className="text-sm">{stage.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4 bg-gray-700" />

            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center justify-between">
                <span>Questions Asked:</span>
                <span className="text-white">{questionsAsked} / 8</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Avg Response Time:</span>
                <span className="text-white">{avgResponseTime}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Confidence Score:</span>
                <span className="text-green-400">78%</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // FRAME 3: Feedback & Scoring
  if (currentFrame === 'feedback') {
    return (
      <div className="h-full overflow-auto bg-gray-50 p-4 md:p-8">
        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10%`,
                  animation: `fall ${2 + Math.random() * 2}s linear`,
                  fontSize: `${20 + Math.random() * 20}px`,
                }}
              >
                🎉
              </div>
            ))}
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Your Interview Results</h1>
              <p className="text-muted-foreground">
                Detailed AI analysis of your performance
              </p>
            </div>
            <Button variant="outline" onClick={() => setCurrentFrame('dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          {/* Score Section */}
          <Card className={`p-8 bg-gradient-to-br ${getScoreGradient(currentScore)}`}>
            <div className="text-center text-white">
              <h2 className="text-white mb-2">Overall Score</h2>
              <div className="text-7xl my-4">{currentScore}</div>
              <p className="text-xl text-white/90">out of 100</p>
              
              {currentScore > previousScore && (
                <div className="mt-4 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <TrendingUp className="w-5 h-5" />
                  <span>+{currentScore - previousScore} points improvement!</span>
                </div>
              )}
            </div>
          </Card>

          {/* Performance Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#3E6BAF]" />
                </div>
                <h3>Communication</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl text-[#3E6BAF]">8.5</span>
                <span className="text-muted-foreground pb-1">/ 10</span>
              </div>
              <Progress value={85} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Clear and articulate responses
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3>Confidence</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl text-green-600">7.8</span>
                <span className="text-muted-foreground pb-1">/ 10</span>
              </div>
              <Progress value={78} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Strong presence, minor hesitations
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <h3>Content Quality</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl text-purple-600">9.2</span>
                <span className="text-muted-foreground pb-1">/ 10</span>
              </div>
              <Progress value={92} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Excellent examples with metrics
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-orange-600" />
                </div>
                <h3>Body Language</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl text-orange-600">7.0</span>
                <span className="text-muted-foreground pb-1">/ 10</span>
              </div>
              <Progress value={70} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Good posture, work on eye contact
              </p>
            </Card>
          </div>

          {/* Video Highlights */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#3E6BAF]" />
              Key Moments to Review
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { time: '2:15', title: 'Strong STAR Answer', type: 'positive', description: 'Behavioral question' },
                { time: '8:42', title: 'Hesitation on Technical Q', type: 'neutral', description: 'Technical depth' },
                { time: '14:20', title: 'Excellent Closing', type: 'positive', description: 'Final impression' },
              ].map((moment, index) => (
                <div 
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg border bg-gray-900 hover:ring-2 hover:ring-[#3E6BAF] transition-all"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/70 text-white">
                      {moment.time}
                    </Badge>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm mb-1">{moment.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{moment.description}</p>
                    <div className="mt-1">
                      {moment.type === 'positive' ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Strength
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Review
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Detailed Feedback */}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#3E6BAF]" />
              AI Feedback & Recommendations
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm mb-1">Excellent Use of STAR Method</h4>
                  <p className="text-sm text-muted-foreground">
                    Your answers were well-structured with clear situations, tasks, actions, and results. Keep using this framework.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm mb-1">Strong Quantitative Examples</h4>
                  <p className="text-sm text-muted-foreground">
                    You included specific metrics and numbers (e.g., "reduced latency by 40%") which makes your impact clear and credible.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm mb-1">Improve Eye Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    Try to look directly at the camera more often. This creates better connection with interviewers in virtual settings.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm mb-1">Reduce Filler Words</h4>
                  <p className="text-sm text-muted-foreground">
                    You used "um" and "like" 12 times. Practice pausing silently instead — it shows confidence and gives you time to think.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleStartInterview}
              size="lg"
              variant="outline"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Practice Again
            </Button>
            <Button 
              onClick={handleBookCoaching}
              size="lg"
              className="bg-[#3E6BAF] hover:bg-[#2E5A9F]"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book Live Coach
            </Button>
          </div>
        </div>

        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // FRAME 4: Live Career Coach
  if (currentFrame === 'coaching') {
    return (
      <div className="h-full overflow-auto bg-gray-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Live Career Coaching</h1>
              <p className="text-muted-foreground">
                Get personalized 1:1 coaching from experienced professionals
              </p>
            </div>
            <Button variant="outline" onClick={() => setCurrentFrame('dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          {isPremium ? (
            <>
              {/* Coach Profiles */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: 'Sarah Johnson',
                    specialty: 'Tech Industry Expert',
                    experience: '15 years in FAANG recruiting',
                    rating: 4.9,
                    sessions: 234,
                    initials: 'SJ',
                  },
                  {
                    name: 'Michael Chen',
                    specialty: 'Career Transitions',
                    experience: 'Former Amazon Engineering Manager',
                    rating: 4.8,
                    sessions: 189,
                    initials: 'MC',
                  },
                ].map((coach, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#3E6BAF] to-[#5580C7] rounded-full flex items-center justify-center text-white text-xl flex-shrink-0">
                        {coach.initials}
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1">{coach.name}</h3>
                        <p className="text-sm text-[#3E6BAF] mb-2">{coach.specialty}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {coach.experience}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span>{coach.rating}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {coach.sessions} sessions
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Calendar Booking */}
              <Card className="p-6">
                <h3 className="mb-4">Schedule Your Session</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Calendar (Simplified) */}
                  <div>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4>October 2025</h4>
                      </div>
                      <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                          <div key={i} className="text-muted-foreground py-2">
                            {day}
                          </div>
                        ))}
                        {[...Array(31)].map((_, i) => (
                          <button
                            key={i}
                            className={`py-2 rounded hover:bg-gray-100 transition-colors ${
                              i + 1 === 25 || i + 1 === 28
                                ? 'bg-[#3E6BAF] text-white hover:bg-[#2E5A9F]'
                                : i + 1 < 24
                                ? 'text-muted-foreground cursor-not-allowed'
                                : ''
                            }`}
                            disabled={i + 1 < 24}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 className="mb-4">Available Times (Oct 25)</h4>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2 pr-4">
                        {[
                          '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
                          '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
                        ].map((time, index) => (
                          <Button
                            key={index}
                            variant={index === 5 ? 'default' : 'outline'}
                            className={index === 5 ? 'w-full justify-start bg-[#3E6BAF]' : 'w-full justify-start'}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Selected: Tuesday, Oct 25 at 3:00 PM</p>
                    <p className="text-sm text-muted-foreground">60-minute session with Sarah Johnson</p>
                  </div>
                  <Button className="bg-[#3E6BAF] hover:bg-[#2E5A9F]">
                    Confirm Booking
                  </Button>
                </div>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="p-6">
                <h3 className="mb-4">Your Upcoming Sessions</h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">Session with Sarah Johnson</h4>
                        <p className="text-sm text-muted-foreground">
                          Tuesday, Oct 25, 2025 at 3:00 PM
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Topic: Technical Interview Preparation
                        </p>
                      </div>
                      <Button size="sm" disabled className="bg-gray-300 flex-shrink-0">
                        <Video className="w-4 h-4 mr-2" />
                        Join (Starts in 2 days)
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            // Non-Premium Users
            <Card className="p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#3E6BAF] to-[#5580C7] rounded-full flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h2 className="mb-4">Premium Feature</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Get personalized 1:1 coaching sessions with experienced career professionals. 
                  Upgrade to Premium to unlock live coaching, detailed interview feedback, and priority support.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8 text-left max-w-3xl mx-auto">
                  <div className="p-4 bg-white border rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm">4 coaching sessions/month</p>
                  </div>
                  <div className="p-4 bg-white border rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm">Expert career guidance</p>
                  </div>
                  <div className="p-4 bg-white border rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-sm">Mock interview practice</p>
                  </div>
                </div>

                <Button size="lg" className="bg-[#3E6BAF] hover:bg-[#2E5A9F]">
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium - $4.99/month
                </Button>
              </div>

              {/* Decorative Lock Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-50" />
              <Lock className="absolute top-4 right-4 w-8 h-8 text-gray-300" />
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}
