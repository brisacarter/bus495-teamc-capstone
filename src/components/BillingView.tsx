import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Check, 
  Crown,
  Mic,
  Users,
  TrendingUp,
  ShoppingCart,
  Minus,
  Plus
} from 'lucide-react';

export function BillingView() {
  const { user } = useApp();
  const [interviewPrepCount, setInterviewPrepCount] = useState(0);
  const [liveCoachCount, setLiveCoachCount] = useState(0);

  const cartTotal = (interviewPrepCount * 90) + (liveCoachCount * 250);
  const cartItems = [];
  if (interviewPrepCount > 0) cartItems.push({ name: 'Interview Prep Session', count: interviewPrepCount, price: 90 });
  if (liveCoachCount > 0) cartItems.push({ name: 'Live Coach Session', count: liveCoachCount, price: 250 });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Upgrade your account to unlock more interview Prep sessions and coaching support
        </p>
      </div>

      {/* Monthly Subscription Plans */}
      <div className="mb-12">
        <h3 className="mb-4">Monthly Subscription Plans</h3>
        <p className="text-sm text-muted-foreground mb-6">Choose a plan that fits your job-search needs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Freemium Plan */}
          <Card className="p-6 relative">
            <div className="flex flex-col h-full">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="mb-2">Freemium</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">Perfect for getting started with job search tracking</p>
              </div>
              
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Submit up to 5 resumes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Access calendar and application tracking</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Basic job search insights</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Email notifications</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-4 h-4 mt-0.5 flex-shrink-0"></span>
                  <span>No Interview Prep (Access)</span>
                </li>
              </ul>

              <Button className="w-full" variant="outline">
                Current Plan
              </Button>
            </div>
          </Card>

          {/* Pro Plan */}
          <Card className="p-6 relative border-2 border-[#5B8DEF]">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5B8DEF] text-white">
              Popular
            </Badge>
            
            <div className="flex flex-col h-full">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#5B8DEF]/10 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-[#5B8DEF]" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="mb-2">Pro</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">$90</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">For serious job seekers ready to level up</p>
              </div>
              
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited resumes + calendar</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Smart job insights</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>AI-powered application tracking</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Career goals management</span>
                </li>
              </ul>

              <Button className="w-full bg-[#5B8DEF] hover:bg-[#4A7DDE]">
                Upgrade to Pro
              </Button>
            </div>
          </Card>

          {/* Premium Plan */}
          <Card className="p-6 relative bg-gradient-to-b from-gray-900 to-black text-white">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
              Best Value
            </Badge>
            
            <div className="flex flex-col h-full">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="mb-2 text-white">Premium</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold">$600</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-sm text-gray-300">Complete career acceleration package</p>
              </div>
              
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">6 Interview Prep sessions</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">2 Live 1-on-1 coach calls</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">Dedicated career specialist</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">Resume review + feedback</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">Resume writing service</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-100">LinkedIn profile optimization</span>
                </li>
              </ul>

              <Button className="w-full bg-white text-black hover:bg-gray-100">
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Or purchase individual sessions
        </p>
      </div>

      {/* Add Individual Sessions & Cart */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="mb-4">Add Individual Sessions</h3>
          <p className="text-sm text-muted-foreground mb-6">Purchase sessions à la carte to supplement your plan</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Interview Prep Session */}
            <Card className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#5B8DEF]/10 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-[#5B8DEF]" />
                </div>
              </div>
              
              <h4 className="text-center mb-2">Interview Prep Session</h4>
              <p className="text-center text-2xl font-bold text-[#5B8DEF] mb-4">$90<span className="text-sm text-muted-foreground"> each</span></p>
              
              <p className="text-sm text-muted-foreground text-center mb-6">
                AI-powered interview practice with personalized feedback and coaching
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setInterviewPrepCount(Math.max(0, interviewPrepCount - 1))}
                  disabled={interviewPrepCount === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 h-12 rounded-lg bg-[#5B8DEF] text-white flex items-center justify-center text-xl font-bold">
                  {interviewPrepCount}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setInterviewPrepCount(interviewPrepCount + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Live Coach Session */}
            <Card className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              
              <h4 className="text-center mb-2">Live Coach Session</h4>
              <p className="text-center text-2xl font-bold text-purple-600 mb-4">$250<span className="text-sm text-muted-foreground"> each</span></p>
              
              <p className="text-sm text-muted-foreground text-center mb-6">
                1-on-1 coaching with experienced career professionals for personalized guidance
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setLiveCoachCount(Math.max(0, liveCoachCount - 1))}
                  disabled={liveCoachCount === 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                  {liveCoachCount}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setLiveCoachCount(liveCoachCount + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Your Cart */}
        <div className="md:col-span-1">
          <Card className="p-6 border-2">
            <h3 className="mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart
            </h3>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.count}</p>
                    </div>
                    <p className="font-medium">${item.price * item.count}</p>
                  </div>
                ))}
                
                <div className="flex justify-between items-center pt-4 border-t-2">
                  <p className="font-bold">Total</p>
                  <p className="text-2xl font-bold">${cartTotal}</p>
                </div>
                
                <Button className="w-full mt-4">
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
