import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Utensils,
  Home,
  Bus,
  Shield,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { CampusEvent, CampusAnnouncement, StudentServiceData } from '../types';

interface CampusLifeProps {
  events: CampusEvent[];
  announcements: CampusAnnouncement[];
  services: StudentServiceData;
  onToggleRsvp: (eventId: string) => void;
}

export const CampusLife: React.FC<CampusLifeProps> = ({
  events,
  announcements,
  services,
  onToggleRsvp,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'today' | 'all'>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [diningDollars, setDiningDollars] = useState(services.dining.diningDollars);
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  const categories = ['all', 'Career', 'Athletics', 'Student Life', 'Arts & Culture', 'Academic'];

  const filteredEvents = events.filter((ev) => {
    if (filterPeriod === 'today' && !ev.isToday) return false;
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) return false;
    return true;
  });

  const handleAddDiningFunds = (amt: number) => {
    setDiningDollars((prev) => prev + amt);
    setAddFundsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Campus Services Quick Widgets (Dining, Housing, Transit, Safety) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dining Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Dining Plan & Flex
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {services.dining.swipesRemaining} Swipes
            <span className="text-sm font-semibold text-amber-400 block mt-0.5">
              ${diningDollars.toFixed(2)} Dining Dollars
            </span>
          </div>
          <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400">
            <span>{services.dining.guestPasses} Guest passes</span>
            <button
              onClick={() => setAddFundsOpen(!addFundsOpen)}
              className="text-indigo-400 hover:text-indigo-300 font-bold"
            >
              + Add Funds
            </button>
          </div>

          {addFundsOpen && (
            <div className="mt-2 pt-2 border-t border-slate-800 flex space-x-1">
              {[15, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAddDiningFunds(amt)}
                  className="flex-1 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px]"
                >
                  +${amt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Housing Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Campus Housing
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-bold text-white leading-tight">
            {services.housing.hall}
            <span className="text-xs text-indigo-300 block font-normal">{services.housing.room}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Resident Advisor: <strong className="text-slate-200">{services.housing.raName}</strong>
          </p>
        </div>

        {/* Transit & Shuttle */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Campus Blue Shuttle
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Bus className="w-5 h-5" />
            </div>
          </div>
          <div className="text-base font-bold text-emerald-400">
            {services.transit.nextBlueLineEta}
          </div>
          <p className="text-[11px] text-slate-400">{services.transit.parkingPermit}</p>
        </div>

        {/* Campus Safety Escort */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Campus Safety & Police
            </span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-bold text-white">24/7 SafeRide Escort</div>
          <a
            href="tel:5550199"
            className="inline-block text-xs font-bold text-indigo-400 hover:text-indigo-300"
          >
            Call: (555) 019-9000
          </a>
        </div>
      </div>

      {/* Campus Announcements Marquee / Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Official Campus Bulletins & Announcements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                    ann.priority === 'warning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {ann.category}
                </span>
                <span className="text-[10px] text-slate-500">{ann.date}</span>
              </div>
              <h4 className="font-semibold text-white text-xs">{ann.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{ann.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Events Calendar Header & Filters */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Campus Events & Student Engagement Calendar</span>
            </h3>
            <p className="text-xs text-slate-400">
              Workshops, career recruitments, athletics, and student organization activities.
            </p>
          </div>

          {/* Timeframe tabs */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterPeriod('today')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterPeriod === 'today'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Today's Schedule (Friday)
            </button>
            <button
              onClick={() => setFilterPeriod('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterPeriod === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming This Week
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Events' : cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`p-5 rounded-2xl border transition space-y-3 ${
                event.isToday
                  ? 'bg-slate-900 border-indigo-900/60 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {event.category}
                    </span>
                    {event.isToday && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300">
                        Happening Today
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">{event.title}</h4>
                </div>

                <button
                  onClick={() => onToggleRsvp(event.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
                    event.userRsvp
                      ? 'bg-emerald-950 border border-emerald-600 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${event.userRsvp ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{event.userRsvp ? 'Attending' : 'RSVP'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{event.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 sm:col-span-2">
                  <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>
                    Organized by {event.organizer} • <strong>{event.rsvpCount} students attending</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
