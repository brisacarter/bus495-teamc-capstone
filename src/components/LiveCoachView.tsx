import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Calendar,
  Clock,
  Star,
  Video,
  CheckCircle2,
  Crown,
  Lock,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScrollArea } from './ui/scroll-area';

export function LiveCoachView() {
  const { user } = useApp();
  const isPremium = user?.subscriptionTier === 'premium';

  return (
    <div className="h-full overflow-auto bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gray-900 mb-2">Live Career Coaching</h1>
          <p className="text-muted-foreground">
            Get personalized 1:1 coaching from experienced professionals
          </p>
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
          <Card className="p-8 md:p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-purple-600" />
              </div>
              <h2 className="mb-3 md:mb-4">Premium Feature</h2>
              <p className="text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
                Get personalized 1:1 coaching sessions with experienced career professionals. 
                Upgrade to Premium to unlock live coaching, detailed interview feedback, and priority support.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 text-left max-w-4xl mx-auto">
                <div className="p-3 md:p-4 bg-white border rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-sm font-medium">2 Live Coach sessions</p>
                </div>
                <div className="p-3 md:p-4 bg-white border rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-sm font-medium">6 Interview Prep sessions/month</p>
                </div>
                <div className="p-3 md:p-4 bg-white border rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-sm font-medium">Mock interview practice</p>
                </div>
                <div className="p-3 md:p-4 bg-white border rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mb-2" />
                  <p className="text-sm font-medium">Expert career guidance</p>
                </div>
              </div>

              <Button size="lg" className="bg-[#3E6BAF] hover:bg-[#2E5A9F] text-white">
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Premium
              </Button>
            </div>

            {/* Decorative Lock Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-30" />
            <Lock className="absolute top-4 right-4 w-6 h-6 md:w-8 md:h-8 text-gray-300" />
          </Card>
        )}
      </div>
    </div>
  );
}
