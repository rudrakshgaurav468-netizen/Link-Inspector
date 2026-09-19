import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WarmHugBadge } from '../common/Logo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    setUser,
    setActiveView,
    addToast
  } = useApp();

  const [name, setName] = useState('Alex Vance');
  const [email, setEmail] = useState('alex@mytechblog.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 600));

    if (authModalMode === 'signup') {
      const newUser = {
        id: 'usr_' + Date.now().toString(36),
        name: name || 'New Marketer',
        email: email || 'user@example.com',
        plan: 'pro' as const,
        telegramConnected: false,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      };
      setUser(newUser);
      setIsAuthModalOpen(false);
      setIsLoading(false);
      setActiveView('onboarding');

      addToast({
        title: 'Account Created! 🎉',
        description: 'Welcome to LinkGuard. Let’s configure your first website.',
        type: 'success',
      });
    } else if (authModalMode === 'login') {
      const existingUser = {
        id: 'usr_98a72b',
        name: name || 'Alex Vance',
        email: email || 'alex@mytechblog.com',
        plan: 'pro' as const,
        telegramConnected: true,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      };
      setUser(existingUser);
      setIsAuthModalOpen(false);
      setIsLoading(false);
      setActiveView('dashboard');

      addToast({
        title: 'Welcome Back, Alex!',
        description: 'Monitoring systems are active.',
        type: 'success',
      });
    } else {
      setIsLoading(false);
      addToast({
        title: 'Password Reset Link Sent',
        description: `We sent recovery instructions to ${email}.`,
        type: 'info',
      });
      setAuthModalMode('login');
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="md"
    >
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <WarmHugBadge size="lg" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          {authModalMode === 'signup' && 'Create your LinkGuard account'}
          {authModalMode === 'login' && 'Welcome back to LinkGuard'}
          {authModalMode === 'forgot' && 'Reset your password'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {authModalMode === 'signup' && 'Start protecting affiliate commissions across your websites.'}
          {authModalMode === 'login' && 'Enter your credentials to access your monitoring command center.'}
          {authModalMode === 'forgot' && 'Enter your email to receive recovery instructions.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {authModalMode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Vance"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@mytechblog.com"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>

        {authModalMode !== 'forgot' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              {authModalMode === 'login' && (
                <button
                  type="button"
                  onClick={() => setAuthModalMode('forgot')}
                  className="text-[11px] text-rose-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>
        )}

        <Button
          variant="rose"
          size="lg"
          className="w-full mt-2"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {authModalMode === 'signup' && 'Create Account & Start'}
          {authModalMode === 'login' && 'Sign In to Dashboard'}
          {authModalMode === 'forgot' && 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        {authModalMode === 'signup' ? (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setAuthModalMode('login')}
              className="font-bold text-slate-900 hover:underline"
            >
              Sign In
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => setAuthModalMode('signup')}
              className="font-bold text-rose-600 hover:underline"
            >
              Create free account
            </button>
          </p>
        )}
      </div>
    </Modal>
  );
};
