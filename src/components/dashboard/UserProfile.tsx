'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Subscription {
  id: string;
  status: string;
  plan: string;
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
  createdAt: string;
}

export default function UserProfile() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<Subscription | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  // Format date to human-readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get subscription data
  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      const data = await response.json();
      
      if (data.hasSubscription) {
        setSubscriptionData(data.subscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Call the updateProfile method from AuthContext
      const success = await updateProfile({
        name: formData.name,
        bio: formData.bio,
      });
      
      if (success) {
        setIsEditing(false);
        // Success message
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Not logged in</h3>
          <p className="mt-2">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  return (    
  <div className="max-w-4xl mx-auto p-6">
      <div className="shadow rounded-lg overflow-hidden" style={{ background: 'var(--card-background)' }}>
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 h-32 flex items-center justify-center relative">
          <div className="absolute bottom-0 left-8 transform translate-y-1/2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={96}
                height={96}
                className="rounded-full border-4 border-gray-900"
              />
            ) : (
              <div className="w-24 h-24 bg-purple-900 text-white rounded-full flex items-center justify-center text-2xl font-bold border-4 border-gray-900">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>        <div className="mt-16 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {isEditing ? (
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>                <label htmlFor="name" className="block text-sm font-medium mb-1 text-purple-200">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-purple-200">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 opacity-75"
                  disabled
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1 text-purple-200">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-purple-300">Email</h3>
                <p className="text-gray-100">{user.email}</p>
              </div>
              
              {user.bio && (
                <div>
                  <h3 className="text-sm font-medium text-purple-300">Bio</h3>
                  <p className="text-gray-100">{user.bio}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-purple-300">Member since</h3>
                <p className="text-gray-100">{user.createdAt ? formatDate(user.createdAt) : 'June 15, 2025'}</p>
              </div>
            </div>
          )}          <div className="mt-8 ">
            <h2 className="text-xl font-bold mb-4 text-white">Subscription</h2>
            {subscriptionData ? (
              <div className="bg-gray-900/50 p-4 rounded-lg border border-purple-900/40">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">Current Plan</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    subscriptionData.status === 'active' 
                      ? 'bg-purple-900/30 text-purple-200' 
                      : 'bg-yellow-900/30 text-yellow-200'
                  }`}>
                    {subscriptionData.status}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-4 text-white">{subscriptionData.plan.charAt(0).toUpperCase() + subscriptionData.plan.slice(1)}</div>
                
                <div className="text-sm text-gray-300 mb-4">
                  <p>Next billing date: {formatDate(subscriptionData.nextBillingDate)}</p>
                  <p>Amount: ${subscriptionData.amount.toFixed(2)}/{subscriptionData.billingCycle}</p>
                </div>
                
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded">
                    Upgrade Plan
                  </button>
                  <button className="px-4 py-2 bg-transparent border border-purple-700/50 hover:bg-purple-900/30 text-white text-sm rounded">
                    Manage Billing
                  </button>
                </div>
              </div>            ) : (              
            <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-purple-900/40">
                <p className="mb-4 text-gray-200">You don&apos;t have an active subscription</p>
                <a href="/dashboard/subscription" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded inline-block">
                  View Subscription Options
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-900/70 hover:bg-red-800 text-white rounded"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
