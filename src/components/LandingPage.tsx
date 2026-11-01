import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Smartphone, Zap, ShieldCheck, CheckCircle2, ArrowRight, Gift, Headphones, Cpu, Star, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  setCurrentView: (view: string) => void;
}

export function LandingPage({ onOpenAuth, setCurrentView }: LandingPageProps) {
  const { dataPlans, user, login } = useAuth();
  const [selectedNetwork, setSelectedNetwork] = useState<'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE'>('MTN');
  const [demoPhone, setDemoPhone] = useState('08031234567');
  const [demoPlanId, setDemoPlanId] = useState('');

  const filteredPlans = dataPlans.filter(p => p.network === selectedNetwork);

  const handleQuickDemoLogin = async (email: string) => {
    await login(email);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Nigeria's #1 Automated VTU & Data Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Instant Cheap Data & Airtime VTU in <span className="text-emerald-600">Nigeria</span>
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Welcome to <strong className="text-slate-900 dark:text-white">MASANI DATA</strong>. Buy affordable MTN, Airtel, Glo, and 9mobile data plans with instant automated delivery, 2% airtime discount, and robust wallet funding.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {user ? (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center gap-2 text-base"
                >
                  <span>Open User Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuth('register')}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 transition-all flex items-center gap-2 text-base"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-2xl transition-all text-base"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            {/* Quick Demo Login Shortcuts */}
            {!user && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Quick Demo Access:</span>
                <button 
                  onClick={() => handleQuickDemoLogin('murtala@gmail.com')}
                  className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors"
                >
                  Login as Demo User
                </button>
                <button 
                  onClick={() => handleQuickDemoLogin('admin@masanidata.ng')}
                  className="px-3 py-1.5 bg-slate-900 text-white dark:bg-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Login as Admin
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Instant Delivery</h4>
                  <p className="text-[11px] text-slate-500">Automated in 5 secs</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">100% Secure</h4>
                  <p className="text-[11px] text-slate-500">Encrypted wallet</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">24/7 Support</h4>
                  <p className="text-[11px] text-slate-500">Always online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Widget Box */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span>Quick Data Purchase</span>
                </h3>
                <span className="text-xs px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-full font-semibold">
                  Live API Active
                </span>
              </div>

              {/* Network Selector Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Select Mobile Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MTN', 'AIRTEL', 'GLO', '9MOBILE'] as const).map(net => (
                    <button
                      key={net}
                      onClick={() => setSelectedNetwork(net)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedNetwork === net 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20' 
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Recipient Phone Number</label>
                <input
                  type="text"
                  value={demoPhone}
                  onChange={e => setDemoPhone(e.target.value)}
                  placeholder="08031234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Data Plan Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Select Data Plan</label>
                <select
                  value={demoPlanId}
                  onChange={e => setDemoPlanId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Data Plan --</option>
                  {filteredPlans.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - ₦{p.price.toLocaleString()} ({p.validity})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth('login');
                  } else {
                    setCurrentView('dashboard');
                  }
                }}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Proceed to Buy Data</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-500">
                ⚡ Automated VTU delivery powered by Masani Data Gateway.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Network Providers Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
            Official VTU Partner Networks in Nigeria
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
            {['MTN Nigeria', 'Airtel Nigeria', 'Glo Nigeria', '9mobile Nigeria'].map((net, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-800 dark:text-slate-200 shadow-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{net}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Unbeatable Data & Airtime Pricing
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Enjoy the cheapest rates on SME and Corporate Gifting data plans with instant delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['MTN', 'AIRTEL', 'GLO', '9MOBILE'].map(network => {
            const samplePlan = dataPlans.find(p => p.network === network);
            return (
              <div key={network} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl">
                      {network}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">30 Days Validity</span>
                  </div>
                  <h3 className="text-xl font-extrabold">{network} 1GB Data</h3>
                  <div className="text-3xl font-extrabold font-mono text-emerald-600">
                    ₦{samplePlan ? samplePlan.price.toLocaleString() : '250'}
                  </div>
                  <p className="text-xs text-slate-500">
                    SME / Corporate data bundle delivered instantly to any Nigerian phone number.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (user) setCurrentView('dashboard');
                    else onOpenAuth('register');
                  }}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-xs"
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="px-3 py-1 bg-emerald-800 rounded-full text-xs font-bold text-emerald-200">
              Earn With Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Refer Friends & Earn Instant Commissions
            </h2>
            <p className="text-emerald-100 leading-relaxed">
              Share your unique referral link with friends and family. Earn ₦100 instantly on their first wallet funding plus lifetime commissions on every data transaction they make!
            </p>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-2xl shadow-xl hover:bg-emerald-50 transition-all text-sm"
            >
              Get Your Referral Link
            </button>
          </div>
          <div className="bg-emerald-950/60 p-8 rounded-3xl border border-emerald-800 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-400" />
              <span>Referral Program Highlights</span>
            </h3>
            <ul className="space-y-4 text-sm text-emerald-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Instant ₦100 referral bonus credited to your wallet</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Lifetime commission on every data purchase</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Withdraw referral earnings directly to your bank account</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">MASANI DATA</span>
            <p className="text-xs text-slate-500 mt-1">
              &copy; 2026 Masani Data Technologies Ltd. All rights reserved. Nigeria.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <button onClick={() => setCurrentView('home')} className="hover:text-emerald-600">Privacy Policy</button>
            <button onClick={() => setCurrentView('home')} className="hover:text-emerald-600">Terms of Service</button>
            <button onClick={() => setCurrentView('support')} className="hover:text-emerald-600">Contact Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
