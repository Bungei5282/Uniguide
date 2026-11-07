import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  BookCheck,
  ShieldCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditCategory, StudentProfile } from '../types';

interface DegreeAuditViewProps {
  categories: AuditCategory[];
  student: StudentProfile;
  onBookAdvisor: () => void;
  onGoToRegistration: () => void;
}

export const DegreeAuditView: React.FC<DegreeAuditViewProps> = ({
  categories,
  student,
  onBookAdvisor,
  onGoToRegistration,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [graduationAuditModal, setGraduationAuditModal] = useState(false);

  const totalRequired = 120;
  const totalEarned = student.creditsEarned; // 106
  const totalInProgress = student.creditsInProgress; // 14
  const remainingForSpring = totalRequired - (totalEarned + totalInProgress); // 0 or whatever remaining units needed for spring (actually 10 credits remaining in Spring 2027 to finish)

  const handleRunAudit = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setGraduationAuditModal(true);
  };

  const filteredCategories =
    selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Degree Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Official Degree Progression Audit
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              On Track for Spring 2027
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {student.major}
          </h2>
          <p className="text-xs text-slate-300">
            Minor: <strong className="text-indigo-300">{student.minor}</strong> • Catalog Year: 2023-2027 • Advisor:{' '}
            <strong className="text-white">{student.advisor.name}</strong>
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 shrink-0 transform hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Verify Graduation Readiness</span>
        </button>
      </div>

      {/* Graduation Progress Bar & Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-slate-400 uppercase font-semibold text-[11px]">Completed Units</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{totalEarned} Credits</div>
          <span className="text-[11px] text-slate-400">88.3% of 120-unit requirement</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-slate-400 uppercase font-semibold text-[11px]">In Progress (Fall 2026)</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{totalInProgress} Credits</div>
          <span className="text-[11px] text-slate-400">CS 380, CS 420, MATH 340, ENG 305</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-slate-400 uppercase font-semibold text-[11px]">Needed for Spring 2027</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">10 Credits</div>
          <span className="text-[11px] text-slate-400">CS 490 Capstone + 1 Elective + Minor</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <span className="text-slate-400 uppercase font-semibold text-[11px]">Upper-Division Residency</span>
          <div className="text-2xl font-extrabold text-white mt-1">45 / 45 Complete</div>
          <span className="text-[11px] text-emerald-400 font-medium">Fulfills 300/400-level rule</span>
        </div>
      </div>

      {/* Prerequisite & Capstone Unlock Roadmap */}
      <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 space-y-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            Spring 2027 Milestone: CS 490 Senior Design Capstone Prerequisite Chain
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          To enroll in **CS 490 Senior Capstone**, all of the following requirements must be verified:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">CS 330</strong>
              <div className="text-[10px] text-emerald-300">Completed (Grade: A)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <strong className="text-white">CS 420 OS</strong>
              <div className="text-[10px] text-indigo-300">In Progress (Grade: B+)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white">Senior Standing</strong>
              <div className="text-[10px] text-emerald-300">106 Units Completed (&gt;90)</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white">Advisor Sign-off</strong>
                <div className="text-[10px] text-amber-300">Hold Active</div>
              </div>
            </div>
            <button
              onClick={onBookAdvisor}
              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded transition"
            >
              Book
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Requirements ({categories.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {c.title.split(' ')[0]} {c.completedCredits}/{c.requiredCredits}
          </button>
        ))}
      </div>

      {/* Requirement Breakdown Cards */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => {
          const isComplete = cat.completedCredits >= cat.requiredCredits;
          const percent = Math.min(
            100,
            Math.round(
              ((cat.completedCredits + cat.inProgressCredits) / cat.requiredCredits) * 100
            )
          );

          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{cat.title}</h3>
                    {isComplete ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Fulfilled
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cat.completedCredits} credits earned • {cat.inProgressCredits} credits in-progress •{' '}
                    {cat.requiredCredits} total required
                  </p>
                </div>

                <div className="w-36 text-right">
                  <span className="text-xs font-semibold text-slate-300">{percent}% Complete</span>
                  <div className="w-full bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isComplete ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Course list within this category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cat.courses.map((course, idx) => {
                  const isDone = course.status === 'completed';
                  const isInProg = course.status === 'in-progress';

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 transition ${
                        isDone
                          ? 'border-slate-800 bg-slate-950/40 text-slate-300'
                          : isInProg
                          ? 'border-indigo-700/60 bg-indigo-950/30 text-indigo-200'
                          : 'border-amber-700/50 bg-amber-950/20 text-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-white text-xs">{course.code}</span>
                        <span className="text-[10px] font-semibold">
                          {isDone ? (
                            <span className="text-emerald-400 font-bold">Grade: {course.grade}</span>
                          ) : isInProg ? (
                            <span className="text-indigo-400 font-semibold">In Progress</span>
                          ) : (
                            <span className="text-amber-400 font-semibold">Missing Requirement</span>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium line-clamp-1">{course.name}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>{course.credits} Credits</span>
                        {course.term && <span>{course.term}</span>}
                        {course.prerequisite && (
                          <span className="text-amber-400 font-medium">Req: {course.prerequisite}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Graduation Audit Modal */}
      {graduationAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Spring 2027 Graduation Audit</h3>
                <p className="text-xs text-slate-400">Official Registrar Readiness Status: APPROVED WITH CONDITIONS</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Cumulative GPA:</span>
                <strong className="text-emerald-400">3.72 (Meets &gt; 2.00 requirement)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Major CS GPA:</span>
                <strong className="text-emerald-400">3.84 (Meets &gt; 2.50 requirement)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>General Education Core:</span>
                <strong className="text-emerald-400">100% Complete (42 / 42 Units)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Expected Units:</span>
                <strong className="text-indigo-300">106 earned + 14 current = 120 Units</strong>
              </div>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-xl text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Remaining Actions Prior to Degree Conferral:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                <li>Resolve $15.00 Library overdue fine.</li>
                <li>Attend Senior Pre-Clearance with Dr. Robert Vance.</li>
                <li>Complete **CS 490 Senior Capstone** (4 cr) during Spring 2027.</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setGraduationAuditModal(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
              >
                Close Audit
              </button>
              <button
                onClick={() => {
                  setGraduationAuditModal(false);
                  onGoToRegistration();
                }}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md"
              >
                Go to Spring Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
