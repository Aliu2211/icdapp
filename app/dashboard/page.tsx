'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Subscription, Project } from '@/src/types/global';
import { fetchUserSubscription, fetchDashboardStats } from '@/src/lib/api';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  canisterCycles: number;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    canisterCycles: 0
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch subscription data
        const subscriptionData = await fetchUserSubscription();
        if (subscriptionData) {
          setSubscription(subscriptionData);
        }
        
        // Fetch dashboard statistics and recent projects
        const dashboardData = await fetchDashboardStats();
        if (dashboardData) {
          setStats(dashboardData.stats);
          setRecentProjects(dashboardData.recentProjects || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Developer'}</h1>
            <p className="text-gray-400">Here&apos;s what&apos;s happening with your ICP projects today.</p>
          </div>

          <div>
            <Link 
              href="/dashboard/projects"
              className="inline-flex items-center px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium rounded-md transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Card: Total Projects */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl p-6 border border-purple-900/30 shadow-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-purple-600/30 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300">Total Projects</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.totalProjects}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{stats.activeProjects} active this month</span>
          </div>
        </div>

        {/* Stats Card: Deployed Canisters */}
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-6 border border-blue-900/30 shadow-lg">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-600/30 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-300">Deployed Canisters</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stats.canisterCycles}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>{stats.completedProjects} completed this week</span>
          </div>
        </div>

        {/* Stats Card: Subscription Status */}
        <div className={`${
          !isLoading && subscription?.status === 'active'
            ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-900/30'
            : 'bg-gradient-to-br from-orange-900/40 to-amber-900/40 border-orange-900/30'
        } rounded-xl p-6 border shadow-lg`}>
          <div className="flex items-center">
            <div className={`h-12 w-12 rounded-lg ${
              !isLoading && subscription?.status === 'active'
                ? 'bg-green-600/30'
                : 'bg-orange-600/30'
            } flex items-center justify-center mr-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                !isLoading && subscription?.status === 'active'
                  ? 'text-green-300'
                  : 'text-orange-300'
              }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className={`text-sm font-medium ${
                !isLoading && subscription?.status === 'active'
                  ? 'text-green-300'
                  : 'text-orange-300'
              }`}>
                Subscription
              </p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {isLoading ? 'Loading...' : (subscription?.status === 'active' ? 'Active' : 'Free Trial')}
              </h3>
            </div>
          </div>
          <div className="mt-4">
            {!isLoading && subscription?.status === 'active' ? (
              <div className="text-xs text-green-400">
                Renews on {formatDate(subscription.nextBillingDate)}
              </div>
            ) : (
              <Link href="/dashboard/subscription" className="text-xs text-amber-400 hover:text-amber-300 flex items-center">
                <span>Upgrade to Pro</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:bg-gray-800/40 transition-colors group cursor-pointer">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-blue-600/20 group-hover:bg-blue-600/30 flex items-center justify-center mr-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">Create ICP Canister</h3>
              <p className="text-xs text-gray-400 mt-0.5">Build a new Motoko or Rust backend</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:bg-gray-800/40 transition-colors group cursor-pointer">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-purple-600/20 group-hover:bg-purple-600/30 flex items-center justify-center mr-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">New Next.js Frontend</h3>
              <p className="text-xs text-gray-400 mt-0.5">Create React UI for your dapp</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50 hover:bg-gray-800/40 transition-colors group cursor-pointer">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-green-600/20 group-hover:bg-green-600/30 flex items-center justify-center mr-3 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-medium">Connect dapp</h3>
              <p className="text-xs text-gray-400 mt-0.5">Link frontend to ICP canister</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
          <Link href="/dashboard/projects" className="text-sm text-purple-400 hover:text-purple-300 flex items-center">
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="space-y-4">
          {recentProjects.map(project => (
            <div key={project.id} className="bg-gray-900/50 rounded-lg border border-gray-800/50 hover:border-purple-900/50 transition-colors overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <span className={`ml-3 text-xs py-0.5 px-2 rounded-full ${
                        project.type === 'canister' ? 'bg-blue-900/50 text-blue-300' :
                        project.type === 'frontend' ? 'bg-purple-900/50 text-purple-300' : 
                        'bg-green-900/50 text-green-300'
                      }`}>
                        {project.type === 'canister' ? 'Canister' :
                         project.type === 'frontend' ? 'Frontend' : 'Full Stack'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{project.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="text-xs text-gray-400">Progress</div>
                    <div className="text-xs text-gray-400">{project.progress}%</div>
                  </div>
                  <div className="w-full bg-gray-800/70 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        project.progress < 30 ? 'bg-red-500' :
                        project.progress < 70 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Last updated: {formatDate(project.lastUpdated)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create First Project CTA - Show only if no projects */}
      {recentProjects.length === 0 && (
        <div className="mt-8 text-center bg-gray-900/30 rounded-lg border border-gray-800/40 p-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-900/30 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Create your first ICP project</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Start building your first decentralized application on the Internet Computer Protocol with our step-by-step wizards.</p>
          <Link 
            href="/dashboard/projects"
            className="px-5 py-3 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors shadow-lg inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </Link>
        </div>
      )}
    </div>
  );
}
