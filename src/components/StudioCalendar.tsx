"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface BookingRange {
  start_date: string;
  end_date: string;
  package: string;
}

interface BlockedDate {
  date: string;
  reason?: string;
}

interface StudioCalendarProps {
  onSelectDate: (date: string) => void;
}

export default function StudioCalendar({ onSelectDate }: StudioCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<BookingRange[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch availability data on mount
  useEffect(() => {
    async function fetchAvailability() {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
          setBlockedDates(data.blocked || []);
        }
      } catch (err) {
        console.error("Failed to load availability:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get first day of the month (0 = Sunday, 1 = Monday...)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format date as YYYY-MM-DD
  const formatDateString = (day: number) => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Check date status
  const getDateStatus = (dateStr: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr < todayStr) return "past";

    // Check manual blockouts
    const isBlocked = blockedDates.some((b) => b.date === dateStr);
    if (isBlocked) return "blocked";

    // Check bookings
    const isBooked = bookings.some((b) => {
      return dateStr >= b.start_date && dateStr <= b.end_date;
    });
    if (isBooked) return "booked";

    return "available";
  };

  // Build grid days
  const days = [];
  // Empty slots for alignment
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(<div key={`empty-${i}`} className="p-3 bg-transparent border border-white/5 opacity-0" />);
  }

  // Days in month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateString(d);
    const status = getDateStatus(dateStr);
    
    let cellStyle = "";
    let statusLabel = "";

    if (status === "past") {
      cellStyle = "text-cream/15 bg-white/2 border-white/5 cursor-not-allowed line-through";
      statusLabel = "Past";
    } else if (status === "available") {
      cellStyle = "text-cream bg-white/5 border-white/10 hover:bg-gold hover:text-ink-soft hover:border-gold hover:scale-[1.05] cursor-pointer shadow-md shadow-black/10 active:scale-95";
      statusLabel = "Available - Click to Book";
    } else if (status === "booked") {
      cellStyle = "text-gold bg-gold/10 border-gold/30 cursor-not-allowed font-medium shadow-inner";
      statusLabel = "Reserved / Booked";
    } else if (status === "blocked") {
      cellStyle = "text-red-400/50 bg-red-950/20 border-red-900/30 cursor-not-allowed";
      statusLabel = "Blocked for Maintenance";
    }

    days.push(
      <button
        key={`day-${d}`}
        disabled={status !== "available"}
        onClick={() => onSelectDate(dateStr)}
        title={statusLabel}
        className={`p-3 md:p-4 border text-xs tracking-wider rounded-md transition-all duration-300 font-sans flex flex-col items-center justify-center min-h-[55px] relative group overflow-hidden ${cellStyle}`}
      >
        <span className="font-bold z-10">{d}</span>
        
        {/* Subtle background glow on hover for available dates */}
        {status === "available" && (
          <span className="absolute inset-0 bg-gradient-to-tr from-gold/0 via-gold/5 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}

        {/* Small visually distinct dot indicator for booked/blocked status */}
        {status === "booked" && (
          <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1 animate-pulse" />
        )}
        {status === "blocked" && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1" />
        )}
      </button>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-ink-soft border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Premium accent header line */}
      <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Header controls */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gold/10 flex items-center justify-center text-gold border border-gold/15">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-serif text-cream text-lg font-bold">
              {monthNames[month]} {year}
            </h3>
            <p className="text-[9px] tracking-[0.25em] text-cream/45 uppercase font-sans mt-0.5 font-semibold">
              Select an available slot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-md border border-white/10 hover:border-gold/30 text-cream/70 hover:text-gold flex items-center justify-center transition-all duration-300"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-md border border-white/10 hover:border-gold/30 text-cream/70 hover:text-gold flex items-center justify-center transition-all duration-300"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-cream/40 tracking-widest uppercase">Fetching dates...</span>
        </div>
      ) : (
        <>
          {/* Days of week labels */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day} className="text-[10px] uppercase tracking-widest text-cream/35 font-bold py-2 font-sans">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {days}
          </div>

          {/* Color Legend with exact visual guides */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5 text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-center">
            
            {/* Available */}
            <div className="flex flex-col items-center gap-2 bg-white/3 border border-white/5 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-cream">
                <CheckCircle2 className="w-3.5 h-3.5 text-cream/60" />
                <span>Available</span>
              </div>
              <span className="text-[8px] text-cream/40 font-light font-sans normal-case tracking-normal">
                Click date to book
              </span>
            </div>

            {/* Booked */}
            <div className="flex flex-col items-center gap-2 bg-gold/5 border border-gold/15 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-gold">
                <XCircle className="w-3.5 h-3.5 text-gold/60" />
                <span>Reserved</span>
              </div>
              <span className="text-[8px] text-gold/40 font-light font-sans normal-case tracking-normal">
                Dates are occupied
              </span>
            </div>

            {/* Blocked */}
            <div className="flex flex-col items-center gap-2 bg-red-950/10 border border-red-950/20 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-red-400/60">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500/40" />
                <span>Maintenance</span>
              </div>
              <span className="text-[8px] text-red-400/30 font-light font-sans normal-case tracking-normal">
                Closed for retreats
              </span>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}
