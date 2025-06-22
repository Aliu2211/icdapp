/**
 * Global type declarations for the application
 */

// Types for subscription data
export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  plan: 'free' | 'pro' | 'business';
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  createdAt: string;
}

// Types for project data
export interface Project {
  id: string;
  userId: string;  // User identifier (email in this case)
  name: string;
  description: string;
  type: 'canister' | 'frontend' | 'fullstack';
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
  createdAt: string;
  progress: number;
  tags?: string[];
  deploymentTarget?: 'ic' | 'local' | 'staging';
  collaborators?: number;
  image?: string | null;
}

// Export as module
export {};
