'use client';

import LoginForm from "@/src/components/ui/LoginForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Welcome back</h1>
        <p className="text-gray-300">
          Log in to continue to your account
        </p>
          {registered && (
          <div className="mt-4 p-4 bg-purple-900/30 text-purple-100 border border-purple-900/50 rounded-md max-w-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Account created successfully! Please log in with your credentials.</span>
          </div>
        )}
      </div>
      <LoginForm />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12" style={{ background: 'var(--background)' }}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome back</h1>
          <p className="text-gray-300">
            Log in to continue to your account
          </p>
        </div>
        <LoginForm />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
