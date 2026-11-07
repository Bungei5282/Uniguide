export interface StudentProfile {
  id: string;
  maskedId: string;
  name: string;
  email: string;
  major: string;
  minor: string;
  college: string;
  classStanding: string;
  academicStanding: string;
  cumulativeGpa: number;
  majorGpa: number;
  creditsEarned: number;
  creditsInProgress: number;
  creditsRequired: number;
  expectedGraduation: string;
  advisor: {
    name: string;
    email: string;
    office: string;
    appointmentUrl: string;
  };
  ferpaProtected: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  weight: number; // percentage
  score: number | null; // e.g. 92
  maxScore: number;
  status: 'graded' | 'submitted' | 'upcoming';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  currentGrade: string; // e.g. "A-"
  percentage: number; // e.g. 91.4
  standing: 'Strong' | 'Good' | 'At Risk';
  instructor: {
    name: string;
    email: string;
    office: string;
    officeHours: string;
  };
  syllabusPolicy: string;
  nextMilestone: string;
  milestoneDate: string;
  recommendation?: string;
  tutoringResource?: {
    name: string;
    location: string;
    actionLabel: string;
  };
  assignments: Assignment[];
}

export interface AuditCourse {
  code: string;
  name: string;
  credits: number;
  grade?: string;
  term?: string;
  status: 'completed' | 'in-progress' | 'remaining';
  prerequisite?: string;
}

export interface AuditCategory {
  id: string;
  title: string;
  requiredCredits: number;
  completedCredits: number;
  inProgressCredits: number;
  courses: AuditCourse[];
}

export interface Hold {
  id: string;
  title: string;
  department: string;
  amount?: number;
  impact: string;
  status: 'active' | 'resolved';
  dueDate: string;
  actionType: 'pay_fee' | 'book_advisor' | 'submit_form';
  resolutionDetails: string;
}

export interface FinancialItem {
  id: string;
  name: string;
  type: 'charge' | 'aid' | 'scholarship';
  amount: number;
  status: 'Pending' | 'Disbursed' | 'Due' | 'Paid';
  date: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  isToday: boolean;
  location: string;
  category: 'Career' | 'Academic' | 'Athletics' | 'Student Life' | 'Arts & Culture';
  organizer: string;
  description: string;
  rsvpCount: number;
  userRsvp: boolean;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  date: string;
  priority: 'urgent' | 'warning' | 'info';
  category: 'Safety' | 'Academics' | 'Facilities' | 'Transit';
  details: string;
  actionText?: string;
}

export interface StudentServiceData {
  dining: {
    mealPlanName: string;
    swipesRemaining: number;
    diningDollars: number;
    guestPasses: number;
  };
  housing: {
    hall: string;
    room: string;
    roommate: string;
    raName: string;
    raEmail: string;
  };
  transit: {
    campusShuttleStatus: string;
    nextBlueLineEta: string;
    parkingPermit: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionTags?: string[];
  fallback?: boolean;
}
