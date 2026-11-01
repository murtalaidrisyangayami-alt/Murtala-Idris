import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, Users, DollarSign, Activity, Settings, Package, 
  Search, CheckCircle2, AlertCircle, ArrowLeft, PlusCircle, RefreshCw 
} from 'lucide-react';

interface AdminDashboardProps {
  setCurrentView: (view: string) => void;
}

export function AdminDashboard({ setCurrentView }: AdminDashboardProps) {
  const { user, adminData, refreshAdminData, updateAdminPlan, creditUserBalance } = useAuth();
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'plans' | 'transactions' | 'settings'>('overview');

  // Edit Plan modal state
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planSize, setPlanSize] = useState('');
  const [planNetwork, setPlanNetwork] = useState('MTN');

  // Credit user modal state
  const [creditUser, setCreditUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditAction, setCreditAction] = useState<'CREDIT' | 'DEBIT'>('CREDIT');

  useEffect(() => {
    refreshAdminData();
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h3 className="text-xl font-bold">Access Denied</h3>
          <p className="text-sm text-slate-500">You must be logged in as an administrator to access this console.</p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs"
          >
            Back to User Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stats = adminData?.stats || { totalUsers: 0, totalRevenue: 0, totalVolume: 0, totalTransactions: 0 };
  const usersList = adminData?.users || [];
  const txnsList = adminData?.transactions || [];
  const plansList = adminData?.dataPlans || [];

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateAdminPlan({
      id: editingPlan?.id,
      network: planNetwork,
      name: planName,
      size: planSize,
      validity: '30 Days',
      price: planPrice,
      type: 'SME'
    });
    if (success) {
      setEditingPlan(null);
      refreshAdminData();
    }
  };

  const handleUserCreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditUser || !creditAmount) return;
    const success = await creditUserBalance(creditUser.id, parseFloat(creditAmount), creditAction);
    if (success) {
      setCreditUser(null);
      setCreditAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-left">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-sm">Admin Console</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">MASANI DATA</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview & Stats', icon: Activity },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'plans', label: 'Data Plans & Prices', icon: Package },
              { id: 'transactions', label: 'All Transactions', icon: DollarSign },
              { id: 'settings', label: 'API & Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const active = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    active ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Admin Mode</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold capitalize">{adminTab.replace('_', ' ')} Management</h2>
            <p className="text-xs text-slate-500">Monitor and configure Masani Data platform operations.</p>
          </div>
          <button
            onClick={() => refreshAdminData()}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        {/* Overview Tab */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Total Registered Users</span>
                <div className="text-3xl font-extrabold font-mono">{stats.totalUsers}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Platform Revenue (Profit)</span>
                <div className="text-3xl font-extrabold font-mono text-emerald-600">₦{stats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Total Sales Volume</span>
                <div className="text-3xl font-extrabold font-mono">₦{stats.totalVolume.toLocaleString()}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Total Transactions</span>
                <div className="text-3xl font-extrabold font-mono">{stats.totalTransactions}</div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {adminTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold">Registered Users ({usersList.length})</h3>
            
            <div className="space-y-3">
              {usersList.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm flex items-center gap-2">
                      <span>{u.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">{u.email} · {u.phone}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold font-mono text-sm">₦{u.walletBalance.toLocaleString()}</div>
                      <span className="text-[10px] text-slate-500">Balance</span>
                    </div>
                    <button
                      onClick={() => setCreditUser(u)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                    >
                      Fund / Debit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Plans Tab */}
        {adminTab === 'plans' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Manage Data Plans & Pricing</h3>
              <button
                onClick={() => {
                  setEditingPlan({ id: '' });
                  setPlanName('');
                  setPlanPrice('');
                  setPlanSize('');
                  setPlanNetwork('MTN');
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Plan</span>
              </button>
            </div>

            <div className="space-y-3">
              {plansList.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-sm flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded font-bold">{p.network}</span>
                      <span>{p.name}</span>
                    </h4>
                    <span className="text-xs text-slate-500">{p.validity} · {p.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-bold font-mono text-base text-emerald-600">₦{p.price.toLocaleString()}</div>
                    <button
                      onClick={() => {
                        setEditingPlan(p);
                        setPlanName(p.name);
                        setPlanPrice(p.price);
                        setPlanSize(p.size);
                        setPlanNetwork(p.network);
                      }}
                      className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {adminTab === 'transactions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold">Platform Transactions Log ({txnsList.length})</h3>
            
            <div className="space-y-3">
              {txnsList.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{t.planName}</h4>
                    <p className="text-xs text-slate-500 font-mono">{t.userName} ({t.recipient}) · {t.reference}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-mono text-sm">₦{t.amount.toLocaleString()}</div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded-full">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {adminTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 max-w-xl">
            <h3 className="text-lg font-bold">VTU API & Gateway Configuration</h3>
            
            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">VTU Upstream Provider Mode</label>
                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                  <option value="LIVE_SIMULATION">Live Simulation (Automated Delivery)</option>
                  <option value="CLUBKONNECT">ClubKonnect VTU API</option>
                  <option value="BILALSUBS">BilalSubs API</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Paystack Secret Key</label>
                <input type="password" value="sk_live_********************************" readOnly className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Airtime Discount (%)</label>
                <input type="number" defaultValue="2.0" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
              </div>

              <button className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                Save Settings
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Credit / Debit User Modal */}
      {creditUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg">Fund / Debit User Wallet</h3>
            <p className="text-xs text-slate-500">User: <strong className="text-slate-900 dark:text-white">{creditUser.name}</strong></p>
            
            <form onSubmit={handleUserCreditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Action</label>
                <select 
                  value={creditAction} 
                  onChange={e => setCreditAction(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                >
                  <option value="CREDIT">Credit Wallet (+)</option>
                  <option value="DEBIT">Debit Wallet (-)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Amount (₦)</label>
                <input 
                  type="number" 
                  required 
                  value={creditAmount} 
                  onChange={e => setCreditAmount(e.target.value)} 
                  placeholder="5000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreditUser(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg">{editingPlan.id ? 'Edit Data Plan' : 'Add New Data Plan'}</h3>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Network</label>
                <select 
                  value={planNetwork} 
                  onChange={e => setPlanNetwork(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                >
                  <option value="MTN">MTN</option>
                  <option value="AIRTEL">AIRTEL</option>
                  <option value="GLO">GLO</option>
                  <option value="9MOBILE">9MOBILE</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Plan Name</label>
                <input 
                  type="text" 
                  required 
                  value={planName} 
                  onChange={e => setPlanName(e.target.value)} 
                  placeholder="MTN 1GB SME"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500">Selling Price (₦)</label>
                <input 
                  type="number" 
                  required 
                  value={planPrice} 
                  onChange={e => setPlanPrice(e.target.value)} 
                  placeholder="260"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
