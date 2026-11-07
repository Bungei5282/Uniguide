import React, { useState } from 'react';
import { Header } from './components/Header';
import { UniGuideChat } from './components/UniGuideChat';
import { AcademicDashboard } from './components/AcademicDashboard';
import { DegreeAuditView } from './components/DegreeAuditView';
import { StudentPortal } from './components/StudentPortal';
import { FinancialBilling } from './components/FinancialBilling';
import { CampusLife } from './components/CampusLife';
import {
  PayFineModal,
  BookAdvisorModal,
  TranscriptModal,
  MathLabModal,
} from './components/modals/ActionModals';
import {
  initialStudentProfile,
  initialCourses,
  initialDegreeAudit,
  initialHolds,
  initialFinancialItems,
  initialCampusEvents,
  initialAnnouncements,
  initialServices,
} from './data/mockStudentData';
import { Hold, Course } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState(initialStudentProfile);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [degreeAudit, setDegreeAudit] = useState(initialDegreeAudit);
  const [holds, setHolds] = useState<Hold[]>(initialHolds);
  const [financialItems, setFinancialItems] = useState(initialFinancialItems);
  const [campusEvents, setCampusEvents] = useState(initialCampusEvents);
  const [announcements] = useState(initialAnnouncements);
  const [services] = useState(initialServices);

  const [activeTab, setActiveTab] = useState<string>('uniguide');

  // Modals state
  const [isPayFineOpen, setIsPayFineOpen] = useState(false);
  const [selectedHoldToPay, setSelectedHoldToPay] = useState<Hold | null>(null);
  const [isBookAdvisorOpen, setIsBookAdvisorOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isMathLabOpen, setIsMathLabOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleToggleFerpa = () => {
    setStudent((prev) => ({
      ...prev,
      ferpaProtected: !prev.ferpaProtected,
    }));
    showToast(
      student.ferpaProtected
        ? 'FERPA Shield Disabled (Public Mode)'
        : 'FERPA Shield Enabled (Sensitive IDs Masked)'
    );
  };

  const handleOpenHoldModal = (hold: Hold) => {
    if (hold.actionType === 'pay_fee') {
      setSelectedHoldToPay(hold);
      setIsPayFineOpen(true);
    } else if (hold.actionType === 'book_advisor') {
      setIsBookAdvisorOpen(true);
    }
  };

  const handleClearLibraryHoldSuccess = () => {
    setHolds((prev) =>
      prev.map((h) =>
        h.id === 'hold-lib-01' ? { ...h, status: 'resolved' as const } : h
      )
    );
    showToast('Library Hold Officially Cleared! Registration barrier removed.');
  };

  const handleAdvisorBookingSuccess = () => {
    setHolds((prev) =>
      prev.map((h) =>
        h.id === 'hold-adv-02' ? { ...h, status: 'resolved' as const } : h
      )
    );
    showToast('Advisor Clearance Scheduled! CS 490 Capstone lock removed.');
  };

  const handleToggleRsvp = (eventId: string) => {
    setCampusEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextRsvp = !ev.userRsvp;
          showToast(
            nextRsvp ? `RSVP confirmed for ${ev.title}` : `RSVP cancelled for ${ev.title}`
          );
          return {
            ...ev,
            userRsvp: nextRsvp,
            rsvpCount: nextRsvp ? ev.rsvpCount + 1 : ev.rsvpCount - 1,
          };
        }
        return ev;
      })
    );
  };

  // Action tag dispatcher (from [Action Label] inside UniGuide AI responses)
  const handleTriggerAction = (actionLabel: string) => {
    const act = actionLabel.toLowerCase();

    if (act.includes('clear hold') || act.includes('resolve hold') || act.includes('library')) {
      const libHold = holds.find((h) => h.id === 'hold-lib-01');
      if (libHold && libHold.status === 'active') {
        setSelectedHoldToPay(libHold);
        setIsPayFineOpen(true);
      } else {
        setActiveTab('registration');
      }
    } else if (act.includes('course registration') || act.includes('register') || act.includes('shopping cart')) {
      setActiveTab('registration');
    } else if (act.includes('degree audit') || act.includes('graduation')) {
      setActiveTab('degree-audit');
    } else if (act.includes('math') || act.includes('tutor') || act.includes('writing center')) {
      setIsMathLabOpen(true);
    } else if (act.includes('event') || act.includes('campus life')) {
      setActiveTab('campus-life');
    } else if (act.includes('financial') || act.includes('bill') || act.includes('tuition') || act.includes('payment')) {
      setActiveTab('financial');
    } else if (act.includes('transcript') || act.includes('record')) {
      setIsTranscriptOpen(true);
    } else if (act.includes('advisor') || act.includes('pre-clearance')) {
      setIsBookAdvisorOpen(true);
    } else if (act.includes('grade') || act.includes('gpa')) {
      setActiveTab('academic');
    } else {
      showToast(`Navigating to ${actionLabel}...`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-950 border border-emerald-500/60 text-emerald-200 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-semibold animate-slide-up backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main University Hub Header */}
      <Header
        student={student}
        holds={holds}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleFerpa={handleToggleFerpa}
        onOpenHoldModal={handleOpenHoldModal}
      />

      {/* Primary Workspace View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'uniguide' && (
          <UniGuideChat
            student={student}
            holds={holds}
            courses={courses}
            onTriggerAction={handleTriggerAction}
            onClearHold={(id) => {
              const target = holds.find((h) => h.id === id);
              if (target) handleOpenHoldModal(target);
            }}
          />
        )}

        {activeTab === 'academic' && (
          <AcademicDashboard
            courses={courses}
            student={student}
            onOpenMathLab={() => setIsMathLabOpen(true)}
          />
        )}

        {activeTab === 'degree-audit' && (
          <DegreeAuditView
            categories={degreeAudit}
            student={student}
            onBookAdvisor={() => setIsBookAdvisorOpen(true)}
            onGoToRegistration={() => setActiveTab('registration')}
          />
        )}

        {activeTab === 'registration' && (
          <StudentPortal
            holds={holds}
            student={student}
            onPayHold={(hold) => {
              setSelectedHoldToPay(hold);
              setIsPayFineOpen(true);
            }}
            onBookAdvisor={() => setIsBookAdvisorOpen(true)}
            onOpenTranscript={() => setIsTranscriptOpen(true)}
          />
        )}

        {activeTab === 'financial' && (
          <FinancialBilling
            financialItems={financialItems}
            student={student}
          />
        )}

        {activeTab === 'campus-life' && (
          <CampusLife
            events={campusEvents}
            announcements={announcements}
            services={services}
            onToggleRsvp={handleToggleRsvp}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            UniGuide AI • Official University Student Resource Hub • FERPA Compliant
          </span>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Help Desk: (555) 019-HELP</span>
            <span>•</span>
            <span>Registrar: registrar@state.edu</span>
            <span>•</span>
            <span>Campus Police: (555) 019-9000</span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Action Modals */}
      <PayFineModal
        isOpen={isPayFineOpen}
        onClose={() => setIsPayFineOpen(false)}
        onSuccess={handleClearLibraryHoldSuccess}
        amount={selectedHoldToPay?.amount ?? 15.0}
      />

      <BookAdvisorModal
        isOpen={isBookAdvisorOpen}
        onClose={() => setIsBookAdvisorOpen(false)}
        onSuccess={handleAdvisorBookingSuccess}
        advisorName={student.advisor.name}
      />

      <TranscriptModal
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        student={student}
      />

      <MathLabModal
        isOpen={isMathLabOpen}
        onClose={() => setIsMathLabOpen(false)}
      />
    </div>
  );
}
