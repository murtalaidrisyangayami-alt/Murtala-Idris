import React from 'react';
import { Transaction } from '../types';
import { X, CheckCircle2, Printer, Share2, Smartphone } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Transaction Receipt</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6 text-left">
          
          <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Amount Paid</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-600">
              ₦{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
              {transaction.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-semibold">{transaction.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Reference No</span>
              <span className="font-mono font-semibold">{transaction.reference}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Service Type</span>
              <span className="font-semibold">{transaction.type} ({transaction.provider})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Recipient Phone</span>
              <span className="font-mono font-semibold">{transaction.recipient}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Description</span>
              <span className="font-medium text-right max-w-[200px] truncate">{transaction.planName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Date & Time</span>
              <span className="text-xs font-medium">{new Date(transaction.timestamp).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Masani Data Receipt: ${transaction.id} - ${transaction.planName} - ₦${transaction.amount} - ${transaction.status}`);
                alert('Receipt details copied to clipboard!');
              }}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
