import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Check, 
  Crown,
  Mic,
  Users,
  TrendingUp,
  ShoppingCart,
  Minus,
  Plus,
  CreditCard,
  User,
  Download,
  Calendar
} from 'lucide-react';

export function BillingView() {
  const { user } = useApp();
  const [interviewPrepCount, setInterviewPrepCount] = useState(0);
  const [liveCoachCount, setLiveCoachCount] = useState(0);
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expiryDate: '12/25',
    cvv: '',
    nameOnCard: 'John Doe',
  });

  const cartTotal = (interviewPrepCount * 90) + (liveCoachCount * 250);
  const cartItems = [];
  if (interviewPrepCount > 0) cartItems.push({ name: 'Interview Prep Session', count: interviewPrepCount, price: 90 });
  if (liveCoachCount > 0) cartItems.push({ name: 'Live Coach Session', count: liveCoachCount, price: 250 });

  const mockInvoices = [
    {
      id: '1',
      date: new Date('2025-09-01'),
      amount: 90.00,
      status: 'paid',
      plan: 'Pro Monthly',
    },
    {
      id: '2',
      date: new Date('2025-08-01'),
      amount: 90.00,
      status: 'paid',
      plan: 'Pro Monthly',
    },
    {
      id: '3',
      date: new Date('2025-07-01'),
      amount: 90.00,
      status: 'paid',
      plan: 'Pro Monthly',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Upgrade your account to unlock more interview Prep sessions and coaching support
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="plans">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="account">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-12">
          {/* Monthly Subscription Plans */}
          <div>
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
              <Card className="p-6 relative border-black" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
                  Best Value
                </Badge>
                
                <div className="flex flex-col h-full">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <Crown className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="mb-2" style={{ color: '#ffffff' }}>Premium</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold" style={{ color: '#ffffff' }}>$600</span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>/month</span>
                    </div>
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Complete career acceleration package</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6 flex-1">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>Everything in Pro</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>6 Interview Prep sessions</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>2 Live 1-on-1 coach calls</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>Dedicated career specialist</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>Resume review + feedback</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>Resume writing service</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span style={{ color: '#ffffff' }}>LinkedIn profile optimization</span>
                    </li>
                  </ul>

                  <Button className="w-full" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
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
          <div>
            <h3 className="mb-4">Add Individual Sessions</h3>
            <p className="text-sm text-muted-foreground mb-6">Purchase sessions à la carte to supplement your plan</p>
            
            <div className="grid md:grid-cols-3 gap-6">
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
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#5B8DEF', color: '#ffffff' }}>
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
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold" style={{ backgroundColor: '#9333ea', color: '#ffffff' }}>
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

              {/* Your Cart */}
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
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          {/* Current Plan */}
          <Card className="p-6">
            <h3 className="mb-4">Current Plan</h3>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold">
                    {user?.subscriptionTier === 'free' ? 'Freemium' : 
                     user?.subscriptionTier === 'premium-monthly' ? 'Pro' : 'Premium'}
                  </span>
                  <Badge className={user?.subscriptionTier === 'free' ? 'bg-gray-200 text-gray-800' : 'bg-[#5B8DEF] text-white'}>
                    {user?.subscriptionTier === 'free' ? 'Free' : 'Active'}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {user?.subscriptionTier === 'free' 
                    ? 'You are currently on the free plan'
                    : user?.subscriptionTier === 'premium-monthly'
                    ? 'Billed monthly at $90.00'
                    : 'Billed monthly at $600.00'}
                </p>
                {user?.subscriptionTier !== 'free' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Next billing date: November 1, 2025
                  </p>
                )}
              </div>
              {user?.subscriptionTier !== 'free' && (
                <Button variant="outline">
                  Cancel Subscription
                </Button>
              )}
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <h3 className="mb-6">Payment Method</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  value={billingInfo.cardNumber}
                  onChange={(e) => setBillingInfo({ ...billingInfo, cardNumber: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={billingInfo.expiryDate}
                    onChange={(e) => setBillingInfo({ ...billingInfo, expiryDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    value={billingInfo.cvv}
                    onChange={(e) => setBillingInfo({ ...billingInfo, cvv: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name-on-card">Name on Card</Label>
                <Input
                  id="name-on-card"
                  value={billingInfo.nameOnCard}
                  onChange={(e) => setBillingInfo({ ...billingInfo, nameOnCard: e.target.value })}
                />
              </div>

              <Button className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
            </div>
          </Card>

          {/* Billing History */}
          <Card className="p-6">
            <h3 className="mb-6">Billing History</h3>
            
            <div className="space-y-3">
              {mockInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#5B8DEF]/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#5B8DEF]" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{invoice.plan}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
