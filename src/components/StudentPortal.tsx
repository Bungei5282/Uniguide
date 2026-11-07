import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  CreditCard,
  UserCheck,
  Search,
  ShoppingCart,
  Plus,
  Trash2,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Hold, StudentProfile } from '../types';

interface StudentPortalProps {
  holds: Hold[];
  student: StudentProfile;
  onPayHold: (hold: Hold) => void;
  onBookAdvisor: () => void;
  onOpenTranscript: () => void;
}

interface CatalogCourse {
  code: string;
  title: string;
  credits: number;
  instructor: string;
  schedule: string;
  seatsRemaining: number;
  prerequisites: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  holds,
  student,
  onPayHold,
  onBookAdvisor,
  onOpenTranscript,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'registration' | 'holds' | 'records'>('registration');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CatalogCourse[]>([
    {
      code: 'CS 490',
      title: 'Senior Design Capstone Project',
      credits: 4,
      instructor: 'Dr. Robert Vance',
      schedule: 'MWF 1:00 PM – 2:30 PM (Turing 201)',
      seatsRemaining: 8,
      prerequisites: 'CS 330, CS 420 & Senior Advisor Clearance',
    },
    {
      code: 'CS 485',
      title: 'Distributed Systems & Cloud Computing',
      credits: 3,
      instructor: 'Dr. Elena Alvarez',
      schedule: 'TTh 10:00 AM – 11:30 AM (Science 104)',
      seatsRemaining: 14,
      prerequisites: 'CS 420 Operating Systems',
    },
  ]);

  const [enrollmentStatus, setEnrollmentStatus] = useState<'idle' | 'success'>('idle');

  const catalogCourses: CatalogCourse[] = [
    {
      code: 'CS 490',
      title: 'Senior Design Capstone Project',
      credits: 4,
      instructor: 'Dr. Robert Vance',
      schedule: 'MWF 1:00 PM – 2:30 PM (Turing 201)',
      seatsRemaining: 8,
      prerequisites: 'CS 330, CS 420 & Senior Advisor Clearance',
    },
    {
      code: 'CS 485',
      title: 'Distributed Systems & Cloud Computing',
      credits: 3,
      instructor: 'Dr. Elena Alvarez',
      schedule: 'TTh 10:00 AM – 11:30 AM (Science 104)',
      seatsRemaining: 14,
      prerequisites: 'CS 420 Operating Systems',
    },
    {
      code: 'DSC 490',
      title: 'Data Science Practicum & Industry Lab',
      credits: 3,
      instructor: 'Dr. Priya Patel',
      schedule: 'Mon 6:00 PM – 8:45 PM (Virtual / Hybrid)',
      seatsRemaining: 19,
      prerequisites: 'DSC 311 & STAT 260',
    },
    {
      code: 'PHIL 340',
      title: 'Ethics in Artificial Intelligence & Robotics',
      credits: 3,
      instructor: 'Dr. Soren Keller',
      schedule: 'TTh 2:00 PM – 3:30 PM (Humanities 110)',
      seatsRemaining: 22,
      prerequisites: 'None (Upper-Division Gen Ed)',
    },
    {
      code: 'CS 488',
      title: 'Cyber Forensics & Incident Response',
      credits: 3,
      instructor: 'Prof. David Thorne',
      schedule: 'Wed 4:00 PM – 6:50 PM (Turing 310)',
      seatsRemaining: 5,
      prerequisites: 'CS 462 Networks',
    },
  ];

  const activeHolds = holds.filter((h) => h.status === 'active');
  const hasRegistrationHolds = activeHolds.length > 0;

  const totalCartCredits = cart.reduce((sum, c) => sum + c.credits, 0);

  const handleAddToCart = (course: CatalogCourse) => {
    if (!cart.some((c) => c.code === course.code)) {
      setCart([...cart, course]);
    }
  };

  const handleRemoveFromCart = (code: string) => {
    setCart(cart.filter((c) => c.code !== code));
  };

  const handleValidateAndRegister = () => {
    if (hasRegistrationHolds) {
      alert('Cannot enroll: You have active registration holds on your account. Please clear your holds first.');
      return;
    }
    setEnrollmentStatus('success');
  };

  const filteredCatalog = catalogCourses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Sub navigation for Portal */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('registration')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'registration'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Course Registration & Cart ({cart.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('holds')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 relative ${
              activeSubTab === 'holds'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Account Holds ({activeHolds.length})</span>
            {activeHolds.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('records')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'records'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official Records & Transcripts</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <span>Priority Enrollment Window:</span>
          <strong className="text-amber-400">Nov 18, 2026 @ 7:00 AM</strong>
        </div>
      </div>

      {/* SUB-TAB 1: REGISTRATION & SHOPPING CART */}
      {activeSubTab === 'registration' && (
        <div className="space-y-6">
          {/* Registration Lock Banner if holds exist */}
          {hasRegistrationHolds ? (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200">
                    Registration Locked: {activeHolds.length} Active Hold{activeHolds.length > 1 ? 's' : ''} Detected
                  </h4>
                  <p className="text-xs text-slate-300">
                    You can add courses to your Spring 2027 Shopping Cart, but enrollment checkout will remain blocked until holds are resolved.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('holds')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition whitespace-nowrap"
              >
                View & Clear Holds
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center space-x-3">
              <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Account Clear for Priority Enrollment!</strong> Zero holds on record. Your Spring 2027 registration queue will open on Tuesday, Nov 18.
              </span>
            </div>
          )}

          {/* Shopping Cart & Course Search Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Course Catalog Search */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Spring 2027 Course Schedule & Catalog Search
                </h3>
                <span className="text-xs text-slate-400">Senior Term Registration</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search course code, subject, professor (e.g. CS 490, Vance, Ethics)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Course Catalog Cards */}
              <div className="space-y-3">
                {filteredCatalog.map((course) => {
                  const inCart = cart.some((c) => c.code === course.code);

                  return (
                    <div
                      key={course.code}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-indigo-400">
                              {course.code}
                            </span>
                            <span className="text-xs text-slate-500">• {course.credits} Credits</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300">
                              {course.seatsRemaining} seats open
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-white mt-1">{course.title}</h4>
                        </div>

                        <button
                          onClick={() => (inCart ? handleRemoveFromCart(course.code) : handleAddToCart(course))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                            inCart
                              ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 hover:bg-red-950 hover:border-red-600 hover:text-red-300'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>In Cart</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <div>
                          <span>Instructor:</span> <strong className="text-slate-200">{course.instructor}</strong>
                        </div>
                        <div>
                          <span>Time:</span> <span className="text-slate-300">{course.schedule}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-amber-400 font-medium">Prerequisites:</span>{' '}
                          <span className="text-slate-300">{course.prerequisites}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Spring 2027 Shopping Cart */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Spring 2027 Shopping Cart</h4>
                  </div>
                  <span className="text-xs font-bold text-indigo-300">{totalCartCredits} Credits</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                    <ShoppingCart className="w-8 h-8 mx-auto text-slate-600" />
                    <p>Your enrollment shopping cart is currently empty.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cart.map((c) => (
                      <div
                        key={c.code}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-white">{c.code}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{c.title}</div>
                          <div className="text-[10px] text-indigo-400">{c.credits} Credits</div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(c.code)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-900 transition"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cart summary */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Spring Units Target:</span>
                    <strong className="text-slate-200">10 Credits</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Units in Cart:</span>
                    <strong className="text-indigo-300">{totalCartCredits} Credits</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Degree Completion Check:</span>
                    <strong className="text-emerald-400">106 + 14 current = 120 Units (Complete!)</strong>
                  </div>
                </div>

                {enrollmentStatus === 'success' ? (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-700 rounded-xl text-xs text-emerald-300 text-center font-bold">
                    Enrollment Cart Validated! Ready for Nov 18 Queue.
                  </div>
                ) : (
                  <button
                    disabled={cart.length === 0}
                    onClick={handleValidateAndRegister}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
                  >
                    {hasRegistrationHolds ? (
                      <>
                        <Lock className="w-4 h-4 text-amber-300" />
                        <span>Validate Cart (Clear Holds First)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Validate Cart & Confirm Prereqs</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Add / Drop / Withdrawal Dates */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2.5">
                <h5 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Important Term Deadlines</span>
                </h5>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Last Day to Withdraw ('W'):</span>
                    <strong className="text-amber-400">Nov 20, 2026 (13 days)</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Senior Priority Registration:</span>
                    <strong className="text-white">Nov 18, 2026</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Final Exams Week:</span>
                    <strong className="text-white">Dec 08 – 15, 2026</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACCOUNT HOLDS RESOLUTION */}
      {activeSubTab === 'holds' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Active & Resolved Account Holds</h3>
              <p className="text-xs text-slate-400">
                Official registrar records of financial, disciplinary, and advising holds.
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {activeHolds.length} Active Requirement{activeHolds.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {holds.map((hold) => {
              const isActive = hold.status === 'active';

              return (
                <div
                  key={hold.id}
                  className={`p-5 rounded-2xl border transition space-y-4 ${
                    isActive
                      ? 'bg-slate-900 border-amber-500/50 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-400">{hold.department}</span>
                        {isActive ? (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300">
                            Action Required
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-300">
                            Resolved
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{hold.title}</h4>
                    </div>

                    {hold.amount && (
                      <span className="text-lg font-bold text-amber-400">${hold.amount.toFixed(2)}</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{hold.impact}</p>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div>
                      <strong>Resolution Process:</strong> {hold.resolutionDetails}
                    </div>
                    <div>
                      <strong>Deadline:</strong> {hold.dueDate}
                    </div>
                  </div>

                  {isActive && (
                    <div className="pt-1">
                      {hold.actionType === 'pay_fee' ? (
                        <button
                          onClick={() => onPayHold(hold)}
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Fine (${hold.amount?.toFixed(2)}) & Lift Hold Now</span>
                        </button>
                      ) : (
                        <button
                          onClick={onBookAdvisor}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Schedule Senior Advising Clearance</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: OFFICIAL RECORDS & TRANSCRIPTS */}
      {activeSubTab === 'records' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Official Transcript Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Official Certified E-Transcript</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct registrar-signed cryptographic electronic transcript for graduate school admissions, employer background checks, or state boards.
              </p>
              <button
                onClick={onOpenTranscript}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
              >
                <span>View & Generate E-Transcript</span>
              </button>
            </div>

            {/* Enrollment Verification Card */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Enrollment Verification Letter</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Official document certifying full-time student status (14 credits in Fall 2026) for health insurance, car discounts, or military benefits.
              </p>
              <button
                onClick={onOpenTranscript}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                Download Verification PDF
              </button>
            </div>

            {/* Grade Appeal & Major Changes */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Petitions & Major / Minor Forms</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit formal requests for academic grade appeals, minor additions, course substitutions, or graduation term amendments.
              </p>
              <button
                onClick={onBookAdvisor}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                Start Petition Form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
