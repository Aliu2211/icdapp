'use client';

import { useEffect } from 'react';

// Define interfaces for Paystack
interface PaystackConfig {
  key: string | undefined;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata: object;
  onClose: () => void;
  callback: (response: object) => void;
}

// Define the PaystackWindow interface
interface PaystackWindow extends Window {
  PaystackPop: {
    setup: (config: PaystackConfig) => {
      openIframe: () => void;
    };
  };
}

export default function PaystackScript() {
  useEffect(() => {
    // Check if the script is already loaded
    if (document.getElementById('paystack-script') || (window as unknown as PaystackWindow).PaystackPop) {
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => {
      // Script loaded successfully
    };
    script.onerror = () => {
      console.error('Failed to load Paystack script');
    };
    
    // Append script to document
    document.body.appendChild(script);
    
    // Clean up function
    return () => {
      // Optionally remove the script when component unmounts
      // document.body.removeChild(script);
    };
  }, []);
  
  return null;
}
