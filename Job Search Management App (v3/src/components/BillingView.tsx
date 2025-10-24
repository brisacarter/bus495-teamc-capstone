import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  CreditCard, 
  Check, 
  Crown,
  Download,
  Calendar,
  Mic,
  Users,
  Sparkles,
  TrendingUp,
  Plus,
  Minus,
  ShoppingCart,
  Trash2
} from 'lucide-react';
import { SubscriptionTier } from '../types';

export function BillingView() {
  const { user, updateUser } = useApp();
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

  // Shopping cart state
  const [cart, setCart] = useState({
    interviewPrepSessions: 0,
    liveCoachSessions: 0,
  });

  const plans = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Freemium',
      price: '$0',
      period: '/ month',
      description: 'Perfect for getting started with job search tracking',
      features: [
        'Submit up to 5 resumes',
        'Access calendar and application tracking',
        'Basic job search insights',
        'Email notifications',
      ],
      limitations: [
        'No Interview Prep access',
      ],
      buttonText: 'Current Plan',
      highlighted: false,
      icon: TrendingUp,
      color: 'gray',
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Pro',
      price: '$90',
      period: '/ month',
      description: 'For serious job seekers ready to level up',
      features: [
        '3 Interview Prep sessions',
        'Resume tracker + calendar',
        'Smart job insights',
        'Priority support',
        'AI-powered application tracking',
        'Cover letter management',
      ],
      buttonText: 'Upgrade to Pro',
      highlighted: true,
      icon: Mic,
      color: 'blue',
      badge: 'Popular',
    },
    {
      id: 'premium' as SubscriptionTier,
      name: 'Premium',
      price: '$600',
      period: '/ month',
      description: 'Complete career acceleration package',
      features: [
        'Everything in Pro',
        '6 Interview Prep sessions',
        '2 Live Coach sessions',
        'Dedicated career specialist',
        'Priority job matching',
        'Resume writing service',
        'LinkedIn profile optimization',
      ],
      buttonText: 'Upgrade to Premium',
      highlighted: false,
      icon: Crown,
      color: 'purple',
      badge: 'Best Value',
    },
  ];

  const handleSubscriptionChange = (tier: SubscriptionTier) => {
    if (!user) return;

    const planNames = {
      free: 'Freemium',
      pro: 'Pro',
      premium: 'Premium',
    };

    const credits = {
      free: { interviewPrep: 0, liveCoach: 0 },
      pro: { interviewPrep: 3, liveCoach: 0 },
      premium: { interviewPrep: 6, liveCoach: 2 },
    };

    updateUser({ 
      subscriptionTier: tier,
      interviewPrepCredits: credits[tier].interviewPrep,
      liveCoachCredits: credits[tier].liveCoach,
    });

    if (tier === 'pro') {
      toast.success('Upgrade successful! You now have 3 Interview Prep credits.', {
        description: 'Start practicing your interview skills today!',
      });
    } else if (tier === 'premium') {
      toast.success('Welcome to Premium! You now have 6 Interview Prep sessions and 2 Live Coach sessions.', {
        description: 'Check out your new features in the Interview Prep and Live Coach sections.',
      });
    } else {
      toast.success(`Switched to ${planNames[tier]} plan`);
    }
  };

  const mockInvoices = [
    {
      id: '1',
      date: new Date('2025-09-01'),
      amount: user?.subscriptionTier === 'pro' ? 90 : user?.subscriptionTier === 'premium' ? 600 : 0,
      status: 'paid',
      plan: user?.subscriptionTier === 'pro' ? 'Pro' : user?.subscriptionTier === 'premium' ? 'Premium' : 'Freemium',
    },
    {
      id: '2',
      date: new Date('2025-08-01'),
      amount: user?.subscriptionTier === 'pro' ? 90 : user?.subscriptionTier === 'premium' ? 600 : 0,
      status: 'paid',
      plan: user?.subscriptionTier === 'pro' ? 'Pro' : user?.subscriptionTier === 'premium' ? 'Premium' : 'Freemium',
    },
  ];

  const getPlanBadgeColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return 'bg-blue-100 text-blue-800';
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Cart management functions
  const addToCart = (type: 'interviewPrep' | 'liveCoach') => {
    setCart(prev => ({
      ...prev,
      [type === 'interviewPrep' ? 'interviewPrepSessions' : 'liveCoachSessions']: 
        prev[type === 'interviewPrep' ? 'interviewPrepSessions' : 'liveCoachSessions'] + 1
    }));
  };

  const removeFromCart = (type: 'interviewPrep' | 'liveCoach') => {
    setCart(prev => ({
      ...prev,
      [type === 'interviewPrep' ? 'interviewPrepSessions' : 'liveCoachSessions']: 
        Math.max(0, prev[type === 'interviewPrep' ? 'interviewPrepSessions' : 'liveCoachSessions'] - 1)
    }));
  };

  const clearCart = () => {
    setCart({ interviewPrepSessions: 0, liveCoachSessions: 0 });
  };

  const handleCheckout = () => {
    if (!user) return;
    
    const totalItems = cart.interviewPrepSessions + cart.liveCoachSessions;
    if (totalItems === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Update user credits
    updateUser({
      interviewPrepCredits: (user.interviewPrepCredits || 0) + cart.interviewPrepSessions,
      liveCoachCredits: (user.liveCoachCredits || 0) + cart.liveCoachSessions,
    });

    const total = (cart.interviewPrepSessions * 30) + (cart.liveCoachSessions * 250);
    
    toast.success('Purchase successful!', {
      description: `Added ${cart.interviewPrepSessions} Interview Prep and ${cart.liveCoachSessions} Live Coach sessions. Total: $${total}`,
    });

    clearCart();
  };

  const cartTotal = (cart.interviewPrepSessions * 30) + (cart.liveCoachSessions * 250);
  const cartItemCount = cart.interviewPrepSessions + cart.liveCoachSessions;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Upgrade your account to unlock more Interview Prep sessions and coaching support.
        </p>
      </div>

      {/* Current Plan Info */}
      {user?.subscriptionTier !== 'free' && (
        <Card className="p-4 md:p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3>Current Plan</h3>
                <Badge className={getPlanBadgeColor(user.subscriptionTier)}>
                  {user.subscriptionTier === 'pro' ? 'Pro' : 'Premium'}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {user.subscriptionTier === 'pro' 
                  ? `You have ${user.interviewPrepCredits || 0} Interview Prep credits remaining`
                  : `You have ${user.interviewPrepCredits || 0} Interview Prep credits and ${user.liveCoachCredits || 0} Live Coach sessions`
                }
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Mic className="w-3 h-3" />
                {user.interviewPrepCredits} Interview Prep
              </Badge>
              {user.subscriptionTier === 'premium' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {user.liveCoachCredits} Live Coach
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="mb-8">
        <h2 className="mb-4">Monthly Subscription Plans</h2>
        <p className="text-muted-foreground mb-6">Choose a plan that fits your job search needs</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = user?.subscriptionTier === plan.id;
          const canUpgrade = user?.subscriptionTier === 'free' || 
                           (user?.subscriptionTier === 'pro' && plan.id === 'premium');

          return (
            <Card 
              key={plan.id}
              className={`relative p-6 transition-all duration-300 ${
                plan.highlighted 
                  ? 'ring-2 ring-[#3E6BAF] shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102'
              } ${isCurrentPlan ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''}`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#3E6BAF] text-white">
                  {plan.badge}
                </Badge>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.color === 'blue' ? 'bg-blue-100' :
                  plan.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-8 h-8 ${
                    plan.color === 'blue' ? 'text-blue-600' :
                    plan.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                
                <h3 className="mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.limitations?.map((limitation, index) => (
                  <div key={index} className="flex items-start gap-2 opacity-50">
                    <span className="text-sm">✗ {limitation}</span>
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${
                  isCurrentPlan 
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                    : plan.highlighted
                    ? 'bg-[#3E6BAF] hover:bg-[#2E5A9F]'
                    : ''
                }`}
                onClick={() => !isCurrentPlan && canUpgrade && handleSubscriptionChange(plan.id)}
                disabled={isCurrentPlan || !canUpgrade}
              >
                {isCurrentPlan ? 'Current Plan' : plan.buttonText}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#F5F5F5] px-4 text-sm text-muted-foreground">Or purchase individual sessions</span>
        </div>
      </div>

      {/* Individual Session Purchases */}
      <div className="mb-12">
        <div className="mb-6">
          <h2 className="mb-2">Add Individual Sessions</h2>
          <p className="text-muted-foreground">Purchase sessions à la carte to supplement your plan</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Interview Prep Session Card */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-800">$30 each</Badge>
            </div>
            
            <h3 className="mb-2">Interview Prep Session</h3>
            <p className="text-sm text-muted-foreground mb-6">
              AI-powered interview practice with personalized feedback and coaching
            </p>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeFromCart('interviewPrep')}
                disabled={cart.interviewPrepSessions === 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl">{cart.interviewPrepSessions}</span>
              </div>
              <Button
                size="sm"
                onClick={() => addToCart('interviewPrep')}
                className="bg-[#3E6BAF] hover:bg-[#2E5A9F]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Live Coach Session Card */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">$250 each</Badge>
            </div>
            
            <h3 className="mb-2">Live Coach Session</h3>
            <p className="text-sm text-muted-foreground mb-6">
              1-on-1 coaching with experienced career professionals for personalized guidance
            </p>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeFromCart('liveCoach')}
                disabled={cart.liveCoachSessions === 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl">{cart.liveCoachSessions}</span>
              </div>
              <Button
                size="sm"
                onClick={() => addToCart('liveCoach')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Shopping Cart Card */}
          <Card className="p-6 lg:col-span-1 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-[#3E6BAF]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Your Cart
              </h3>
              {cartItemCount > 0 && (
                <Badge className="bg-[#3E6BAF] text-white">{cartItemCount}</Badge>
              )}
            </div>

            {cartItemCount === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.interviewPrepSessions > 0 && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm">Interview Prep</p>
                        <p className="text-xs text-muted-foreground">×{cart.interviewPrepSessions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">${cart.interviewPrepSessions * 30}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCart(prev => ({ ...prev, interviewPrepSessions: 0 }))}
                        className="h-auto p-0 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {cart.liveCoachSessions > 0 && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-sm">Live Coach</p>
                        <p className="text-xs text-muted-foreground">×{cart.liveCoachSessions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">${cart.liveCoachSessions * 250}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCart(prev => ({ ...prev, liveCoachSessions: 0 }))}
                        className="h-auto p-0 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl">${cartTotal}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#3E6BAF] hover:bg-[#2E5A9F]"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Checkout
                  </Button>
                  <Button
                    onClick={clearCart}
                    variant="ghost"
                    className="w-full mt-2 text-sm"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Payment Method */}
      {user?.subscriptionTier !== 'free' && (
        <Card className="p-4 md:p-6 mb-8">
          <h3 className="mb-6">Payment Method</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={billingInfo.cardNumber}
                onChange={(e) => setBillingInfo({ ...billingInfo, cardNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name-on-card">Name on Card</Label>
              <Input
                id="name-on-card"
                placeholder="John Doe"
                value={billingInfo.nameOnCard}
                onChange={(e) => setBillingInfo({ ...billingInfo, nameOnCard: e.target.value })}
              />
            </div>

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
                maxLength={3}
                value={billingInfo.cvv}
                onChange={(e) => setBillingInfo({ ...billingInfo, cvv: e.target.value })}
              />
            </div>
          </div>

          <Button className="mt-6">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
        </Card>
      )}

      {/* Billing History */}
      {user?.subscriptionTier !== 'free' && mockInvoices.length > 0 && (
        <Card className="p-4 md:p-6">
          <h3 className="mb-6">Billing History</h3>
          
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm mb-1">{invoice.plan}</p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">${invoice.amount.toFixed(2)}</p>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
