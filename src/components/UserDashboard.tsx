import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Transaction } from '../types';
import { ReceiptModal } from './ReceiptModal';
import { 
  Wallet, Smartphone, Zap, ArrowUpRight, History, Gift, Headphones, 
  User as UserIcon, ShieldCheck, CheckCircle2, Copy, Send, PlusCircle, Search, LogOut,
  ChevronRight, AlertCircle, CreditCard, Building2, HelpCircle
} from 'lucide-react';

interface UserDashboardProps {
  setCurrentView: (view: string) => void;
}

export function UserDashboard({ setCurrentView }: UserDashboardProps) {
  const { 
    user, logout, transactions, dataPlans, settings, 
    buyData, buyAirtime, fundWallet, submitTicket, supportTickets 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'airtime' | 'funding' | 'transactions' | 'referrals' | 'support' | 'profile'>('overview');
  
  // Buy Data state
  const [dataNetwork, setDataNetwork] = useState<'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE'>('MTN');
  const [dataPhone, setDataPhone] = useState(user?.phone || '');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [loadingData, setLoadingData] = useState(false);

  // Buy Airtime state
  const [airtimeNetwork, setAirtimeNetwork] = useState<'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE'>('MTN');
  const [airtimePhone, setAirtimePhone] = useState(user?.phone || '');
  const [airtimeAmount, setAirtimeAmount] = useState('1000');
  const [loadingAirtime, setLoadingAirtime] = useState(false);

  // Fund Wallet state
  const [fundAmount, setFundAmount] = useState('5000');
  const [fundMethod, setFundMethod] = useState('PAYSTACK');
  const [loadingFund, setLoadingFund] = useState(false);

  // Support state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPriority, setTicketPriority] = useState('MEDIUM');

  // Receipt modal state
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [txnSearch, setTxnSearch] = useState('');
  const [txnFilter, setTxnFilter] = useState('ALL');

  if (!user) return null;

  const filteredPlans = dataPlans.filter(p => p.network === dataNetwork);
  const selectedPlan = dataPlans.find(p => p.id === selectedPlanId);

  const handleBuyDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !dataPhone) {
      alert('Please select a data plan and enter phone number.');
      return;
    }
    setLoadingData(true);
    const res = await buyData(dataNetwork, selectedPlanId, dataPhone);
    setLoadingData(false);
    if (res.success) {
      setSelectedPlanId('');
      setActiveTab('transactions');
    }
  };

  const handleBuyAirtimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(airtimeAmount);
    if (isNaN(amountNum) || amountNum < 50 || !airtimePhone) {
      alert('Please enter valid amount (min ₦50) and phone number.');
      return;
    }
    setLoadingAirtime(true);
    const res = await buyAirtime(airtimeNetwork, amountNum, airtimePhone);
    setLoadingAirtime(false);
    if (res.success) {
      setActiveTab('transactions');
    }
  };

  const handleFundWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(fundAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid funding amount.');
      return;
    }
    setLoadingFund(true);
    const res = await fundWallet(amountNum, fundMethod);
    setLoadingFund(false);
    if (res.success) {
      setActiveTab('transactions');
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    const success = await submitTicket(ticketSubject, ticketMessage, ticketPriority);
    if (success) {
      setTicketSubject('');
      setTicketMessage('');
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.reference.toLowerCase().includes(txnSearch.toLowerCase()) || 
                          t.recipient.includes(txnSearch) || 
                          t.planName.toLowerCase().includes(txnSearch.toLowerCase());
    const matchesFilter = txnFilter === 'ALL' || t.type === txnFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="text-left overflow-hidden">
              <h4 className="font-bold text-sm truncate">{user.name}</h4>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                {user.role === 'admin' ? 'Administrator' : 'Smart Earner'}
              </span>
            </div>
          </div>

          <nav className="space-y-1 text-left">
            {[
              { id: 'overview', label: 'Dashboard', icon: Zap },
              { id: 'data', label: 'Buy Data', icon: Smartphone },
              { id: 'airtime', label: 'Buy Airtime', icon: Send },
              { id: 'funding', label: 'Fund Wallet', icon: Wallet },
              { id: 'transactions', label: 'Transactions', icon: History },
              { id: 'referrals', label: 'Referral Program', icon: Gift },
              { id: 'support', label: 'Customer Support', icon: Headphones },
              { id: 'profile', label: 'Profile Settings', icon: UserIcon },
            ].map(item => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {user.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-slate-800 mt-4"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full text-left space-y-8">
        
        {/* Top Wallet Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-emerald-900/60 rounded-full text-xs font-semibold text-emerald-200">
              Available Balance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono">
              ₦{user.walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <p className="text-xs text-emerald-100">
              Account: <strong className="font-mono">{user.accountNumber}</strong> ({user.bankName})
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('funding')}
              className="px-6 py-3 bg-white text-emerald-900 font-bold rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Fund Wallet</span>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className="px-6 py-3 bg-emerald-900/80 hover:bg-emerald-900 text-white font-bold rounded-2xl border border-emerald-700 transition-all text-xs flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Buy Data</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Total Transactions</span>
                <div className="text-2xl font-bold font-mono">{transactions.length}</div>
                <span className="text-[11px] text-emerald-600 font-semibold">100% Successful Delivery</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Referral Earnings</span>
                <div className="text-2xl font-bold font-mono text-emerald-600">₦{user.referralEarnings.toLocaleString()}</div>
                <span className="text-[11px] text-slate-500">Instant commission payouts</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-2">
                <span className="text-xs text-slate-500 font-medium">Account Status</span>
                <div className="text-lg font-bold text-emerald-600 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verified & Active</span>
                </div>
                <span className="text-[11px] text-slate-500">Tier 2 VTU Account</span>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base">Recent Transactions</h3>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {transactions.slice(0, 5).map(txn => (
                  <div 
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        txn.type === 'DATA' ? 'bg-blue-600' : txn.type === 'AIRTIME' ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}>
                        {txn.type.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{txn.planName}</h4>
                        <span className="text-xs text-slate-500 font-mono">{txn.recipient} · {new Date(txn.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-sm">₦{txn.amount.toLocaleString()}</div>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Buy Data */}
        {activeTab === 'data' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">Buy Data Subscription</h3>
            
            <form onSubmit={handleBuyDataSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Select Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MTN', 'AIRTEL', 'GLO', '9MOBILE'] as const).map(net => (
                    <button
                      type="button"
                      key={net}
                      onClick={() => { setDataNetwork(net); setSelectedPlanId(''); }}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                        dataNetwork === net 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Recipient Phone Number</label>
                <input
                  type="tel"
                  required
                  value={dataPhone}
                  onChange={e => setDataPhone(e.target.value)}
                  placeholder="08031234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Select Data Plan</label>
                <select
                  required
                  value={selectedPlanId}
                  onChange={e => setSelectedPlanId(e.target.value)}
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

              {selectedPlan && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-sm">
                  <span>Amount to Pay:</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-600">₦{selectedPlan.price.toLocaleString()}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loadingData}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
              >
                {loadingData ? 'Processing VTU Delivery...' : 'Confirm & Buy Data'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: Buy Airtime */}
        {activeTab === 'airtime' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">Buy Airtime VTU (2% Discount)</h3>

            <form onSubmit={handleBuyAirtimeSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Select Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['MTN', 'AIRTEL', 'GLO', '9MOBILE'] as const).map(net => (
                    <button
                      type="button"
                      key={net}
                      onClick={() => setAirtimeNetwork(net)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                        airtimeNetwork === net 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={airtimePhone}
                  onChange={e => setAirtimePhone(e.target.value)}
                  placeholder="08031234567"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Amount (₦)</label>
                <input
                  type="number"
                  min="50"
                  required
                  value={airtimeAmount}
                  onChange={e => setAirtimeAmount(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-sm">
                <span>Payable Amount (2% Off):</span>
                <span className="text-xl font-extrabold font-mono text-emerald-600">
                  ₦{(parseFloat(airtimeAmount || '0') * 0.98).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button
                type="submit"
                disabled={loadingAirtime}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
              >
                {loadingAirtime ? 'Processing Airtime...' : 'Instant Airtime Topup'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 4: Fund Wallet */}
        {activeTab === 'funding' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">Fund Your Wallet</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFundMethod('PAYSTACK')}
                className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                  fundMethod === 'PAYSTACK' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm">Paystack / Card</h4>
                <p className="text-xs text-slate-500">Instant automated funding</p>
              </button>
              <button
                type="button"
                onClick={() => setFundMethod('BANK_TRANSFER')}
                className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                  fundMethod === 'BANK_TRANSFER' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm">Manual Bank Transfer</h4>
                <p className="text-xs text-slate-500">Transfer to Moniepoint</p>
              </button>
            </div>

            {fundMethod === 'BANK_TRANSFER' && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm">Dedicated Bank Account Details</h4>
                <div className="flex justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-semibold">Moniepoint MFB</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-mono font-bold text-emerald-600">8123456789</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-slate-500">Account Name</span>
                  <span className="font-semibold">MASANI DATA - {user.name}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleFundWalletSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Funding Amount (₦)</label>
                <input
                  type="number"
                  min="100"
                  required
                  value={fundAmount}
                  onChange={e => setFundAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingFund}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
              >
                {loadingFund ? 'Processing Payment...' : `Fund ₦${parseFloat(fundAmount || '0').toLocaleString()} Now`}
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: Transactions */}
        {activeTab === 'transactions' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-xl font-bold">Transaction History</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={txnSearch}
                    onChange={e => setTxnSearch(e.target.value)}
                    placeholder="Search reference or phone..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <select
                  value={txnFilter}
                  onChange={e => setTxnFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                >
                  <option value="ALL">All Types</option>
                  <option value="DATA">Data</option>
                  <option value="AIRTIME">Airtime</option>
                  <option value="FUNDING">Funding</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTransactions.length === 0 ? (
                <p className="text-center py-12 text-slate-500 text-sm">No transactions found.</p>
              ) : (
                filteredTransactions.map(txn => (
                  <div
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-emerald-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        txn.type === 'DATA' ? 'bg-blue-600' : txn.type === 'AIRTIME' ? 'bg-amber-600' : 'bg-emerald-600'
                      }`}>
                        {txn.type.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{txn.planName}</h4>
                        <span className="text-xs text-slate-500 font-mono">{txn.reference} · {new Date(txn.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-sm">₦{txn.amount.toLocaleString()}</div>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold rounded-full">
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Referrals */}
        {activeTab === 'referrals' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">Referral Program Dashboard</h3>
            <p className="text-xs text-slate-500">
              Invite friends to Masani Data and earn instant ₦100 bonus plus commissions on every data subscription!
            </p>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="text-xs font-semibold text-slate-500">Your Unique Referral Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://masanidata.ng/register?ref=${user.referralCode}`}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://masanidata.ng/register?ref=${user.referralCode}`);
                    alert('Referral link copied to clipboard!');
                  }}
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shrink-0 flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Total Referral Earnings</span>
                <div className="text-2xl font-extrabold font-mono text-emerald-600">₦{user.referralEarnings.toLocaleString()}</div>
              </div>
              <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-1">
                <span className="text-xs text-slate-500 font-medium">Referral Code</span>
                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">{user.referralCode}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Support */}
        {activeTab === 'support' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">Customer Support & Help Center</h3>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Subject</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="e.g. Delayed data delivery"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Message</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        )}

        {/* Tab 8: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold">User Profile Settings</h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold">{user.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Email Address</span>
                <span className="font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Phone Number</span>
                <span className="font-mono font-semibold">{user.phone}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Default Bank Account</span>
                <span className="font-semibold">{user.bankName} - {user.accountNumber}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Receipt Modal */}
      <ReceiptModal transaction={selectedTxn} onClose={() => setSelectedTxn(null)} />
    </div>
  );
}
