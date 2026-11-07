import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System Prompt for UniGuide AI
const UNIGUIDE_SYSTEM_INSTRUCTION = `
You are "UniGuide AI," the official AI companion for the University Student Resource Hub.
Your mission is to empower university students by providing a centralized, 24/7 assistant for academic performance tracking, campus life engagement, degree progression, and administrative portal management.

CRITICAL OPERATIONAL RULES & BEHAVIOR:
- Tone: Professional, encouraging, clear, empathetic, and relentlessly focused on student success.
- Action-Oriented: ALWAYS end portal-related queries with clear next steps and clickable action tags in the exact format: [Go to Course Registration], [View Financial Aid Portal], [Book Writing Center], [View Degree Audit], [Clear Holds], [Request Transcript], or [View Campus Events].
- FERPA Compliance: Sensitive data (GPA, grades, financial aid balances) must only be discussed assuming verified student context. Maintain student privacy.
- Proactive Guidance: When discussing academic risk (e.g. course below B-, approaching drop deadline, hold on account), immediately offer a concrete solution (e.g., peer tutoring, professor office hours, hold resolution steps).

RESPONSE FORMATTING STANDARDS:
- Use Markdown Tables for grade summaries, course schedules, and event agendas.
- Use Numbered Lists for multi-step portal procedures (e.g., step-by-step registration or transcript orders).
- Use Callout Blocks ("> ") for urgent warnings, registration drop deadlines, or financial holds.
- Use Bold Text for course codes (e.g., **CS 301**, **MATH 220**), dates, campus locations, and direct action items.

STUDENT PROFILE CONTEXT (Alex Morgan - Senior, Computer Science Major, Data Science Minor):
- Current Cumulative GPA: 3.72 | Major GPA: 3.84 | Standing: Dean's List (Honors)
- Credits Completed: 106 / 120 (14 credits in progress this Fall 2026)
- Anticipated Graduation: Spring 2027 (Needs CS 490 Senior Capstone [4 cr], 1 CS 400-level Tech Elective [3 cr], 1 General Upper-Division Elective [3 cr])
- Current Enrolled Courses:
  * **CS 380**: Database Systems (Grade: A-, 91.4% | Prof. Dr. Alvarez | Office Hours: Tue/Thu 2:00-4:00 PM in Science Hall 342)
  * **CS 420**: Operating Systems (Grade: B+, 88.2% | Prof. Dr. Chen | Office Hours: Mon/Wed 10:00-11:30 AM in Turing Hall 108)
  * **MATH 340**: Linear Algebra & Applications (Grade: C+, 78.5% | Prof. Dr. Patel | Office Hours: Wed/Fri 1:00-2:30 PM in Euler Hall 215) -> *Academic Alert: Recommended Math Lab tutoring!*
  * **ENG 305**: Technical Writing (Grade: A, 94.0% | Prof. Dr. Washington | Office Hours: By appointment, Writing Center Room 102)
- Holds on Account:
  * [REGISTRATION HOLD] Library Overdue Fine: $15.00 (Due immediately; blocks Spring course enrollment)
  * [ADVISORY HOLD] Senior Degree Pre-Clearance Meeting with Advisor Dr. Robert Vance required before Priority Registration opens Nov 18.
- Financial Balance:
  * Current term outstanding: $450.00 (Due Nov 15 on 4-month installment plan).
  * Spring Financial Aid package pending: $4,200 Pell Grant + $3,000 University Merit Scholarship.
  * Work-study position: IT Help Desk Assistant ($16.50/hr, 12 hrs/week, $1,850 remaining allocation).
- Campus Dining & Housing:
  * Dining Plan: 42 meal swipes remaining, $185.50 Dining Dollars.
  * Housing: Oak Ridge Hall, Suite 402B. RA: Samantha Bell.
- Today's Campus Events (Friday):
  * 1:00 PM - 3:00 PM: Career Prep: STEM Resume & Interview Lab (Student Union 204)
  * 3:30 PM - 5:00 PM: Intramural 4v4 Volleyball Finals (Campus Rec Center Court 2)
  * 5:00 PM - 6:30 PM: Student Government Senate Open Forum (Auditorium Hall)
  * 7:00 PM - 9:30 PM: Homecoming Kickoff Cultural Showcase & Night Market (Campus Plaza)
`;

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, studentContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: generateOfflineFallbackResponse(lastUserMsg),
        fallback: true,
      });
    }

    // Convert previous messages to contents format for Gemini 3.8 Flash
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: UNIGUIDE_SYSTEM_INSTRUCTION + (studentContext ? `\nADDITIONAL DYNAMIC CONTEXT: ${JSON.stringify(studentContext)}` : ''),
      },
    });

    return res.json({
      reply: response.text || 'I could not generate a response at this time.',
    });
  } catch (error: any) {
    console.error('Error generating UniGuide response:', error);
    // Provide a helpful, intelligent fallback based on standard UniGuide rules
    const lastUserMsg = req.body.messages?.[req.body.messages.length - 1]?.content || '';
    return res.json({
      reply: generateOfflineFallbackResponse(lastUserMsg),
      error: error?.message,
      fallback: true,
    });
  }
});

// Helper for realistic fallback response adhering strictly to UniGuide rules if offline or key pending
function generateOfflineFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('graduat') || q.includes('next spring') || q.includes('degree audit')) {
    return `### Degree Audit Summary: Spring Graduation Feasibility

Here is your current degree progression for **B.S. in Computer Science**:

| Requirement Category | Required Credits | Earned / In Progress | Status | Remaining Units Needed |
| :--- | :--- | :--- | :--- | :--- |
| **General Education Core** | 42 | 42 | Completed | None |
| **CS Major Core Requirements** | 48 | 44 (40 earned + 4 in-prog) | In Progress | **CS 490** Senior Capstone (4 cr) |
| **CS Technical Electives** | 15 | 12 | In Progress | 1 Course (3 cr, 400-level) |
| **Data Science Minor** | 18 | 15 | In Progress | 1 Course (3 cr) |
| **Total Degree Credits** | **120** | **106** (+14 current) | On Track | **10 credits** for Spring term |

> ⚠️ **CRITICAL REGISTRATION HOLDS DETECTED:**
> 1. **Library Overdue Fine ($15.00):** Must be settled to lift enrollment lock.
> 2. **Senior Advisor Clearance:** You must meet with Dr. Robert Vance before **November 18** to unlock registration for **CS 490**.

---

### Today's Campus Events (Friday Afternoon & Evening)

| Time | Event Name | Location | Category |
| :--- | :--- | :--- | :--- |
| **1:00 PM – 3:00 PM** | Career Prep: STEM Resume & Interview Lab | Student Union 204 | Career Development |
| **3:30 PM – 5:00 PM** | Intramural 4v4 Volleyball Finals | Rec Center Court 2 | Campus Recreation |
| **5:00 PM – 6:30 PM** | Student Government Senate Open Forum | Auditorium Hall | Campus Leadership |
| **7:00 PM – 9:30 PM** | Homecoming Kickoff Showcase & Night Market | Campus Plaza | Student Life & Culture |

**Recommended Next Actions:**
1. Pay your $15.00 library fee to clear your registration hold.
2. Schedule your Senior Capstone pre-clearance with Dr. Vance.
3. Drop by the STEM Resume lab before 3:00 PM today.

[Clear Holds] [Go to Course Registration] [View Degree Audit] [View Campus Events]`;
  }

  if (q.includes('hold') || q.includes('register') || q.includes('enroll') || q.includes('blocked')) {
    return `### Registration & Account Holds Status

> ⚠️ **Active Enrollment Holds on Your Account:**
> - **Hold #1: Library Overdue Balance ($15.00)** — Placed by University Library Circulation Desk. Prevents course registration, transcript requests, and diploma issuance.
> - **Hold #2: Senior Advisor Pre-Clearance** — Required for all graduating seniors registering for **CS 490 Capstone**.

### Steps to Resolve Your Holds:
1. **Clear Library Fee:** Pay online immediately via the Student Financial Portal or at the Bizzell Library 1st Floor desk.
2. **Book Academic Advisor Meeting:** Schedule a 20-minute degree check with Dr. Robert Vance through the Academic Success portal before **November 18**.
3. **Verify Shopping Cart:** Once holds are lifted, validate your Spring course cart to ensure zero prerequisite conflicts.

[Clear Holds] [Go to Course Registration] [Book Academic Advisor]`;
  }

  if (q.includes('grade') || q.includes('math') || q.includes('office hour') || q.includes('gpa')) {
    return `### Current Semester Grade & Performance Report

Your cumulative GPA stands at **3.72** with **Dean's List** standing. Here is your active breakdown:

| Course Code | Course Name | Current Grade | Academic Standing | Next Major Milestone |
| :--- | :--- | :--- | :--- | :--- |
| **CS 380** | Database Systems | **A- (91.4%)** | Strong | Term Project Milestone 3 (Nov 14) |
| **CS 420** | Operating Systems | **B+ (88.2%)** | Good | Kernel Synchronization Lab (Nov 17) |
| **MATH 340** | Linear Algebra & App. | **C+ (78.5%)** | ⚠️ At Risk | Midterm Exam 2 (Nov 12) |
| **ENG 305** | Technical Writing | **A (94.0%)** | Excellent | Final Proposal Draft (Nov 20) |

> 💡 **Academic Support Recommendation for MATH 340:**
> Your grade has dropped below an 80%. We strongly recommend:
> - **Math Learning Center Walk-In Tutoring:** Mon-Thu 10 AM - 6 PM (Euler Hall 101).
> - **Faculty Office Hours:** Dr. Patel holds sessions Wednesdays & Fridays from **1:00 PM – 2:30 PM** in **Euler Hall 215**.

[Book Math Lab Tutoring] [View Grade Dashboard] [Calculate GPA]`;
  }

  if (q.includes('tuition') || q.includes('bill') || q.includes('financial aid') || q.includes('fafsa')) {
    return `### Student Financial & Billing Portal Summary

| Category | Details | Amount / Status | Due Date |
| :--- | :--- | :--- | :--- |
| **Current Term Balance** | Fall Installment #3 | **$450.00** | **Nov 15, 2026** |
| **Spring Financial Aid** | Federal Pell Grant | **$4,200.00 (Pending)** | Disburses Jan 08 |
| **Merit Scholarship** | Dean's Academic Award | **$3,000.00 (Approved)** | Disburses Jan 08 |
| **Campus Work-Study** | IT Help Desk Assistant | **$1,850.00 Available** | Bi-weekly payroll |

> 🔔 **Action Item: 2027-2028 FAFSA Priority Renewal**
> Priority FAFSA filing window is now open. Submit by **December 1** to guarantee maximum institutional aid eligibility.

[View Financial Aid Portal] [Make a Payment] [Work-Study Timesheet]`;
  }

  return `### UniGuide AI Assistant at Your Service

I am synced directly with your University Student Resource records. I can assist you with:

1. **Academic Performance:** Real-time course grades, GPA calculations, and syllabus policy lookups.
2. **Degree Progression:** Spring graduation readiness, missing general education or elective credits, and prerequisite mapping.
3. **Registration & Holds:** Clearing library/advising holds, priority enrollment dates, and shopping cart validation.
4. **Billing & Aid:** Tuition installments, scholarship disbursements, and FAFSA renewal.
5. **Campus Life:** Today's campus events, intramurals, student organizations, and dining balances.

How can I help advance your academic goals today?

[View Degree Audit] [Go to Course Registration] [Check Current Grades] [View Campus Events]`;
}

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniGuide AI server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
