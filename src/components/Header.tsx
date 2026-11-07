import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  Bot,
  BookOpen,
  CheckSquare,
  DollarSign,
  Calendar,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { StudentProfile, Hold } from '../types';

interface HeaderProps {
  student: StudentProfile;
  holds: Hold[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onToggleFerpa: () => void;
  onOpenHoldModal: (hold: Hold) => void;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  holds,
  activeTab,
  setActiveTab,
  onToggleFerpa,
  onOpenHoldModal,
}) => {
  const activeHolds = holds.filter((h) => h.status === 'active');

  const navItems = [
    { id: 'uniguide', label: 'UniGuide AI', icon: Bot, badge: '24/7' },
    { id: 'academic', label: 'Academic & Grades', icon: BookOpen },
    { id: 'degree-audit', label: 'Degree Audit', icon: GraduationCap },
    {
      id: 'registration',
      label: 'Portal & Registration',
      icon: CheckSquare,
      alert: activeHolds.length > 0,
    },
    { id: 'financial', label: 'Billing & Aid', icon: DollarSign },
    { id: 'campus-life', label: 'Campus Life & Events', icon: Calendar },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top University Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: University & UniGuide Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                STATE UNIVERSITY
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                UniGuide AI Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Official University Student Resource Hub & Academic Companion
            </p>
          </div>
        </div>

        {/* Right: Student Profile & FERPA Shield */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Active Holds Warning Button */}
          {activeHolds.length > 0 && (
            <button
              onClick={() => onOpenHoldModal(activeHolds[0])}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition text-xs font-semibold animate-pulse"
              title="Click to resolve holds"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeHolds.length} Active Hold{activeHolds.length > 1 ? 's' : ''}</span>
            </button>
          )}

          {/* FERPA Privacy Guard Toggle */}
          <button
            onClick={onToggleFerpa}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition ${
              student.ferpaProtected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle FERPA privacy mask for public campus screens"
          >
            {student.ferpaProtected ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">FERPA Shield On</span>
                <EyeOff className="w-3 h-3 text-emerald-400 md:hidden" />
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Public Mode</span>
                <Eye className="w-3 h-3 text-slate-400 md:hidden" />
              </>
            )}
          </button>

          {/* Student Capsule */}
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
              AM
            </div>
            <div className="text-left text-xs leading-tight hidden lg:block">
              <div className="font-semibold text-slate-200">{student.name}</div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <span>{student.ferpaProtected ? student.maskedId : student.id}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">GPA {student.cumulativeGpa.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar border-t border-slate-800/80">
        <nav className="flex space-x-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? 'bg-indigo-800 text-indigo-100'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
