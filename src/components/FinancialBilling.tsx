import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  CreditCard,
  Briefcase,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { FinancialItem, StudentProfile } from '../types';

interface FinancialBillingProps {
  financialItems: FinancialItem[];
  student: StudentProfile;
}

export const FinancialBilling: React.FC<FinancialBillingProps> = ({
  financialItems,
  student,
}) => {
  const [tuitionBalance, setTuitionBalance] = useState(450.0);
  const [isPaying, setIsPaying] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const handleMakePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setTuitionBalance(0);
      setPaidSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Outstanding Term Balance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Current Term Balance
          </span>
          <div className="text-3xl font-extrabold text-white">
            {student.ferpaProtected && tuitionBalance > 0 ? (
              <span className="text-amber-400">$450.00</span>
            ) : (
              <span className={tuitionBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                ${tuitionBalance.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            {tuitionBalance > 0
              ? 'Installment 3 of 4 due Nov 15, 2026'
              : 'All Fall installments paid in full!'}
          </p>
        </div>

        {/* Spring 2027 Aid Total */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Spring 2027 Financial Aid
          </span>
          <div className="text-3xl font-extrabold text-emerald-400">$7,200.00</div>
          <p className="text-[11px] text-slate-400">Pell Grant ($4,200) + Merit ($3,000)</p>
        </div>

        {/* Work Study Balance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Work-Study Funds Available
          </span>
          <div className="text-3xl font-extrabold text-indigo-400">$1,850.00</div>
          <p className="text-[11px] text-slate-400">IT Help Desk • $16.50/hr (112 hrs left)</p>
        </div>

        {/* FAFSA Renewal Status */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            2027-2028 FAFSA Priority
          </span>
          <div className="text-lg font-bold text-amber-400 mt-1">Priority Due Dec 01</div>
          <p className="text-[11px] text-slate-400">Submit early for maximum grant renewal</p>
        </div>
      </div>

      {/* Payment Action Box */}
      {tuitionBalance > 0 && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fall 2026 Installment Plan #3 of 4</h4>
              <p className="text-xs text-slate-300">
                Amount Due: <strong>${tuitionBalance.toFixed(2)}</strong> by <strong>November 15, 2026</strong>. Late fee of $25.00 applied after midnight.
              </p>
            </div>
          </div>
          <button
            disabled={isPaying}
            onClick={handleMakePayment}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition whitespace-nowrap flex items-center space-x-2"
          >
            {isPaying ? (
              <span>Authorizing Payment...</span>
            ) : (
              <>
                <span>Make Payment (${tuitionBalance.toFixed(2)})</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {paidSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Payment of $450.00 successful! Your receipt has been sent to <strong>{student.email}</strong>.
          </span>
        </div>
      )}

      {/* Financial Aid & Account Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Transaction & Aid History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Financial Aid Awards & Billing Statement
            </h3>
            <span className="text-xs text-slate-400">Academic Year 2026-2027</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="p-3.5">Description</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Disbursement / Due Date</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {financialItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-medium text-slate-200">{item.name}</td>
                    <td className="p-3.5 text-slate-400 capitalize">{item.type}</td>
                    <td
                      className={`p-3.5 font-bold ${
                        item.type === 'charge' ? 'text-slate-200' : 'text-emerald-400'
                      }`}
                    >
                      {item.type === 'charge' ? '-' : '+'}
                      ${item.amount.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-slate-400">{item.date}</td>
                    <td className="p-3.5 text-right">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          item.status === 'Disbursed' || item.status === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : item.status === 'Pending'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Campus Work-Study & Tax Statements */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">Federal Work-Study Position</h4>
            </div>
            <div className="text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <strong>IT Help Desk Technician</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hourly Wage:</span>
                <strong className="text-emerald-400">$16.50 / hour</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hours Cap:</span>
                <span>12 hrs/week (Class priority)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Paycheck:</span>
                <span>Nov 14, 2026 (Direct Deposit)</span>
              </div>
            </div>
            <a
              href="https://state.edu/workstudy/timesheet"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center block transition border border-slate-700 mt-2"
            >
              Submit Electronic Timesheet
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tax Documents & 1098-T</span>
            </h4>
            <p className="text-slate-400 text-[11px]">
              Form 1098-T (Tuition Statement for IRS education tax credits) is generated by January 31.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-[11px]">
              <span>2025 Form 1098-T (PDF)</span>
              <button
                onClick={() => alert('Downloading 2025 Form 1098-T tuition statement...')}
                className="text-indigo-400 hover:text-indigo-300 font-bold"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
