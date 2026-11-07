import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  FileText,
  Download,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  BookOpen,
  MapPin,
} from 'lucide-react';
import { StudentProfile } from '../../types';

interface PayFineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export const PayFineModal: React.FC<PayFineModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'account' | 'dining'>('card');
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setCompleted(false);
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {completed ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Payment Confirmed!</h3>
            <p className="text-sm text-slate-300">
              ${amount.toFixed(2)} settled. Your library registration hold has been officially lifted in the registrar database.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Resolve Account Hold</h3>
                <p className="text-xs text-slate-400">Bizzell Memorial Library Circulation Fine</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/80 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Outstanding Fine</span>
                <p className="text-sm font-medium text-slate-200">Overdue CS Reference Handbook</p>
              </div>
              <span className="text-2xl font-bold text-amber-400">${amount.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Payment Method</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border text-center transition ${
                    paymentMethod === 'card'
                      ? 'border-indigo-500 bg-indigo-950/60 text-white font-medium'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Debit / Credit
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('account')}
                  className={`p-3 rounded-lg border text-center transition ${
                    paymentMethod === 'account'
                      ? 'border-indigo-500 bg-indigo-950/60 text-white font-medium'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('dining')}
                  className={`p-3 rounded-lg border text-center transition ${
                    paymentMethod === 'dining'
                      ? 'border-indigo-500 bg-indigo-950/60 text-white font-medium'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Campus Flex
                </button>
              </div>
            </div>

            <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs text-indigo-300 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <span>Instant Clearance: Once paid, UniGuide will immediately update your registration status for Spring 2027 courses.</span>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Pay ${amount.toFixed(2)}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface BookAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  advisorName: string;
}

export const BookAdvisorModal: React.FC<BookAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  advisorName,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('Monday, Nov 10 @ 2:30 PM');
  const [meetingType, setMeetingType] = useState<'in-person' | 'zoom'>('in-person');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  const handleBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBooked(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setBooked(false);
      }, 1400);
    }, 900);
  };

  const slots = [
    'Monday, Nov 10 @ 2:30 PM (Turing Hall 412)',
    'Tuesday, Nov 11 @ 10:00 AM (Turing Hall 412)',
    'Wednesday, Nov 12 @ 1:30 PM (Zoom Video Conference)',
    'Thursday, Nov 13 @ 3:00 PM (Turing Hall 412)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {booked ? (
          <div className="py-8 text-center space-y-3">
            <UserCheck className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Pre-Clearance Consultation Scheduled!</h3>
            <p className="text-sm text-slate-300">
              Confirmed for <strong>{selectedSlot}</strong> with {advisorName}. An invitation has been added to your university calendar and your advising hold is queued for clearance.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Senior Degree Pre-Clearance</h3>
                <p className="text-xs text-slate-400">Meeting with {advisorName} (Computer Science Faculty Advisor)</p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <span>
                Required for all graduating seniors before Spring priority enrollment opens on <strong>Nov 18</strong>. This clears your registration lock for <strong>CS 490 Capstone</strong>.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Available Time Slot</label>
              <div className="space-y-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                      selectedSlot === slot
                        ? 'border-indigo-500 bg-indigo-950/70 text-white'
                        : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{slot}</span>
                    </div>
                    {selectedSlot === slot && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleBooking}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2"
              >
                {isSubmitting ? <span>Confirming...</span> : <span>Confirm Appointment</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Simulate real download
      const element = document.createElement('a');
      const file = new Blob([
        `OFFICIAL DIGITAL TRANSCRIPT
State University - Office of the University Registrar
FERPA Certified Electronic Document
-----------------------------------------------------------
Student Name: ${student.name}
Student ID: ${student.id}
Degree Program: ${student.major}
Minor: ${student.minor}
Cumulative GPA: ${student.cumulativeGpa.toFixed(2)}
Major GPA: ${student.majorGpa.toFixed(2)}
Credits Earned: ${student.creditsEarned} / ${student.creditsRequired}
Academic Standing: ${student.academicStanding}
Status: Good Standing (Dean's Honor List)
Anticipated Graduation: ${student.expectedGraduation}
Issued Date: November 07, 2026
-----------------------------------------------------------
Valid Registrar Digital Signature: [REG-SECURE-HASH-2026-OK]`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${student.name.replace(/\s+/g, '_')}_Official_Transcript_2026.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Certified Official Transcript</h3>
              <p className="text-xs text-slate-400">Office of the University Registrar • Electronic PDF Delivery</p>
            </div>
          </div>

          {/* Transcript Document Sheet */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 space-y-4 shadow-inner">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <p className="font-bold text-white text-sm">STATE UNIVERSITY</p>
                <p className="text-slate-400 text-[11px]">OFFICE OF THE REGISTRAR & RECORDS</p>
              </div>
              <div className="text-right text-[11px] text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded bg-emerald-950/40">
                FERPA ENCRYPTED VERIFIED
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500">Student:</span> <strong className="text-white">{student.name}</strong>
              </div>
              <div>
                <span className="text-slate-500">ID:</span> <strong className="text-white">{student.ferpaProtected ? student.maskedId : student.id}</strong>
              </div>
              <div>
                <span className="text-slate-500">Major:</span> <span className="text-white">{student.major}</span>
              </div>
              <div>
                <span className="text-slate-500">Minor:</span> <span className="text-white">{student.minor}</span>
              </div>
              <div>
                <span className="text-slate-500">Cumulative GPA:</span> <strong className="text-emerald-400">{student.cumulativeGpa.toFixed(2)}</strong>
              </div>
              <div>
                <span className="text-slate-500">Credits Completed:</span> <span className="text-white">{student.creditsEarned} Units</span>
              </div>
              <div>
                <span className="text-slate-500">Academic Standing:</span> <span className="text-indigo-300">{student.academicStanding}</span>
              </div>
              <div>
                <span className="text-slate-500">Graduation Target:</span> <span className="text-white">{student.expectedGraduation}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded border border-slate-800 text-[11px] text-slate-400">
              * Note: Course details for Fall 2026 are marked In-Progress (14 credits). Official seals are validated through the National Student Clearinghouse.
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium text-sm transition"
            >
              Close
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generating PDF...' : 'Download Certified Transcript'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MathLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MathLabModal: React.FC<MathLabModalProps> = ({ isOpen, onClose }) => {
  const [booked, setBooked] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">University Math Learning Center</h3>
              <p className="text-xs text-slate-400">MATH 340 Linear Algebra Peer & Faculty Tutoring</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-indigo-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Euler Hall, Room 101 (Walk-in & Reserved Desks)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-400">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Monday – Thursday: 10:00 AM – 6:00 PM | Friday: 10:00 AM – 3:00 PM</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tutoring for <strong>MATH 340 (Eigenvalues, Diagonalization, Orthogonality)</strong> is led by graduate teaching assistants and senior math tutors. Drop-ins welcome with student ID, or reserve a 45-minute 1-on-1 prep slot ahead of Midterm 2 (Nov 12).
          </p>

          {booked ? (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1-on-1 tutoring booked for Monday, Nov 10 at 11:00 AM with Tutor Kevin!</span>
            </div>
          ) : (
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium text-xs transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setBooked(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/30 transition flex items-center justify-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5 mr-1" />
                <span>Reserve 1-on-1 Slot</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
