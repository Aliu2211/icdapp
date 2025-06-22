'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import { useState, useEffect } from 'react';
import PaystackCheckout from '@/src/components/ui/PaystackCheckout';
import PaystackScript from '@/src/components/ui/PaystackScript';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/src/types/global';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<null | 'success' | 'failed'>(null);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isProcessingVerification, setIsProcessingVerification] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Calculate amount based on selected plan (in GHS)
  const amount = selectedPlan === 'monthly' ? 120 : 1200;

  // Fetch user's subscription on component mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/user/subscription');
        const data = await response.json();
        
        if (data.subscription) {
          setSubscription(data.subscription);
          // Set the selected plan based on current subscription
          setSelectedPlan(data.subscription.billingCycle);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handlePlanChange = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
  };

  const handleUpgradeClick = () => {
    if (!user) {
      alert("Please log in to continue");
      return;
    }
    setShowPayment(true);
  };
  const handlePaymentSuccess = async (reference: string) => {
    setIsProcessingVerification(true);
    try {
      // Verify the payment with our backend
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentStatus('success');
        setPaymentMessage('Your subscription has been successfully activated!');
        // Redirect to profile after a delay
        setTimeout(() => {
          router.push('/dashboard/profile');
        }, 3000);
      } else {
        setPaymentStatus('failed');
        setPaymentMessage('Payment verification failed. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStatus('failed');
      setPaymentMessage('Payment verification failed. Please try again or contact support.');
    } finally {
      setIsProcessingVerification(false);
      setShowPayment(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
  };
    return (
    <div className="max-w-2xl mx-auto">
      {/* Load Paystack script */}
      <PaystackScript />
      
      {/* Payment Status Messages */}
      {paymentStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          paymentStatus === 'success' 
            ? 'bg-green-900/20 border border-green-900/30 text-green-200' 
            : 'bg-red-900/20 border border-red-900/30 text-red-200'
        }`}>
          <div className="flex items-center">
            {paymentStatus === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <p>{paymentMessage}</p>
          </div>
        </div>
      )}

      {/* Subscription Management Section */}
      <div className="rounded-lg shadow-xl overflow-hidden border border-purple-900/50" style={{ background: 'var(--card-background)' }}>
        <div className="p-8 text-center text-white">          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-violet-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
          </div>          <h1 className="text-3xl font-bold mb-2 text-white">Build Full ICP Projects with ICDAPP</h1>
          <p className="text-gray-300 mb-4">Powerful AI agent extension combining Next.js/React frontends with Internet Computer backends</p><div className="my-8">
            <div className="text-lg font-semibold mb-4 text-purple-200">Pro features for ICP development:</div>
            
            <ul className="space-y-4">              <li className="flex items-start">
                <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-200">Generate complete ICP canisters with Motoko or Rust using ICDAPP</span>
              </li>              <li className="flex items-start">
                <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-200">Seamless Next.js/React to ICP integration with automated dfx deployment workflows</span>
              </li><li className="flex items-start">
                <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-200">Ready-to-use Next.js and React frontend templates that integrate with ICP backends</span>
              </li><li className="flex items-start">
                <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-200">Advanced debugging and optimization for ICP smart contracts</span>
              </li>
            </ul>
          </div>
            <div className="my-10">
            <div className="text-lg font-medium mb-4 text-purple-200">Billing frequency after 30-day free trial</div>              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`border border-purple-900/40 rounded-lg relative bg-gray-900/40 ${selectedPlan === 'monthly' ? 'ring-2 ring-purple-500' : ''}`}>
                <input 
                  type="radio" 
                  id="monthly" 
                  name="billing" 
                  className="hidden" 
                  checked={selectedPlan === 'monthly'}
                  onChange={() => handlePlanChange('monthly')}
                />                <label htmlFor="monthly" className="block cursor-pointer rounded-lg p-4" onClick={() => handlePlanChange('monthly')}>
                  <div className="font-medium text-white">Pay monthly</div>
                  <div className="text-2xl font-bold mt-2 text-white">GH₵120 <span className="text-sm font-normal text-gray-300">GHS / month</span></div>
                </label>
              </div>
              
              <div className={`border border-purple-900/40 rounded-lg relative bg-gray-900/40 ${selectedPlan === 'yearly' ? 'ring-2 ring-purple-500' : ''}`}>
                <input 
                  type="radio" 
                  id="yearly" 
                  name="billing" 
                  className="hidden" 
                  checked={selectedPlan === 'yearly'} 
                  onChange={() => handlePlanChange('yearly')}
                />                <label htmlFor="yearly" className="block cursor-pointer rounded-lg p-4" onClick={() => handlePlanChange('yearly')}>
                  <div className="font-medium text-white">Pay yearly <span className="bg-purple-900/70 text-purple-200 text-xs px-2 py-1 rounded ml-2">Save GH₵240</span></div>
                  <div className="text-2xl font-bold mt-2 text-white">GH₵1,200 <span className="text-sm font-normal text-gray-300">GHS / year</span></div>
                </label>
              </div>
            </div>
          </div>            <div className="bg-purple-900/20 text-purple-100 rounded-lg p-4 mb-8 border border-purple-900/30">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-purple-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div>Early adopter bonus: Get exclusive access to our ICP project templates library with 50+ ready-to-deploy dapps and canisters.</div>
                <a href="#icp-templates" className="text-purple-300 hover:text-purple-200 hover:underline">Browse template library</a>
              </div>
            </div>
          </div>            <button 
            onClick={handleUpgradeClick} 
            disabled={isProcessingVerification}
            className={`group relative w-full ${
              subscription && subscription.status === 'active' 
                ? 'bg-purple-700 hover:bg-purple-600' 
                : 'bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500'
            } text-white py-4 rounded-md font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:outline-none overflow-hidden ${isProcessingVerification ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isProcessingVerification ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span>
                    {subscription && subscription.status === 'active' 
                      ? subscription.billingCycle === selectedPlan 
                        ? 'Manage Subscription' 
                        : 'Change Plan'
                      : 'Upgrade now'
                    }
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-indigo-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button><div className="mt-4 text-sm text-gray-300">
            <p>Start building production-ready Internet Computer dapps in minutes with our specialized ICDAPP agent. Create modern Next.js/React frontends connected to ICP canister backends. Your 30-day free trial includes full access to all development tools and templates. Cancel anytime before the trial ends to avoid being billed.</p>
          </div>
        </div>
        
        <div className="bg-gray-900/50 p-4 text-center border-t border-purple-900/30">
          <p className="text-sm text-gray-300">
            Building with a team? <a href="/business" className="text-purple-300 hover:text-purple-200 hover:underline">Get Team License</a> for collaborative ICP development.
          </p>        </div>
      </div>

      {/* Current Subscription Status */}
      {!isLoading && subscription && subscription.status === 'active' && (
        <div className="mb-6 p-4 rounded-lg bg-purple-900/20 border border-purple-900/30 text-purple-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">You have an active {subscription.plan.toUpperCase()} subscription</p>
              <p className="text-sm">
                Your {subscription.billingCycle} plan will renew on {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-900/50 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={handlePaymentClose} 
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Complete Your Purchase</h3>
              <p className="text-gray-300">You&apos;re subscribing to the {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} plan</p>
              <div className="mt-2 text-2xl font-bold text-white">GH₵{amount.toLocaleString()} GHS</div>
            </div>
            
            <PaystackCheckout
              plan={selectedPlan}
              amount={amount}
              email={user.email || ''}
              name={user.name || ''}
              onClose={handlePaymentClose}
              onSuccess={handlePaymentSuccess}
            />
            
            <div className="mt-6 text-xs text-center text-gray-400">
              <p>Your payment is processed securely by Paystack.</p>
              <p className="mt-1">By clicking &quot;Pay with Paystack&quot;, you agree to our Terms of Service.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
