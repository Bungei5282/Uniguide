import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Calculator,
  User,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Course, StudentProfile } from '../types';

interface AcademicDashboardProps {
  courses: Course[];
  student: StudentProfile;
  onOpenMathLab: () => void;
}

export const AcademicDashboard: React.FC<AcademicDashboardProps> = ({
  courses,
  student,
  onOpenMathLab,
}) => {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>('math-340');

  // GPA Simulator State
  const [simulatedGrades, setSimulatedGrades] = useState<{ [courseId: string]: number }>({
    'cs-380': 3.7, // A-
    'cs-420': 3.3, // B+
    'math-340': 2.3, // C+
    'eng-305': 4.0, // A
  });

  const gradeOptions = [
    { label: 'A (4.0)', value: 4.0 },
    { label: 'A- (3.7)', value: 3.7 },
    { label: 'B+ (3.3)', value: 3.3 },
    { label: 'B (3.0)', value: 3.0 },
    { label: 'B- (2.7)', value: 2.7 },
    { label: 'C+ (2.3)', value: 2.3 },
    { label: 'C (2.0)', value: 2.0 },
    { label: 'D (1.0)', value: 1.0 },
    { label: 'F (0.0)', value: 0.0 },
  ];

  // Calculate simulated term GPA and cumulative GPA
  const totalCurrentCredits = courses.reduce((sum, c) => sum + c.credits, 0); // 14
  const simulatedQualityPoints = courses.reduce((sum, c) => {
    const pts = simulatedGrades[c.id] ?? 3.0;
    return sum + pts * c.credits;
  }, 0);
  const projectedTermGpa = simulatedQualityPoints / totalCurrentCredits;

  const previousQualityPoints = student.cumulativeGpa * student.creditsEarned;
  const newCumulativeGpa =
    (previousQualityPoints + simulatedQualityPoints) /
    (student.creditsEarned + totalCurrentCredits);

  const toggleCourse = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative GPA */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Cumulative GPA
              </span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {student.ferpaProtected ? '3.72' : student.cumulativeGpa.toFixed(2)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-emerald-400 font-medium flex items-center space-x-1">
            <span>+0.08 from last semester</span>
          </div>
        </div>

        {/* Major GPA */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                CS Major GPA
              </span>
              <div className="text-3xl font-extrabold text-amber-400 mt-1">
                {student.ferpaProtected ? '3.84' : student.majorGpa.toFixed(2)}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">Upper-division CS coursework</div>
        </div>

        {/* Earned Credits vs Required */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Degree Credits
              </span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {student.creditsEarned}
                <span className="text-base text-slate-400 font-normal"> / {student.creditsRequired}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(student.creditsEarned / student.creditsRequired) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
            <span>{Math.round((student.creditsEarned / student.creditsRequired) * 100)}% Completed</span>
            <span className="text-indigo-300 font-semibold">+14 in-progress</span>
          </div>
        </div>

        {/* Academic Standing */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Academic Standing
              </span>
              <div className="text-lg font-bold text-emerald-400 mt-1.5 leading-snug">
                Dean's Honor Roll
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Top 5% of Engineering Cohort • Eligible for Honors convocation
          </div>
        </div>
      </div>

      {/* Active Academic Alert Callout for MATH 340 */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-amber-200">
                Performance Drop Alert: MATH 340 (Linear Algebra)
              </h4>
              <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded font-bold">
                Grade: C+ (78.5%)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Midterm 2 is scheduled for <strong>Nov 12</strong> (Eigenvalues & SVD). To preserve your 3.7+ cumulative GPA, we recommend scheduling Math Learning Center peer support today.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenMathLab}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition whitespace-nowrap"
        >
          Book Math Tutor Session
        </button>
      </div>

      {/* Main Coursework Breakdown & Assessment List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Course Detail Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Fall 2026 Enrolled Courses & Live Assessments</span>
            </h3>
            <span className="text-xs text-slate-400">14 Active Credits</span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const isExpanded = expandedCourseId === course.id;
              const isAtRisk = course.standing === 'At Risk';

              return (
                <div
                  key={course.id}
                  className={`rounded-2xl border transition overflow-hidden ${
                    isAtRisk
                      ? 'border-amber-500/60 bg-slate-900/90'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleCourse(course.id)}
                    className="p-4 sm:p-5 cursor-pointer flex flex-wrap items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs ${
                          isAtRisk
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{course.currentGrade}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {course.percentage}%
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-500">• {course.credits} Credits</span>
                          {isAtRisk && (
                            <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Academic Notice
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{course.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] text-slate-400 block">Next Milestone</span>
                        <span className="text-xs font-medium text-amber-300">
                          {course.milestoneDate}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Course Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-4">
                      {/* Upcoming Milestone & Syllabus Highlight */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider block">
                            Next Major Milestone
                          </span>
                          <p className="text-slate-200 font-medium mt-1">{course.nextMilestone}</p>
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            Target Due Date: {course.milestoneDate}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                            Syllabus & Late Policy
                          </span>
                          <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                            {course.syllabusPolicy}
                          </p>
                        </div>
                      </div>

                      {/* Instructor Office Hours & Tutoring Resource */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs">
                        <div className="flex items-center space-x-2 text-indigo-300">
                          <User className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>
                            <strong>{course.instructor.name}</strong> • Office Hours:{' '}
                            {course.instructor.officeHours} ({course.instructor.office})
                          </span>
                        </div>
                        {course.tutoringResource && (
                          <button
                            onClick={onOpenMathLab}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition flex items-center space-x-1"
                          >
                            <span>{course.tutoringResource.actionLabel}</span>
                          </button>
                        )}
                      </div>

                      {/* Assignment Weight Breakdown Table */}
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                          Graded Components & Weighting
                        </span>
                        <div className="overflow-x-auto rounded-xl border border-slate-800">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                              <tr>
                                <th className="p-2.5 font-medium">Assignment</th>
                                <th className="p-2.5 font-medium">Due Date</th>
                                <th className="p-2.5 font-medium">Weight</th>
                                <th className="p-2.5 font-medium">Score</th>
                                <th className="p-2.5 font-medium text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                              {course.assignments.map((as) => (
                                <tr key={as.id} className="hover:bg-slate-900/40">
                                  <td className="p-2.5 font-medium text-slate-200">{as.title}</td>
                                  <td className="p-2.5 text-slate-400">{as.dueDate}</td>
                                  <td className="p-2.5 text-slate-300">{as.weight}%</td>
                                  <td className="p-2.5 font-semibold text-white">
                                    {as.score !== null ? `${as.score} / ${as.maxScore}` : '—'}
                                  </td>
                                  <td className="p-2.5 text-right">
                                    {as.status === 'graded' ? (
                                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                                        Graded
                                      </span>
                                    ) : (
                                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-300">
                                        Upcoming
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: "What-If" GPA Calculator & Semester Simulator */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">"What-If" GPA Simulator</h4>
                <p className="text-[11px] text-slate-400">
                  Forecast your final semester grades & degree GPA
                </p>
              </div>
            </div>

            {/* Courses simulated pickers */}
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200">{course.code}</span>
                    <span className="text-slate-500 text-[11px] block">{course.credits} Units</span>
                  </div>
                  <select
                    value={simulatedGrades[course.id] ?? 3.0}
                    onChange={(e) =>
                      setSimulatedGrades({
                        ...simulatedGrades,
                        [course.id]: parseFloat(e.target.value),
                      })
                    }
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {gradeOptions.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Simulated Results Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Projected Term GPA:</span>
                <strong className="text-indigo-300 text-sm">{projectedTermGpa.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-850 pt-2">
                <span className="text-slate-400">New Cumulative GPA:</span>
                <strong className="text-emerald-400 text-base font-bold">
                  {newCumulativeGpa.toFixed(2)}
                </strong>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {newCumulativeGpa >= 3.75 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> High Honors (Dean's List with Distinction)
                  </span>
                ) : (
                  <span>Maintains Dean's Honor Roll standing (&ge; 3.50 required)</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Support Resource Links */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-xs">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Campus Academic Support
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenMathLab}
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-200">Math Learning Center</div>
                  <div className="text-[11px] text-slate-400">Euler Hall 101 • Drop-in tutoring</div>
                </div>
                <ExternalLink className="w-4 h-4 text-indigo-400" />
              </button>
              <a
                href="https://state.edu/writingcenter"
                target="_blank"
                rel="noreferrer"
                className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700 text-left transition flex items-center justify-between block"
              >
                <div>
                  <div className="font-semibold text-slate-200">University Writing Center</div>
                  <div className="text-[11px] text-slate-400">Library 1st Floor • Draft reviews</div>
                </div>
                <ExternalLink className="w-4 h-4 text-indigo-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
