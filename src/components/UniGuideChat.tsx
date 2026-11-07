import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  FileText,
  Calendar,
  GraduationCap,
  CreditCard,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { ChatMessage, StudentProfile, Hold, Course } from '../types';
import { parseUniGuideResponse } from '../utils/textParser';

interface UniGuideChatProps {
  student: StudentProfile;
  holds: Hold[];
  courses: Course[];
  onTriggerAction: (actionLabel: string) => void;
  onClearHold: (holdId: string) => void;
}

export const UniGuideChat: React.FC<UniGuideChatProps> = ({
  student,
  holds,
  courses,
  onTriggerAction,
  onClearHold,
}) => {
  const activeHolds = holds.filter((h) => h.status === 'active');
  const atRiskCourse = courses.find((c) => c.standing === 'At Risk');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Welcome back, **${student.name}**! I'm **UniGuide AI**, your official University Student Resource companion.

> ⚠️ **Account Alerts Pending Your Attention:**
> - **Library Fine ($15.00):** Registration hold active on your account.
> - **Senior Degree Pre-Clearance:** Mandatory advising check with Dr. Vance required before **November 18**.
> - **Academic Notice:** **MATH 340** grade is at **78.5%** with Midterm 2 scheduled for **Nov 12**.

I can assist you with your degree audit, course registration, tuition billing, tutor bookings, and campus activities today. Try asking a question or tap a suggestion below!

[Clear Holds] [View Degree Audit] [Book Math Tutor Session] [View Campus Events]`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    'How am I looking for graduation next spring, and is there anything happening on campus this afternoon?',
    'Why is my registration blocked and how do I clear my holds?',
    'What is my current tuition balance and financial aid disbursement status?',
    'Show my grades and recommend tutoring for MATH 340',
    'How do I request an official electronic transcript?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          studentContext: {
            activeHoldsCount: activeHolds.length,
            holdsSummary: activeHolds.map((h) => `${h.title} (${h.department})`),
            cumulativeGpa: student.cumulativeGpa,
            majorGpa: student.majorGpa,
            atRiskCourses: atRiskCourse ? `${atRiskCourse.code} (${atRiskCourse.percentage}%)` : 'None',
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I'm having trouble retrieving student records at the moment. Please try again shortly.";

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fallback: data.fallback,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Handle optional text to speech
      if (ttsEnabled && 'speechSynthesis' in window) {
        // Strip markdown formatting for voice
        const cleanVoiceText = replyText
          .replace(/[#*`>\[\]|]/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 350);
        const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        role: 'assistant',
        content: `> ⚠️ **Network Notice:**
I was unable to establish a secure link to the campus server. Please try submitting your query again.

[Go to Course Registration] [View Degree Audit]`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-reset',
        role: 'assistant',
        content: `Chat session reset. I'm ready to answer your questions regarding degree progression, course registration, tuition billing, or campus events.

[How am I looking for graduation next spring?] [Clear Holds]`,
        timestamp: 'Just now',
      },
    ]);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setTtsEnabled(false);
    } else {
      setTtsEnabled(!ttsEnabled);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-slate-900/60 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Header bar of the Companion */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white tracking-tight">UniGuide AI Companion</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Live Records Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              FERPA Compliant • Real-time Registrar, Financial & Campus Event Data
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-lg text-xs font-medium border transition ${
              ttsEnabled
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={ttsEnabled ? 'Disable voice responses' : 'Enable voice reader'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleClearHistory}
            className="p-2 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Proactive Alert Banner (Always Visible on top of chat) */}
      {activeHolds.length > 0 && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Registration Alert:</strong> {activeHolds.length} active hold
              {activeHolds.length > 1 ? 's' : ''} blocking Spring 2027 enrollment.
            </span>
          </div>
          <button
            onClick={() => onTriggerAction('Clear Holds')}
            className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow transition"
          >
            Resolve Holds Now
          </button>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const { html, actions } = !isUser
            ? parseUniGuideResponse(message.content)
            : { html: '', actions: [] };

          return (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs'
                    : 'bg-indigo-900/60 border border-indigo-700/50 text-indigo-300'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 shadow-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950/70 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {isUser ? (
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                ) : (
                  <div>
                    {/* Render rich parsed markdown HTML */}
                    <div
                      className="text-xs sm:text-sm prose-invert leading-relaxed space-y-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-indigo-200 [&_h3]:mt-3 [&_h3]:mb-1.5 [&_strong]:text-amber-300 [&_hr]:border-slate-800 [&_hr]:my-3"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />

                    {/* Action Buttons extracted directly from response */}
                    {actions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                        {actions.map((act) => (
                          <button
                            key={act}
                            onClick={() => onTriggerAction(act)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 text-xs font-semibold shadow transition transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <span>{act}</span>
                            <ArrowRight className="w-3 h-3 text-indigo-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`mt-2 text-[10px] flex items-center justify-between ${
                    isUser ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  <span>{message.timestamp}</span>
                  {!isUser && (
                    <span className="text-[9px] uppercase font-semibold text-slate-400">
                      FERPA Authenticated
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>UniGuide AI is analyzing student records & catalog policies...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 bg-slate-950/50 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-600/60 text-slate-300 hover:text-white transition flex items-center space-x-1.5 shrink-0"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask UniGuide about graduation, holds, GPA, assignments, financial aid..."
            disabled={isLoading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition shadow-lg shadow-indigo-600/30 shrink-0"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
