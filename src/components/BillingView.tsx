import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  Check, 
  Crown,
  Download,
  Calendar
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

  const subscriptionFeatures = {
    free: [
      'Track up to 10 job applications',
      'Basic calendar integration',
      'Email notifications',
      'Single resume storage',
    ],
    'premium-monthly': [
      'Unlimited job applications',
      'Advanced calendar features',
      'Priority notifications',
      'Multiple resume versions',
      'Interview preparation tools',
      'Analytics and insights',
      'Export data',
    ],
    'premium-yearly': [
      'All Premium Monthly features',
      'Save 17% with yearly billing',
      'Priority customer support',
      'Early access to new features',
    ],
  };

  const handleSubscriptionChange = (tier: SubscriptionTier) => {
    if (user) {
      updateUser({ subscriptionTier: tier });
    }
  };

  const mockInvoices = [
    {
      id: '1',
      date: new Date('2025-09-01'),
      amount: 4.99,
      status: 'paid',
      plan: 'Premium Monthly',
    },
    {
      id: '2',
      date: new Date('2025-08-01'),
      amount: 4.99,
      status: 'paid',
      plan: 'Premium Monthly',
    },
    {
      id: '3',
      date: new Date('2025-07-01'),
      amount: 4.99,
      status: 'paid',
      plan: 'Premium Monthly',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3>Current Plan</h3>
              <Badge className={user?.subscriptionTier === 'free' ? '' : 'bg-purple-100 text-purple-800'}>
                {user?.subscriptionTier === 'free' ? 'Free' : 
                 user?.subscriptionTier === 'premium-monthly' ? 'Premium Monthly' : 'Premium Yearly'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {user?.subscriptionTier === 'free' 
                ? 'You are currently on the free plan'
                : user?.subscriptionTier === 'premium-monthly'
                ? 'Billed monthly at $4.99 + tax'
                : 'Billed yearly at $49.99 + tax'}
            </p>
            {user?.subscriptionTier !== 'free' && (
              <p className="text-sm text-muted-foreground mt-2">
                Next billing date: November 1, 2025
              </p>
            )}
          </div>
          {user?.subscriptionTier !== 'free' && (
            <Button variant="outline" onClick={() => handleSubscriptionChange('free')}>
              Cancel Subscription
            </Button>
          )}
        </div>
      </Card>

      {/* Subscription Plans */}
      <div className="mb-8">
        <h3 className="mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Free Plan */}
          <Card className={`p-4 md:p-6 ${user?.subscriptionTier === 'free' ? 'border-2 border-primary' : ''}`}>
            <div className="mb-4">
              <h3 className="mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-3xl">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {subscriptionFeatures.free.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={user?.subscriptionTier === 'free' ? 'secondary' : 'outline'}
              disabled={user?.subscriptionTier === 'free'}
              onClick={() => handleSubscriptionChange('free')}
            >
              {user?.subscriptionTier === 'free' ? 'Current Plan' : 'Downgrade'}
            </Button>
          </Card>

          {/* Premium Monthly */}
          <Card className={`p-4 md:p-6 ${user?.subscriptionTier === 'premium-monthly' ? 'border-2 border-primary' : ''}`}>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h3>Premium</h3>
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="mb-4">
                <span className="text-3xl">$4.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground">+ applicable taxes</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              {subscriptionFeatures['premium-monthly'].map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={user?.subscriptionTier === 'premium-monthly' ? 'secondary' : 'default'}
              disabled={user?.subscriptionTier === 'premium-monthly'}
              onClick={() => handleSubscriptionChange('premium-monthly')}
            >
              {user?.subscriptionTier === 'premium-monthly' ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>

          {/* Premium Yearly */}
          <Card className={`p-4 md:p-6 relative ${user?.subscriptionTier === 'premium-yearly' ? 'border-2 border-primary' : ''}`}>
            <Badge className="absolute top-4 right-4 bg-green-100 text-green-800">
              Save 17%
            </Badge>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h3>Premium Yearly</h3>
                <Crown className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="mb-4">
                <span className="text-3xl">$49.99</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-xs text-muted-foreground">$4.16/month + applicable taxes</p>
            </div>
            
            <ul className="space-y-3 mb-6">
              {subscriptionFeatures['premium-yearly'].map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={user?.subscriptionTier === 'premium-yearly' ? 'secondary' : 'default'}
              disabled={user?.subscriptionTier === 'premium-yearly'}
              onClick={() => handleSubscriptionChange('premium-yearly')}
            >
              {user?.subscriptionTier === 'premium-yearly' ? 'Current Plan' : 'Upgrade'}
            </Button>
          </Card>
        </div>
      </div>

      {/* Payment Method */}
      {user?.subscriptionTier !== 'free' && (
        <Card className="p-4 md:p-6 mb-8">
          <h3 className="mb-6">Payment Method</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
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
                placeholder="John Doe"
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
      )}

      {/* Billing History */}
      {user?.subscriptionTier !== 'free' && (
        <Card className="p-4 md:p-6">
          <h3 className="mb-6">Billing History</h3>
          
          <div className="space-y-3">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p>{invoice.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-sm text-muted-foreground">{invoice.plan}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p>${invoice.amount.toFixed(2)}</p>
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
      )}
    </div>
  );
}