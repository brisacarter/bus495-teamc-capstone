import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Mic, Crown, Sparkles } from 'lucide-react';

interface InterviewPrepUpgradeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function InterviewPrepUpgradeModal({ 
  isOpen, 
  onOpenChange, 
  onUpgrade 
}: InterviewPrepUpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3E6BAF] to-[#5580C7] rounded-full flex items-center justify-center animate-pulse">
              <Mic className="w-10 h-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            You've used all your Interview Prep credits
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Upgrade to Premium to get 6 Interview Prep sessions, or add more sessions individually at $30/prep. 
            Continue preparing for interviews with AI coaching and personalized feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Visual illustration placeholder */}
          <div className="relative h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-12 h-12 bg-[#3E6BAF] rounded-full animate-bounce" />
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-purple-400 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Sparkles className="w-16 h-16 text-[#3E6BAF]" />
              </div>
            </div>
            <div className="relative z-10 text-center">
              <Crown className="w-12 h-12 text-[#3E6BAF] mx-auto mb-2" />
              <p className="text-sm text-gray-700">Upgrade to Premium or buy sessions</p>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">Premium Plan</span>
                <span className="text-lg font-bold text-[#3E6BAF]">$600/mo</span>
              </div>
              <p className="text-xs text-muted-foreground">6 Interview Prep sessions + 2 Live Coach sessions</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">Single Session</span>
                <span className="text-lg font-bold text-[#3E6BAF]">$30</span>
              </div>
              <p className="text-xs text-muted-foreground">Add one Interview Prep session to your account</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <Button 
              onClick={onUpgrade}
              className="w-full bg-[#3E6BAF] hover:bg-[#2E5A9F] text-white"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              View Plans & Add Credits
            </Button>
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
