'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt?: string;
};

interface AuthContextType {
  user: User | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signIn: (credentials: { email: string; password: string }) => Promise<boolean>;
  signUp: (userData: { name: string; email: string; password: string }) => Promise<boolean>;
  updateProfile: (profileData: { name: string; bio?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/user/update-profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const profileData = await response.json();
          setUser(prevUser => ({
            ...prevUser!,
            bio: profileData.bio,
            createdAt: profileData.createdAt
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (session?.user) {
      // Create a user object with custom id property from session token
      setUser({
        id: (session.user as { id?: string }).id ?? 'unknown',
        name: session.user.name || 'Unknown User',
        email: session.user.email || 'unknown@example.com',
        image: session.user.image || undefined
      });
      
      // Fetch additional user profile data
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [session]);
  const handleSignIn = async (credentials: { email: string; password: string }) => {
    console.log('Attempting sign in for:', credentials.email);
    const result = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    console.log('Sign in result:', result);
    
    if (result?.ok) {
      // Use replace instead of push for more reliable navigation after authentication
      router.replace('/dashboard/profile');
      return true;
    }
    
    console.error('Sign in failed:', result?.error);
    return false;
  };  const handleSignUp = async (userData: { name: string; email: string; password: string }) => {
    try {
      console.log('Registration attempt for:', userData.email);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        return false;
      }
      
      console.log('Registration successful');
      
      // Redirect to login page with registered flag
      // This approach is more reliable than trying to auto-login
      router.replace('/login?registered=true');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Handle profile updates
  const handleUpdateProfile = async (profileData: { name: string; bio?: string }) => {
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        // Update user state with new profile data
        setUser(prevUser => ({
          ...prevUser!,
          name: updatedProfile.name,
          bio: updatedProfile.bio,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const value = {
    user,
    status: status as 'loading' | 'authenticated' | 'unauthenticated',
    signIn: handleSignIn,
    signUp: handleSignUp,
    updateProfile: handleUpdateProfile,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
