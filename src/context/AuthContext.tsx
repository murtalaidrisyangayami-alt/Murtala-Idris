import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Transaction, DataPlan, SupportTicket, AppSettings } from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: { name: string; email: string; phone: string; password?: string; referralCode?: string }) => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  transactions: Transaction[];
  dataPlans: DataPlan[];
  settings: AppSettings | null;
  supportTickets: SupportTicket[];
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  buyData: (network: string, planId: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  buyAirtime: (network: string, amount: number, phone: string) => Promise<{ success: boolean; error?: string }>;
  fundWallet: (amount: number, method: string) => Promise<{ success: boolean; error?: string }>;
  submitTicket: (subject: string, message: string, priority: string) => Promise<boolean>;
  adminData: any;
  refreshAdminData: () => Promise<void>;
  updateAdminPlan: (plan: any) => Promise<boolean>;
  creditUserBalance: (userId: string, amount: number, action: 'CREDIT' | 'DEBIT') => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('masani_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const fetchPublicData = async () => {
    try {
      const res = await fetch('/api/vtu/plans');
      const data = await res.json();
      if (data.success) {
        setDataPlans(data.plans);
        setSettings(data.settings);
      }
    } catch (e) {
      console.error('Failed to fetch VTU plans', e);
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setTransactions(data.transactions);
        localStorage.setItem('masani_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Failed to refresh user data', e);
    }
  };

  const refreshAdminData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setAdminData(data);
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e);
    }
  };

  useEffect(() => {
    fetchPublicData();
    if (user) {
      refreshUserData();
      if (user.role === 'admin') {
        refreshAdminData();
      }
    }
  }, [user?.id]);

  const login = async (email: string, password = '') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('masani_user', JSON.stringify(data.user));
        showToast(`Welcome back, ${data.user.name}!`);
        return true;
      } else {
        showToast(data.error || 'Login failed', 'error');
        return false;
      }
    } catch (e) {
      showToast('Network error during login', 'error');
      return false;
    }
  };

  const register = async (regData: { name: string; email: string; phone: string; password?: string; referralCode?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('masani_user', JSON.stringify(data.user));
        showToast('Account created successfully! ₦100 welcome bonus added.');
        return true;
      } else {
        showToast(data.error || 'Registration failed', 'error');
        return false;
      }
    } catch (e) {
      showToast('Network error during registration', 'error');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('masani_user');
    showToast('Logged out successfully', 'info');
  };

  const buyData = async (network: string, planId: string, phone: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/vtu/buy-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, network, planId, phone })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setTransactions(prev => [data.transaction, ...prev]);
        showToast(`Successfully purchased ${network} data for ${phone}!`);
        return { success: true };
      } else {
        showToast(data.error || 'Transaction failed', 'error');
        return { success: false, error: data.error };
      }
    } catch (e) {
      showToast('Network error during purchase', 'error');
      return { success: false, error: 'Network error' };
    }
  };

  const buyAirtime = async (network: string, amount: number, phone: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/vtu/buy-airtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, network, amount, phone })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setTransactions(prev => [data.transaction, ...prev]);
        showToast(`Successfully sent ₦${amount} ${network} airtime to ${phone}!`);
        return { success: true };
      } else {
        showToast(data.error || 'Transaction failed', 'error');
        return { success: false, error: data.error };
      }
    } catch (e) {
      showToast('Network error during airtime purchase', 'error');
      return { success: false, error: 'Network error' };
    }
  };

  const fundWallet = async (amount: number, method: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const res = await fetch('/api/wallet/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount, method })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setTransactions(prev => [data.transaction, ...prev]);
        showToast(`Successfully funded wallet with ₦${amount.toLocaleString()}!`);
        return { success: true };
      } else {
        showToast(data.error || 'Funding failed', 'error');
        return { success: false, error: data.error };
      }
    } catch (e) {
      showToast('Network error during wallet funding', 'error');
      return { success: false, error: 'Network error' };
    }
  };

  const submitTicket = async (subject: string, message: string, priority: string) => {
    if (!user) return false;
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, subject, message, priority })
      });
      const data = await res.json();
      if (data.success) {
        setSupportTickets(prev => [data.ticket, ...prev]);
        showToast('Support ticket submitted successfully.');
        return true;
      }
      return false;
    } catch (e) {
      showToast('Failed to submit ticket', 'error');
      return false;
    }
  };

  const updateAdminPlan = async (planData: any) => {
    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      const data = await res.json();
      if (data.success) {
        setDataPlans(data.dataPlans);
        showToast('Data plan updated successfully.');
        return true;
      }
      return false;
    } catch (e) {
      showToast('Failed to update plan', 'error');
      return false;
    }
  };

  const creditUserBalance = async (userId: string, amount: number, action: 'CREDIT' | 'DEBIT') => {
    try {
      const res = await fetch('/api/admin/user-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, action })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully ${action.toLowerCase()}ed user wallet.`);
        refreshAdminData();
        return true;
      }
      return false;
    } catch (e) {
      showToast('Action failed', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, refreshUserData,
      transactions, dataPlans, settings, supportTickets,
      toasts, showToast, buyData, buyAirtime, fundWallet, submitTicket,
      adminData, refreshAdminData, updateAdminPlan, creditUserBalance
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-white font-medium text-sm flex items-center gap-3 transition-all ${
            t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
          }`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
