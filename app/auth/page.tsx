'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (mode === 'signup') {
        setSuccess('Check your email for a confirmation link!');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center h-14 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-bone-muted"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back</span>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">◐</span>
          <h1 className="font-serif text-2xl text-bone mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-bone-muted text-sm">
            {mode === 'login'
              ? 'Sign in to continue creating'
              : 'Start your wallpaper journey'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-bone-muted text-xs mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full px-4 py-3.5 rounded-xl
                bg-background-secondary border-0
                text-bone placeholder:text-bone-dark
                focus:ring-1 focus:ring-bone/30 focus:outline-none
                text-base
              "
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-bone-muted text-xs mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="
                w-full px-4 py-3.5 rounded-xl
                bg-background-secondary border-0
                text-bone placeholder:text-bone-dark
                focus:ring-1 focus:ring-bone/30 focus:outline-none
                text-base
              "
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl
              font-medium text-lg
              flex items-center justify-center
              ${isLoading
                ? 'bg-bone/50 text-background'
                : 'bg-bone text-background active:scale-[0.98]'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : mode === 'login' ? (
              'Sign in'
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Mode switch */}
        <p className="text-center text-bone-muted text-sm mt-6">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
                className="text-bone underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                className="text-bone underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </main>
    </div>
  );
}
