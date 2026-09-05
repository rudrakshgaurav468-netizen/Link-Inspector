import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { setActiveView, setIsAuthModalOpen, setAuthModalMode, user } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-subtle py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1">
                Link<span className="text-emerald-600">Guard</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-600 tracking-wider -mt-1 uppercase">Affiliate Monitor</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('product-preview')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Product
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('features')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => handleNavClick('faq')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Auth / CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button
                variant="emerald"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setActiveView('dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="emerald"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => {
                    setAuthModalMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                >
                  Start Monitoring Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 pt-2 border-t border-slate-200/80 animate-slide-down space-y-3">
            <button 
              onClick={() => handleNavClick('product-preview')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Product
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('features')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Pricing
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="emerald"
                size="md"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveView('dashboard');
                }}
              >
                Start Monitoring Free
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
