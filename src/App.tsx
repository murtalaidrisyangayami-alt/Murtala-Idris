/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { Smartphone } from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Navbar (hidden inside mobile frame unless desired) */}
      {!isMobileFrame && (
        <Navbar 
          onOpenAuth={handleOpenAuth} 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
        />
      )}

      {/* Main Container / Mobile Device Wrapper */}
      <div className={`flex-1 flex flex-col ${isMobileFrame ? 'py-8 px-4 bg-slate-900 justify-center items-center' : ''}`}>
        {isMobileFrame ? (
          <div className="w-[390px] h-[844px] bg-slate-950 border-[10px] border-slate-800 rounded-[50px] shadow-2xl overflow-y-auto relative flex flex-col">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full" />
            </div>

            {/* Mobile Header Bar */}
            <div className="pt-8 px-4 pb-3 bg-emerald-700 text-white flex items-center justify-between shrink-0">
              <span className="font-bold text-sm tracking-tight">MASANI DATA (Android App)</span>
              <button 
                onClick={() => setIsMobileFrame(false)}
                className="text-xs bg-emerald-800 px-2.5 py-1 rounded-lg font-semibold"
              >
                Exit Frame
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {currentView === 'home' && <LandingPage onOpenAuth={handleOpenAuth} setCurrentView={setCurrentView} />}
              {currentView === 'dashboard' && <UserDashboard setCurrentView={setCurrentView} />}
              {currentView === 'admin' && <AdminDashboard setCurrentView={setCurrentView} />}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {currentView === 'home' && <LandingPage onOpenAuth={handleOpenAuth} setCurrentView={setCurrentView} />}
            {currentView === 'dashboard' && <UserDashboard setCurrentView={setCurrentView} />}
            {currentView === 'admin' && <AdminDashboard setCurrentView={setCurrentView} />}
            {currentView === 'support' && <UserDashboard setCurrentView={setCurrentView} />}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
        setCurrentView={setCurrentView} 
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
