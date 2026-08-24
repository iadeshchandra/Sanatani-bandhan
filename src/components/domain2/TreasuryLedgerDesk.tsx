import React, { useState } from 'react';
import {
  Landmark,
  Plus,
  Search,
  Filter,
  Download,
  Receipt,
  FileSpreadsheet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAuthWorkspace } from '../../context/AuthWorkspaceContext';
import { useData } from '../../context/DataContext';
import { TreasuryTransaction } from '../../types';
import { generateTaxReceiptPDF } from '../../utils/pdfGenerator';
import { exportToCSV } from '../../utils/csvEngine';
import { useToast } from '../../context/ToastContext';

interface TreasuryLedgerDeskProps {
  onOpenQuickPay: () => void;
}

export const TreasuryLedgerDesk: React.FC<TreasuryLedgerDeskProps> = ({ onOpenQuickPay }) => {
  const { activeWorkspace } = useAuthWorkspace();
  const { treasury } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Income' | 'Expense'>('all');
  const [selectedMemoUrl, setSelectedMemoUrl] = useState<string | null>(null);

  // Financial Metrics
  const totalIncome = treasury
    .filter((t) => t.type === 'Income')
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = treasury
    .filter((t) => t.type === 'Expense')
    .reduce((a, b) => a + b.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const filteredTreasury = treasury.filter((tx) => {
    const matchSearch =
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.devoteeName && tx.devoteeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.handledBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchType = filterType === 'all' || tx.type === filterType;
    return matchSearch && matchType;
  });

  const handlePrintReceipt = async (tx: TreasuryTransaction) => {
    try {
      await generateTaxReceiptPDF(tx, activeWorkspace);
      showToast(`Section 80G Tax Receipt generated for ${tx.devoteeName || 'Devotee'}`, 'success');
    } catch (err: any) {
      showToast('Error generating Tax Receipt PDF', 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ['TX ID', 'Date', 'Type', 'Category', 'Amount', 'Donor / Payee', 'Payment Mode', 'Custody Handled By', 'Purpose', '80G Eligible'];
    const rows = treasury.map((t) => [
      t.id,
      t.date,
      t.type,
      t.category,
      t.amount.toString(),
      t.devoteeName || '',
      t.paymentMode,
      t.handledBy,
      t.purpose,
      t.is80GEligible ? 'YES' : 'NO',
    ]);
    exportToCSV(`Treasury_Ledger_${activeWorkspace.type}_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
    showToast('Double-Entry Ledger CSV exported!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Double-Entry Dharma Accounting
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Audit Verified & Section 80G Compliant
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-100">
            Treasury & Chanda Ledger
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Real-time balance sheet, cash/UPI custody tracking, and instant tax exemption receipts
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            id="log-treasury-tx-btn"
            onClick={onOpenQuickPay}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider">Total Inflow (Chanda)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            + ₹{totalIncome.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Pranami, Pujas & Donations</p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider">Total Outflow (Seva)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">
            - ₹{totalExpense.toLocaleString()}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">Ghee, Utilities, Maintenance</p>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span className="font-bold uppercase tracking-wider">Net Available Treasury</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-stone-100 mt-2">
            ₹{netBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-400/90 mt-1 font-semibold">100% Reconciled</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by category, donor, custody..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'Income', 'Expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-750'
              }`}
            >
              {t === 'all' ? 'All Entries' : t === 'Income' ? 'Inflows (Income)' : 'Outflows (Expense)'}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-stone-400 uppercase bg-stone-950/60 font-semibold border-b border-stone-800">
              <tr>
                <th className="p-3">Date & ID</th>
                <th className="p-3">Type & Category</th>
                <th className="p-3">Devotee / Purpose</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Custody (Handled By)</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {filteredTreasury.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-3">
                    <p className="font-mono text-stone-200 font-semibold">{tx.date}</p>
                    <p className="text-[10px] text-stone-400 font-mono">{tx.id}</p>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        tx.type === 'Income'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {tx.type}
                    </span>
                    <p className="font-semibold text-stone-200 mt-1">{tx.category}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-stone-100">{tx.devoteeName || '-'}</p>
                    <p className="text-[11px] text-stone-400 truncate max-w-[200px]">{tx.purpose}</p>
                  </td>
                  <td className="p-3">
                    <p
                      className={`font-black text-sm ${
                        tx.type === 'Income' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'Income' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                    </p>
                    {tx.is80GEligible && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                        80G Eligible
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <p className="text-stone-300 font-medium">{tx.handledBy}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono border border-stone-700">
                      {tx.paymentMode}
                    </span>
                    {tx.referenceNo && (
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5 truncate max-w-[120px]">
                        {tx.referenceNo}
                      </p>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {tx.memoImageBase64 && (
                        <button
                          type="button"
                          onClick={() => setSelectedMemoUrl(tx.memoImageBase64!)}
                          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                          title="View Payment Memo"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      )}
                      {tx.type === 'Income' && (
                        <button
                          type="button"
                          onClick={() => handlePrintReceipt(tx)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-amber-400 border border-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Download 80G Tax Receipt PDF"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>80G Receipt</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Memo Modal */}
      {selectedMemoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-4 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
              <h4 className="font-bold text-xs">Attached Payment Memo / Voucher</h4>
              <button
                type="button"
                onClick={() => setSelectedMemoUrl(null)}
                className="text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selectedMemoUrl}
              alt="Payment Memo"
              className="rounded-xl w-full max-h-96 object-contain border border-stone-800"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
