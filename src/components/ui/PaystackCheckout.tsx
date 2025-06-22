'use client';

import { useState } from 'react';

// Interface for Paystack window object
interface PaystackWindow extends Window {
  PaystackPop: {
    setup: (config: PaystackConfig) => {
      openIframe: () => void;
    };
  };
}

interface PaystackResponse {
  reference: string;
  message: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

interface PaystackConfig {
  key: string | undefined;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  onClose: () => void;
  callback: (response: PaystackResponse) => void;
}

interface PaystackCheckoutProps {
  plan: 'monthly' | 'yearly';
  amount: number;
  email: string;
  name: string;
  onClose: () => void;
  onSuccess: (reference: string) => void;
}

export default function PaystackCheckout({
  plan,
  amount,
  email,
  name,
  onClose,
  onSuccess,
}: PaystackCheckoutProps) {  const [isProcessing, setIsProcessing] = useState(false);
  // Router removed as it's not being used
  
  const initializePayment = () => {
    setIsProcessing(true);
      try {
      // Initialize Paystack payment
      if (typeof window !== 'undefined' && (window as unknown as PaystackWindow).PaystackPop) {
        const handler = (window as unknown as PaystackWindow).PaystackPop.setup({          key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
          email: email,
          amount: amount * 100, // Paystack expects amount in pesewas (multiply by 100)
          currency: 'GHS', // Using Ghanaian Cedi (GHS) as requested
          ref: `icdapp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
          metadata: {
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: name,
              },
              {
                display_name: "Subscription Plan",
                variable_name: "plan",
                value: plan,
              }
            ]
          },
          onClose: () => {
            setIsProcessing(false);
            onClose();
          },
          callback: (response: PaystackResponse) => {
            setIsProcessing(false);
            onSuccess(response.reference);
          }
        });
        handler.openIframe();
      } else {
        console.error("Paystack SDK not found");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={initializePayment}
        disabled={isProcessing}
        className="group relative w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white py-4 rounded-md font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:outline-none overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center">
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span>Pay with Paystack</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-indigo-700/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      </button>
    </div>
  );
}
