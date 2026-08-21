"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, CreditCard, Sparkles, AlertCircle, Info, 
  Landmark, HelpCircle, Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  X, Check, Plus, MessageSquare, ShieldAlert, User, Phone, Globe, FileText, ArrowRight
} from "lucide-react";
import Script from "next/script";
import confetti from "canvas-confetti";

interface BookingRange {
  start_date: string;
  end_date?: string;
  booking_type?: string;
  time_slot?: string | null;
  room?: string;
}

interface BlockedDate {
  date: string;
  reason?: string;
}

interface BookingSectionProps {
  selectedDate?: string;
  onBookingConfirmed?: () => void;
}

const ROOMS = [
  { id: "himalayan-studio", name: "Himalayan Studio", label: "HIMALAYAN STUDIO" },
];

const PACKAGES_BY_ROOM: Record<string, string[]> = {
  "himalayan-studio": [
    "Himalayan Studio — Residency Session",
    "Himalayan Studio — Recording & Mixing"
  ]
};

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const DURATIONS = [
  "7 Days (Minimum)",
  "14 Days",
  "21 Days",
  "30 Days (Full Month)"
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function BookingSection({ selectedDate = "", onBookingConfirmed }: BookingSectionProps) {
  // Flag to toggle whether the interactive booking flow is expanded or showing the initial CTA cover
  const [isFlowExpanded, setIsFlowExpanded] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState("himalayan-studio");
  
  // Weekly Calendar Navigation State
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  // Drawer / Side Panel open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Accordion section state in Drawer (Step 1 to 5)
  const [openAccordion, setOpenAccordion] = useState<number>(1);

  // Form Fields
  const [selectedPackage, setSelectedPackage] = useState("");
  const [bookingDate, setBookingDate] = useState(selectedDate || new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("10:00");
  const [duration, setDuration] = useState("7 Days (Minimum)");
  const [additionalDates, setAdditionalDates] = useState<{ date: string; time: string }[]>([]);

  // User Credentials
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [artistName, setArtistName] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [messageNotes, setMessageNotes] = useState("");

  // Payment Option
  const [paymentGateway, setPaymentGateway] = useState<"razorpay" | "paypal" | "pay_later">("pay_later");

  // Account Modal / Sign in simulator
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "create">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");

  // Availability datasets
  const [bookings, setBookings] = useState<BookingRange[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

  // Submission & Confirmed state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Pricelist Modal State
  const [showPricelistModal, setShowPricelistModal] = useState(false);

  // Fetch availability data on mount
  const fetchAvailability = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setBlockedDates(data.blocked || []);
      }
    } catch (err) {
      console.error("Failed to load availability:", err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setBookingDate(selectedDate);
      setIsFlowExpanded(true);
    }
  }, [selectedDate]);

  // Set default package when room changes
  useEffect(() => {
    const defaultPkg = PACKAGES_BY_ROOM[selectedRoom]?.[0] || "";
    setSelectedPackage(defaultPkg);
  }, [selectedRoom]);

  // Calculate 6 week days starting from weekStartDate
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const formattedWeekRange = (() => {
    if (weekDays.length === 0) return "";
    const start = weekDays[0];
    const end = weekDays[weekDays.length - 1];
    const startDay = start.getDate();
    const startMonth = start.toLocaleString("default", { month: "short" });
    const endDay = end.getDate();
    const endMonth = end.toLocaleString("default", { month: "short" });
    const endYear = end.getFullYear();

    return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
  })();

  const handlePrevWeek = () => {
    const newStart = new Date(weekStartDate);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStartDate(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekStartDate);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStartDate(newStart);
  };

  // Helper to check if slot is booked
  const isSlotBooked = (dateStr: string, timeSlot: string) => {
    if (blockedDates.some((b) => b.date === dateStr)) return true;

    const dayOfWeek = new Date(dateStr).getDay();
    if (dayOfWeek === 5 && (timeSlot >= "14:00" && timeSlot <= "18:00")) return true;
    if (dayOfWeek === 6 && (timeSlot >= "15:00" && timeSlot <= "19:30")) return true;

    return bookings.some((b) => {
      const isDateMatch = b.start_date <= dateStr && (!b.end_date || b.end_date >= dateStr);
      const isRoomMatch = !b.room || b.room === selectedRoom;
      const isTimeMatch = !b.time_slot || b.time_slot.includes(timeSlot);
      return isDateMatch && isRoomMatch && isTimeMatch;
    });
  };

  const handleCellClick = (dateStr: string, timeSlot: string) => {
    if (isSlotBooked(dateStr, timeSlot)) return;
    setBookingDate(dateStr);
    setStartTime(timeSlot);
    setIsDrawerOpen(true);
    setOpenAccordion(1);
  };

  const handleOpenBookingFlow = () => {
    setIsFlowExpanded(true);
    setTimeout(() => {
      document.getElementById("booking-flow-container")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAddAnotherDate = () => {
    setAdditionalDates((prev) => [
      ...prev,
      { date: bookingDate, time: startTime }
    ]);
  };

  const handleRemoveAdditionalDate = (index: number) => {
    setAdditionalDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSimulateAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    setIsSignedIn(true);
    setName(authEmail.split("@")[0].replace(".", " ").toUpperCase());
    setEmail(authEmail);
    setShowAuthModal(false);
  };

  const executeBooking = async (paymentId: string = "PAY-TEST-MODE", status: string = "paid") => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const roomObj = ROOMS.find(r => r.id === selectedRoom);
      const bookingPayload = {
        name,
        email,
        room: roomObj?.name || selectedRoom,
        package: selectedPackage,
        booking_type: "single", // Added to satisfy backend validation
        start_date: bookingDate,
        end_date: bookingDate,
        time_slot: startTime,
        duration: duration,
        additional_dates: additionalDates,
        payment_method: paymentGateway,
        payment_status: status,
        payment_id: paymentId,
        phone_number: phone || null,
        project_artist_name: artistName || null,
        social_link: socialLink || null,
        message_notes: messageNotes || null
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Reservation failed.");

      setBookingRef(result.booking?.booking_reference || `OSD-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsConfirmed(true);
      
      if (onBookingConfirmed) onBookingConfirmed();
      fetchAvailability();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#CDD4CD", "#F5F0E8", "#1A2530"]
      });
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Reservation processing error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setOpenAccordion(4);
      setErrorMsg("Please provide your Name and Email address in 'YOUR DETAILS'.");
      return;
    }

    setIsSubmitting(true);
    await executeBooking("PAY-LATER-ENQUIRY", "pending");
  };

  const roomObj = ROOMS.find(r => r.id === selectedRoom);

  return (
    <section id="book-session-section" className="bg-ink py-24 md:py-36 border-t border-white/5 relative text-cream font-sans overflow-hidden">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* Ambient background lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 relative z-10">

        {/* ── 1. LUXURY CTA HERO SECTION (Displayed before user clicks "BOOK A SESSION") ── */}
        <div className="relative border border-white/10 bg-gradient-to-b from-ink-soft/90 via-ink-soft/50 to-ink/90 p-10 md:p-20 text-center rounded-none shadow-2xl overflow-hidden group">
          {/* Subtle background texture highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            {/* Studio Branding Accent */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="font-sans text-[11px] tracking-[0.4em] uppercase text-gold font-bold"
            >
              OSADHO RECORDING STUDIOS
            </motion.p>

            {/* Luxurious Serif Title matching screenshot style */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="font-serif font-bold text-cream text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none"
            >
              Book a <span className="font-serif font-normal italic text-gold">Session</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="font-sans text-cream/70 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto tracking-wide"
            >
              A world-class recording sanctuary beside the river in Harsil Valley — built for artists who take their sound seriously.
            </motion.p>

            {/* Action CTA Buttons (as shown in reference screenshot) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                type="button"
                onClick={handleOpenBookingFlow}
                className="w-full sm:w-auto px-10 py-5 bg-gold hover:bg-gold-lt text-ink font-bold text-xs uppercase tracking-[0.25em] transition-all duration-300 shadow-xl shadow-gold/15 hover:shadow-gold/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>BOOK A SESSION</span>
                <ArrowRight className="w-4 h-4 text-ink" />
              </button>

              <button
                type="button"
                onClick={() => setShowPricelistModal(true)}
                className="w-full sm:w-auto px-10 py-5 border border-white/20 hover:border-gold text-cream hover:text-gold font-bold text-xs uppercase tracking-[0.25em] transition-all duration-300 glass-dark cursor-pointer"
              >
                EXPLORE SERVICES &amp; PRICELIST
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── 2. EXPANDABLE BOOKING EXPERIENCE (REVEALED AFTER CLICKING "BOOK A SESSION") ── */}
        <AnimatePresence>
          {isFlowExpanded && (
            <motion.div
              id="booking-flow-container"
              initial={{ opacity: 0, height: 0, y: 30 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 30 }}
              transition={{ duration: 0.8, ease }}
              className="mt-20 pt-16 border-t border-white/10 space-y-12"
            >

              {/* Sub-Header & Close/Collapse button */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
                <div className="space-y-3">
                  <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold font-bold">
                    INTERACTIVE RESERVATION PORTAL
                  </p>
                  <h3 className="font-serif font-bold text-cream text-3xl md:text-4xl tracking-tight">
                    Select Your Room &amp; Session Time
                  </h3>
                  <p className="text-xs text-cream/50 max-w-xl leading-relaxed font-light">
                    Choose a studio space below, browse live timetable slot availability, and select a time slot to complete your reservation details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFlowExpanded(false)}
                  className="self-start md:self-auto text-[10px] uppercase tracking-widest text-cream/40 hover:text-gold transition-colors font-bold flex items-center gap-2 border border-white/10 px-4 py-2"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>CLOSE BOOKING FORM</span>
                </button>
              </div>

              {/* Have an Osadhu account? Banner (matching reference screenshot layout) */}
              <div className="border border-white/10 bg-ink-soft/90 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 max-w-2xl">
                  <h4 className="font-sans font-bold text-sm text-cream tracking-wide">
                    {isSignedIn ? `Welcome back, ${name}!` : "Have an Osadhu account?"}
                  </h4>
                  <p className="text-xs text-cream/50 font-light leading-relaxed">
                    {isSignedIn
                      ? "Your details fill in automatically — and everything you book or buy is saved to your account."
                      : "Sign in and your details fill in automatically — and everything you book or buy is saved to your account. New here? Create one in seconds. Or just continue as a guest below."}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {isSignedIn ? (
                    <button
                      type="button"
                      onClick={() => setIsSignedIn(false)}
                      className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest border border-white/20 hover:border-gold text-cream transition-colors"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setAuthMode("signin"); setShowAuthModal(true); }}
                        className="px-6 py-2.5 bg-gold text-ink hover:bg-gold-lt text-[10px] font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer"
                      >
                        SIGN IN
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthMode("create"); setShowAuthModal(true); }}
                        className="px-6 py-2.5 border border-white/20 hover:border-gold text-cream text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        CREATE ACCOUNT
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Room Selector Tab Bar */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
                  SELECT A ROOM
                </span>
                <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
                  {ROOMS.map((room) => {
                    const isActive = selectedRoom === room.id;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoom(room.id)}
                        className={`px-5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "border border-gold text-gold bg-gold/10 shadow-lg shadow-gold/5"
                            : "border border-white/10 text-cream/50 hover:text-cream hover:border-white/25"
                        }`}
                      >
                        {room.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Room Indicator */}
              <div className="flex items-center justify-between border-y border-white/10 py-3.5 px-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-cream/40 font-bold">ROOM —</span>
                  <span className="font-bold text-cream tracking-wide uppercase">{roomObj?.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextIndex = (ROOMS.findIndex(r => r.id === selectedRoom) + 1) % ROOMS.length;
                    setSelectedRoom(ROOMS[nextIndex].id);
                  }}
                  className="text-[10px] uppercase tracking-widest text-cream/50 hover:text-gold transition-colors font-bold cursor-pointer"
                >
                  CHANGE
                </button>
              </div>

              {/* Weekly Availability Timetable Grid */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold block">
                      AVAILABILITY
                    </span>
                    <p className="text-xs text-cream/70 font-light">
                      {roomObj?.name} — select a time that works for you
                    </p>
                  </div>

                  {/* Week navigation */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handlePrevWeek}
                      className="w-8 h-8 border border-white/15 text-cream/70 hover:text-gold hover:border-gold flex items-center justify-center transition-colors cursor-pointer"
                      title="Previous Week"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-sans font-bold text-xs tracking-wider text-cream">
                      {formattedWeekRange}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextWeek}
                      className="w-8 h-8 border border-white/15 text-cream/70 hover:text-gold hover:border-gold flex items-center justify-center transition-colors cursor-pointer"
                      title="Next Week"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Timetable Grid Container */}
                <div className="border border-white/10 bg-black/40 overflow-x-auto shadow-2xl">
                  <div className="min-w-[720px]">
                    
                    {/* Day Headers Row */}
                    <div className="grid grid-cols-7 border-b border-white/10 bg-ink-soft text-center text-xs py-3 font-bold uppercase tracking-wider">
                      <div className="py-2 text-cream/30 text-[10px] uppercase border-r border-white/5">TIME</div>
                      {weekDays.map((d, idx) => {
                        const dayName = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                        const dayNum = d.getDate();
                        const isToday = d.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
                        return (
                          <div key={idx} className="py-2 space-y-0.5 border-r border-white/5 last:border-r-0">
                            <span className={`text-[10px] block ${isToday ? "text-gold font-extrabold" : "text-cream/50"}`}>
                              {dayName}
                            </span>
                            <span className={`text-sm block ${isToday ? "text-gold font-bold" : "text-cream"}`}>
                              {dayNum}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Time slots rows */}
                    <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                      {TIME_SLOTS.map((slot) => {
                        const isHalfHour = slot.endsWith(":30");
                        return (
                          <div key={slot} className="grid grid-cols-7 text-xs font-sans group">
                            <div className="py-2 px-3 border-r border-white/5 text-cream/40 text-[11px] font-mono flex items-center justify-end pr-4 bg-ink/40">
                              {isHalfHour ? <span className="text-[10px] text-cream/25">:30</span> : slot}
                            </div>

                            {weekDays.map((d, dayIdx) => {
                              const dateStr = d.toISOString().split("T")[0];
                              const booked = isSlotBooked(dateStr, slot);
                              const isSelected = bookingDate === dateStr && startTime === slot && isDrawerOpen;

                              return (
                                <button
                                  key={dayIdx}
                                  type="button"
                                  disabled={booked}
                                  onClick={() => handleCellClick(dateStr, slot)}
                                  className={`h-10 border-r border-white/5 last:border-r-0 transition-all duration-150 relative flex items-center justify-center text-[10px] uppercase font-bold tracking-wider ${
                                    booked
                                      ? "bg-amber-950/40 text-gold/60 cursor-not-allowed border-amber-900/20"
                                      : isSelected
                                      ? "bg-gold text-ink border-gold z-10 shadow-lg shadow-gold/20"
                                      : "hover:bg-gold/15 hover:border-gold/30 cursor-pointer"
                                  }`}
                                >
                                  {booked && (
                                    <span className="text-[9px] tracking-widest text-amber-300/70 uppercase font-semibold">
                                      BOOKED
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </div>

              {/* Bottom Banner */}
              <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-cream/50 text-xs tracking-wide font-light">
                  Not sure which room or package to choose?
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowPricelistModal(true)}
                    className="px-6 py-3 border border-gold/40 hover:border-gold text-gold text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer"
                  >
                    VIEW FULL PRICELIST
                  </button>
                  <a
                    href="https://wa.me/919999999999?text=Hi%20Osadhu%20Studio,%20I'm%20interested%20in%20booking%20a%20session."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 border border-white/15 hover:border-white/40 text-cream text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-gold" />
                    WHATSAPP US
                  </a>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── 3. BOOKING SIDE DRAWER PANEL (Slides in when user clicks an available slot) ── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50"
            />

            {/* Right Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-ink-soft border-l border-white/10 z-50 overflow-y-auto flex flex-col shadow-2xl font-sans text-cream"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/50 sticky top-0 z-20 backdrop-blur-md">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold block">
                    YOUR BOOKING
                  </span>
                  <h3 className="font-serif font-bold text-xl text-cream tracking-wide">
                    {roomObj?.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-9 h-9 rounded-full border border-white/15 hover:border-gold text-cream/70 hover:text-cream flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body Accordion Steps */}
              <div className="p-6 space-y-4 flex-1">

                {errorMsg && (
                  <div className="p-4 bg-red-950/40 border border-red-900/50 text-red-400 text-xs rounded flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {isConfirmed ? (
                  /* Confirmation Success View */
                  <div className="py-8 space-y-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mx-auto text-gold">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-serif text-3xl font-bold text-cream">Booking Reserved!</h4>
                      <p className="text-gold text-xs uppercase tracking-widest font-bold">
                        Reference: {bookingRef}
                      </p>
                    </div>
                    <p className="text-xs text-cream/60 leading-relaxed font-light max-w-sm mx-auto">
                      Thank you <span className="text-cream font-bold">{name}</span>. Your reservation for <span className="text-gold font-semibold">{roomObj?.name}</span> on <span className="text-cream font-semibold">{bookingDate} ({startTime})</span> has been submitted.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsConfirmed(false);
                        setIsDrawerOpen(false);
                      }}
                      className="w-full py-4 bg-gold text-ink font-bold text-[10px] uppercase tracking-widest hover:bg-gold-lt transition-colors shadow-lg cursor-pointer"
                    >
                      DONE &amp; CLOSE PANEL
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBooking} className="space-y-3">
                    
                    {/* STEP 1: BOOKING Accordion */}
                    <div className="border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === 1 ? 0 : 1)}
                        className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cream hover:text-gold transition-colors text-left cursor-pointer"
                      >
                        <span>BOOKING</span>
                        {openAccordion === 1 ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                      </button>

                      <AnimatePresence>
                        {openAccordion === 1 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4 text-xs"
                          >
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                PACKAGE *
                              </label>
                              <select
                                value={selectedPackage}
                                onChange={(e) => setSelectedPackage(e.target.value)}
                                className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                              >
                                {(PACKAGES_BY_ROOM[selectedRoom] || []).map((pkg) => (
                                  <option key={pkg} value={pkg} className="bg-ink text-cream">
                                    {pkg}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                  DATE *
                                </label>
                                <input
                                  type="date"
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                  START TIME *
                                </label>
                                <select
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
                                  className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                                >
                                  {TIME_SLOTS.map((t) => (
                                    <option key={t} value={t} className="bg-ink text-cream">
                                      {t}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                DURATION *
                              </label>
                              <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                              >
                                {DURATIONS.map((dur) => (
                                  <option key={dur} value={dur} className="bg-ink text-cream">
                                    {dur}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {additionalDates.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 text-xs">
                                <span className="text-cream/80">{item.date} at {item.time}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalDate(idx)}
                                  className="text-red-400 hover:text-red-300 text-[10px] uppercase tracking-wider font-bold"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={handleAddAnotherDate}
                              className="w-full py-2.5 border border-white/15 hover:border-gold text-gold text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              ADD ANOTHER DATE
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* STEP 1.1: ADDITIONAL REQUIREMENTS Accordion */}
                    <div className="border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === 5 ? 0 : 5)}
                        className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cream hover:text-gold transition-colors text-left cursor-pointer"
                      >
                        <span>ADDITIONAL REQUIREMENTS</span>
                        {openAccordion === 5 ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                      </button>

                      <AnimatePresence>
                        {openAccordion === 5 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4 text-xs"
                          >
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                CHOOSE THE REQUIREMENT (ADDITIONAL) (IF ANY OTHER) DESCRIBE REQUIREMENT (EMAIL FORMAT)
                              </label>
                              <textarea
                                rows={3}
                                value={messageNotes}
                                onChange={(e) => setMessageNotes(e.target.value)}
                                placeholder="Write any additional requirements here..."
                                className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none resize-none"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* STEP 1.2: ABOUT PROJECT Accordion */}
                    <div className="border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === 6 ? 0 : 6)}
                        className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cream hover:text-gold transition-colors text-left cursor-pointer"
                      >
                        <span>ABOUT PROJECT</span>
                        {openAccordion === 6 ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                      </button>

                      <AnimatePresence>
                        {openAccordion === 6 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4 text-xs"
                          >
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                ABOUT PROJECT (DESCRIBE PROJECT)
                              </label>
                              <textarea
                                rows={3}
                                value={artistName}
                                onChange={(e) => setArtistName(e.target.value)}
                                placeholder="Describe your project..."
                                className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none resize-none"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* STEP 2: SESSION PREP Accordion */}
                    <div className="border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === 2 ? 0 : 2)}
                        className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cream hover:text-gold transition-colors text-left cursor-pointer"
                      >
                        <span>SESSION PREP — {roomObj?.name.toUpperCase()}</span>
                        {openAccordion === 2 ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                      </button>

                      <AnimatePresence>
                        {openAccordion === 2 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-5 space-y-3 border-t border-white/5 pt-4 text-xs text-cream/70 font-light leading-relaxed"
                          >
                            <p>
                              Our sound engineering team will prepare {roomObj?.name} prior to your arrival:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-cream/60">
                              <li>Acoustic calibration &amp; monitoring setup</li>
                              <li>Microphone choices pre-checked and patched</li>
                              <li>High-speed multitrack recording routing</li>
                              <li>Complimentary beverage &amp; lounge access</li>
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* STEP 3: BEFORE YOU BOOK Accordion */}
                    <div className="border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === 3 ? 0 : 3)}
                        className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cream hover:text-gold transition-colors text-left cursor-pointer"
                      >
                        <span>BEFORE YOU BOOK</span>
                        {openAccordion === 3 ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                      </button>

                      <AnimatePresence>
                        {openAccordion === 3 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-5 space-y-3 border-t border-white/5 pt-4 text-xs text-cream/70 font-light leading-relaxed"
                          >
                            <div className="flex items-start gap-2 text-gold">
                              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                              <span className="font-bold text-cream uppercase text-[10px] tracking-wider">Important Booking Policies</span>
                            </div>
                            <p>
                              Please arrive 15 minutes before your scheduled start time. Cancellations made at least 24 hours prior are eligible for rescheduling. Full payment or valid deposit confirms room lock.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* STEP 4: YOUR DETAILS Accordion */}
                    <div className="border border-white/10 bg-black/30">
                      <button
                        type="button"
                        onClick={() => setOpenAccordion(openAccordion === 4 ? 0 : 4)}
                        className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-cream hover:text-gold transition-colors text-left cursor-pointer"
                      >
                        <span>YOUR DETAILS</span>
                        {openAccordion === 4 ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                      </button>

                      <AnimatePresence>
                        {openAccordion === 4 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4 text-xs"
                          >
                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                FULL NAME *
                              </label>
                              <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                EMAIL ADDRESS *
                              </label>
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                  PHONE NUMBER
                                </label>
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  placeholder="+91 99999 99999"
                                  className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                                  INSTAGRAM / WEBSITE LINK
                                </label>
                                <input
                                  type="url"
                                  value={socialLink}
                                  onChange={(e) => setSocialLink(e.target.value)}
                                  placeholder="https://instagram.com/..."
                                  className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream text-xs px-3.5 py-3 font-sans focus:outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Payment Step Removed */}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-6 py-4 bg-gold hover:bg-gold-lt text-ink font-bold text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Enquiry...</span>
                        </>
                      ) : (
                        <span>SUBMIT ENQUIRY</span>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Auth Modal Simulator ── */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-ink-soft border border-white/15 p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-cream/50 hover:text-cream cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif font-bold text-2xl text-cream mb-1">
                {authMode === "signin" ? "Sign In to Osadhu" : "Create Osadhu Account"}
              </h3>
              <p className="text-xs text-cream/50 mb-6 font-light">
                {authMode === "signin"
                  ? "Access your saved bookings and preferences."
                  : "Quickly set up your account to manage your studio sessions."}
              </p>

              <form onSubmit={handleSimulateAuth} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream p-3 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-cream/50 font-bold block">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    required
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/60 border border-white/15 focus:border-gold text-cream p-3 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gold hover:bg-gold-lt text-ink font-bold text-[11px] uppercase tracking-widest transition-colors mt-2 cursor-pointer"
                >
                  {authMode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Pricelist Modal ── */}
      <AnimatePresence>
        {showPricelistModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-ink-soft border border-white/15 p-8 max-w-2xl w-full relative shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setShowPricelistModal(false)}
                className="absolute top-4 right-4 text-cream/50 hover:text-cream cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold mb-1">
                OSADHO RECORDING STUDIOS
              </p>
              <h3 className="font-serif font-bold text-3xl text-cream mb-6">
                Complete Pricelist &amp; Rates
              </h3>

              <div className="space-y-6 text-xs font-sans">
                {ROOMS.map((r) => (
                  <div key={r.id} className="border-b border-white/10 pb-4">
                    <h4 className="font-bold text-sm text-gold uppercase tracking-wider mb-2">{r.name}</h4>
                    <ul className="space-y-1.5 text-cream/70">
                      {(PACKAGES_BY_ROOM[r.id] || []).map((p, idx) => (
                        <li key={idx} className="flex items-center justify-between">
                          <span>{p}</span>
                          <span className="font-mono text-cream font-bold">Starting from ₹3,500/hr</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
