import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Smartphone, ShieldCheck, User as UserIcon, LogOut, Wallet, Menu, X, Globe, SmartphoneNfc } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export function Navbar({ onOpenAuth, currentView, setCurrentView, isMobileFrame, setIsMobileFrame }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentView('home')} 
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                MASANI <span className="text-emerald-600">DATA</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase block">
                Nigerian VTU Hub
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => setCurrentView('home')} 
            className={`hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 ${currentView === 'home' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView(user ? 'dashboard' : 'home')} 
            className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0"
          >
            Data Pricing
          </button>
          <button 
            onClick={() => setCurrentView(user ? 'dashboard' : 'home')} 
            className="hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0"
          >
            Airtime VTU
          </button>
          <button 
            onClick={() => setCurrentView('support')} 
            className={`hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 ${currentView === 'support' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            Support & FAQ
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Mobile App View Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title="Toggle Android Mobile View"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
              isMobileFrame 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300' 
                : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <SmartphoneNfc className="w-4 h-4" />
            <span>{isMobileFrame ? 'Web View' : 'Android App View'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setCurrentView('dashboard')}
                className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-100 transition-colors"
              >
                <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Wallet</span>
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    ₦{user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={logout}
                title="Log out"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-3">
          <button 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className="text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Home
          </button>
          <button 
            onClick={() => { setCurrentView(user ? 'dashboard' : 'home'); setMobileMenuOpen(false); }}
            className="text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Buy Data & Airtime
          </button>
          <button 
            onClick={() => { setCurrentView('support'); setMobileMenuOpen(false); }}
            className="text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Support & FAQ
          </button>
          {!user && (
            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center font-semibold text-sm border border-slate-300 dark:border-slate-700 rounded-xl"
              >
                Login
              </button>
              <button 
                onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                className="flex-1 py-2.5 text-center font-semibold text-sm bg-emerald-600 text-white rounded-xl shadow-md"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
