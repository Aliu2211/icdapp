'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('LoginForm: Attempting to sign in with:', email);
      
      // Call NextAuth signIn directly here for better control
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        console.log('LoginForm: Sign-in failed:', result.error);
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (result?.ok) {
        console.log('LoginForm: Sign-in successful');
        // Redirect to the dashboard profile page
        router.replace('/dashboard/profile');
      }
    } catch (err) {
      console.error('LoginForm: Error during login:', err);
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="max-w-md w-full mx-auto rounded-lg shadow-lg p-8 border border-purple-900/30" style={{ background: 'var(--card-background)' }}>
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Log In</h2>
        {error && (
        <div className="mb-4 p-3 bg-red-900/30 text-red-100 border border-red-900/50 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-purple-200">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-purple-200">
              Password
            </label>
            <Link href="/forgot-password" className="text-sm text-purple-300 hover:text-purple-200 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="••••••••"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium text-white bg-purple-700 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
        <div className="mt-6 text-center text-gray-300">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-purple-300 hover:text-purple-200 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
