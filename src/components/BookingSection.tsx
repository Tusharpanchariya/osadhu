"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, CreditCard, Sparkles, AlertCircle, Info, 
  Landmark, HelpCircle, Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Globe, Music, Video, Link, Phone, FileText, User
} from "lucide-react";
import Script from "next/script";
import confetti from "canvas-confetti";

interface BookingRange {
  start_date: string;
  end_date: string;
  booking_type: string;
  time_slot?: string | null;
}

interface BlockedDate {
  date: string;
  reason?: string;
}

interface BookingSectionProps {
  selectedDate?: string;
  onBookingConfirmed: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function BookingSection({ selectedDate = "", onBookingConfirmed }: BookingSectionProps) {
  // Required fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Optional fields
  const [projectArtistName, setProjectArtistName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [soundcloudUrl, setSoundcloudUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [messageNotes, setMessageNotes] = useState("");

  // Booking states
  const [bookingType, setBookingType] = useState<"single" | "range">("range");
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00 AM - 03:00 PM");
  
  // Hover & selection helper for range picker
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Toggle optional fields section
  const [showOptional, setShowOptional] = useState(false);

  // Availability datasets
  const [bookings, setBookings] = useState<BookingRange[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  // Month navigation for date-picker
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Confirm states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentGateway, setPaymentGateway] = useState<"razorpay" | "paypal" | "pay_later">("pay_later");

  // Sync prop selectedDate
  useEffect(() => {
    if (selectedDate) {
      // eslint-disable-next-line
      setStartDate(selectedDate);
      if (bookingType === "single") {
        setEndDate(selectedDate);
      }
    }
  }, [selectedDate, bookingType]);

  // Fetch availability data on mount
  const fetchAvailability = async () => {
    try {
      setLoadingAvailability(true);
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setBlockedDates(data.blocked || []);
      }
    } catch (err) {
      console.error("Failed to load availability:", err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchAvailability();
  }, []);

  const totalDays = (() => {
    if (bookingType === "single") return 1;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return 1;
  })();

  // Date Checker logic for interactive calendar
  const getDateStatus = (dateStr: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr < todayStr) return "past";

    // 1. Check manual blocked dates
    const isBlocked = blockedDates.some((b) => b.date === dateStr);
    if (isBlocked) return "blocked";

    // 2. Check range bookings covering this day
    const rangeBookings = bookings.filter((b) => b.booking_type === "range");
    const isRangeBooked = rangeBookings.some((b) => dateStr >= b.start_date && dateStr <= b.end_date);
    if (isRangeBooked) return "booked";

    // 3. Check single slot bookings
    const singleBookings = bookings.filter((b) => b.booking_type === "single" && b.start_date === dateStr);
    if (singleBookings.length >= 3) {
      return "booked"; // All 3 slots booked
    } else if (singleBookings.length > 0) {
      return "limited"; // Some slots free
    }

    return "available";
  };

  // Calendar render details
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  const selectDateFromPicker = (dateStr: string) => {
    setErrorMsg("");
    if (bookingType === "single") {
      setStartDate(dateStr);
      setEndDate(dateStr);
    } else {
      if (!startDate || (startDate && endDate)) {
        setStartDate(dateStr);
        setEndDate("");
      } else {
        if (dateStr < startDate) {
          // If clicked date is before start date, treat it as new start date
          setStartDate(dateStr);
        } else {
          // Check range availability before confirming end date
          const tempDate = new Date(startDate);
          const finalDate = new Date(dateStr);
          let conflict = false;

          while (tempDate <= finalDate) {
            const currentStr = tempDate.toISOString().split("T")[0];
            const status = getDateStatus(currentStr);
            if (status === "booked" || status === "blocked") {
              conflict = true;
              break;
            }
            tempDate.setDate(tempDate.getDate() + 1);
          }

          if (conflict) {
            setErrorMsg("Your selected range contains unavailable/reserved dates. Please choose another range.");
            setStartDate(dateStr);
            setEndDate("");
          } else {
            setEndDate(dateStr);
          }
        }
      }
    }
  };

  const getDayClassNames = (dateStr: string) => {
    const status = getDateStatus(dateStr);
    const base = "h-11 rounded-md text-xs font-semibold font-sans relative flex items-center justify-center transition-all duration-200 border";
    
    // Status colors
    if (status === "past") {
      return `${base} text-cream/20 bg-white/2 border-white/5 cursor-not-allowed line-through`;
    }
    if (status === "blocked") {
      return `${base} text-red-400/40 bg-red-950/10 border-red-950/20 cursor-not-allowed`;
    }
    if (status === "booked") {
      return `${base} text-gold/30 bg-gold/5 border-gold/10 cursor-not-allowed`;
    }

    // Interactive highlights
    const isSelectedStart = startDate === dateStr;
    const isSelectedEnd = endDate === dateStr;
    const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
    const isHoverRange = startDate && !endDate && hoveredDate && dateStr > startDate && dateStr <= hoveredDate;

    if (isSelectedStart || isSelectedEnd) {
      return `${base} bg-gold text-ink-soft border-gold scale-105 shadow-md shadow-gold/25 z-10`;
    }
    if (isInRange || isHoverRange) {
      return `${base} bg-gold/20 text-gold border-gold/35 z-10`;
    }

    if (status === "limited") {
      return `${base} text-yellow-300 bg-yellow-500/10 border-yellow-500/20 hover:border-gold hover:text-gold cursor-pointer`;
    }

    // Default Available
    return `${base} text-cream bg-white/5 border-white/10 hover:bg-gold hover:text-ink-soft hover:border-gold hover:scale-105 cursor-pointer`;
  };

  const executeBooking = async (paymentId: string = "PAY-TEST-MODE", status: string = "paid") => {
    setIsSubmitting(true);
    try {
      const bookingPayload = {
        name,
        email,
        booking_type: bookingType,
        start_date: startDate,
        end_date: bookingType === "single" ? startDate : endDate,
        time_slot: bookingType === "single" ? timeSlot : null,
        payment_method: paymentGateway,
        payment_status: status,
        payment_id: paymentId,
        // Optional parameters
        instagram_url: instagramUrl || null,
        spotify_url: spotifyUrl || null,
        youtube_url: youtubeUrl || null,
        soundcloud_url: soundcloudUrl || null,
        website_url: websiteUrl || null,
        phone_number: phoneNumber || null,
        project_artist_name: projectArtistName || null,
        message_notes: messageNotes || null
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Reservation failed.");

      setBookingRef(result.booking.booking_reference);
      setIsConfirmed(true);
      
      // Instantly trigger re-fetch of datasets across calendar views
      onBookingConfirmed();
      fetchAvailability();

      // Confetti splash
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#C6A56B", "#F5F0E8", "#1E372D"]
      });
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Reservation processing error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !startDate) {
      setErrorMsg("Please fill in your name, email, and select dates.");
      return;
    }
    if (bookingType === "range" && !endDate) {
      setErrorMsg("Please select an end date for residency stay.");
      return;
    }

    setIsSubmitting(true);

    // Re-verify availability dynamically
    if (bookingType === "single") {
      const isBlocked = blockedDates.some((b) => b.date === startDate);
      const isBooked = bookings.some((b) => b.booking_type === "single" && b.start_date === startDate && b.time_slot === timeSlot);
      const isFullyBooked = bookings.some((b) => b.booking_type === "range" && startDate >= b.start_date && startDate <= b.end_date);
      if (isBlocked || isBooked || isFullyBooked) {
        setErrorMsg("The selected date or slot has been reserved. Please pick another slot.");
        setIsSubmitting(false);
        return;
      }
    } else {
      const temp = new Date(startDate);
      const endLimit = new Date(endDate);
      let conflict = false;
      while (temp <= endLimit) {
        const checkStr = temp.toISOString().split("T")[0];
        const status = getDateStatus(checkStr);
        if (status === "booked" || status === "blocked") {
          conflict = true;
          break;
        }
        temp.setDate(temp.getDate() + 1);
      }
      if (conflict) {
        setErrorMsg("One or more dates in your selected range are occupied. Please select another slot.");
        setIsSubmitting(false);
        return;
      }
    }

    // Payment Processing
    if (paymentGateway === "pay_later") {
      await executeBooking("PAY-LATER-TEST-MODE", "pending");
    } else if (paymentGateway === "razorpay") {
      try {
        const options = {
          key: "rzp_test_placeholder",
          amount: totalDays * 15000 * 100, // ₹15,000 per day in paise
          currency: "INR",
          name: "Osadho Records",
          description: "Residency Reservation Payment",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: function (response: any) {
            executeBooking(response.razorpay_payment_id || "PAY-RAZORPAY", "paid");
          },
          prefill: { name, email },
          theme: { color: "#C6A56B" }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsSubmitting(false);
      } catch {
        setErrorMsg("Razorpay script not ready. Falling back to test transaction.");
        await executeBooking("PAY-RAZORPAY-SIMULATED", "paid");
      }
    } else if (paymentGateway === "paypal") {
      setTimeout(async () => {
        await executeBooking("PAY-PAYPAL-SANDBOX-ID", "paid");
      }, 1000);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setProjectArtistName("");
    setPhoneNumber("");
    setInstagramUrl("");
    setSpotifyUrl("");
    setYoutubeUrl("");
    setSoundcloudUrl("");
    setWebsiteUrl("");
    setMessageNotes("");
    setStartDate("");
    setEndDate("");
    setIsConfirmed(false);
    setErrorMsg("");
    setBookingRef("");
  };

  // Build grid calendar cells
  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-picker-${i}`} className="h-11 bg-transparent border border-white/5 opacity-0" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const status = getDateStatus(formatted);
    calendarCells.push(
      <button
        key={`picker-day-${d}`}
        type="button"
        disabled={status === "past" || status === "booked" || status === "blocked"}
        onClick={() => selectDateFromPicker(formatted)}
        onMouseEnter={() => setHoveredDate(formatted)}
        onMouseLeave={() => setHoveredDate(null)}
        className={getDayClassNames(formatted)}
      >
        <span>{d}</span>
        {status === "limited" && (
          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow-300" />
        )}
      </button>
    );
  }

  return (
    <section id="booking-form-section" className="bg-ink py-24 md:py-36 border-t border-white/5 relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">Reservations Portal</p>
          <h2 className="font-serif font-bold text-cream text-4xl md:text-5xl leading-none">
            Secure Your Stay
          </h2>
          <p className="text-cream/40 max-w-md mx-auto font-sans text-xs tracking-wider uppercase font-light">
            Fill in required credentials, choose dates on the availability picker, and complete checkout.
          </p>
        </div>

        {isConfirmed ? (
          /* Confirmation Success Box */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-ink-soft border border-gold/30 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-bold text-cream">Booking Confirmed</h3>
              <p className="text-gold uppercase tracking-[0.25em] text-[11px] font-bold">
                Reference: {bookingRef}
              </p>
            </div>
            <p className="text-cream/50 text-sm leading-relaxed max-w-md font-sans font-light">
              Your booking has been successfully confirmed. Selected dates have been reserved. Confirmation details have been sent to <span className="font-semibold text-cream">{email}</span>.
            </p>
            <button
              onClick={handleReset}
              className="mt-6 text-[10px] tracking-widest uppercase font-bold border border-gold/30 hover:border-gold text-gold hover:text-cream px-8 py-3.5 rounded-sm transition-all duration-300"
            >
              Book Another Residency
            </button>
          </motion.div>
        ) : (
          /* Main Interactive Booking Form */
          <form onSubmit={handleBookingProcess} className="bg-ink-soft border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl space-y-8">
            
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-950/20 border border-red-900/30 text-red-400 text-xs rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Toggle Stay Type */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setBookingType("single");
                  setStartDate("");
                  setEndDate("");
                }}
                className={`py-3 rounded-md text-[10px] uppercase tracking-widest font-bold font-sans transition-all duration-300 ${
                  bookingType === "single"
                    ? "bg-gold text-ink-soft shadow-lg"
                    : "text-cream/50 hover:text-cream"
                }`}
              >
                Single Day Session
              </button>
              <button
                type="button"
                onClick={() => {
                  setBookingType("range");
                  setStartDate("");
                  setEndDate("");
                }}
                className={`py-3 rounded-md text-[10px] uppercase tracking-widest font-bold font-sans transition-all duration-300 ${
                  bookingType === "range"
                    ? "bg-gold text-ink-soft shadow-lg"
                    : "text-cream/50 hover:text-cream"
                }`}
              >
                Residency Stay (Date Range)
              </button>
            </div>

            {/* Availability Date Picker Calendar Embedded Directly */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-cream/40 font-bold flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-gold" />
                Select Booking Date {bookingType === "range" ? "Range" : ""}
              </label>

              <div className="border border-white/5 bg-black/30 rounded-xl p-5">
                {/* Picker navigation */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <span className="font-serif text-sm font-semibold text-cream">
                    {monthNames[month]} {year}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-7 h-7 rounded border border-white/10 text-cream/60 hover:text-gold flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-7 h-7 rounded border border-white/10 text-cream/60 hover:text-gold flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {loadingAvailability ? (
                  <div className="h-44 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-gold" />
                    <span className="text-[9px] uppercase tracking-widest text-cream/30">Loading availability...</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[9px] uppercase tracking-wider text-cream/30 font-bold">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                        <span key={day} className="py-1">{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells}
                    </div>

                    {/* Interactive inline guidance */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-[9px] text-cream/45 uppercase tracking-wider">
                      <span>
                        {bookingType === "range" ? (
                          !startDate ? "1. Click start date" : !endDate ? "2. Click end date" : "Range selected"
                        ) : (
                          !startDate ? "Click date to select" : "Date selected"
                        )}
                      </span>
                      <span>
                        {startDate && `Selected: ${startDate} ${endDate ? `to ${endDate}` : ""}`}
                      </span>
                    </div>

                    {/* Micro Calendar Legend */}
                    <div className="flex flex-wrap gap-4 mt-3 text-[8px] uppercase tracking-widest font-semibold text-cream/30">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-white/5 border border-white/15" />
                        <span>Available</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-yellow-500/10 border border-yellow-500/20" />
                        <span>Limited Slots</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded bg-gold/10 border border-gold/25" />
                        <span>Fully Booked</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Time Slot Select (For Single Day Only) */}
            {bookingType === "single" && startDate && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2"
              >
                <label className="text-[10px] uppercase tracking-widest text-cream/40 font-bold">
                  Select Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="bg-black/30 border border-white/10 focus:border-gold rounded-md px-4 py-3 text-cream text-xs font-sans focus:outline-none transition-colors cursor-pointer appearance-none"
                >
                  <option value="09:00 AM - 03:00 PM">09:00 AM - 03:00 PM (Morning)</option>
                  <option value="03:00 PM - 09:00 PM">03:00 PM - 09:00 PM (Evening)</option>
                  <option value="09:00 PM - 03:00 AM">09:00 PM - 03:00 AM (Night Owl)</option>
                </select>
              </motion.div>
            )}

            {/* Required Fields Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-cream/40 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold" />
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tushar Sharma"
                  className="bg-black/30 border border-white/10 focus:border-gold rounded-md px-4 py-3 text-cream placeholder:text-cream/20 text-xs font-sans focus:outline-none transition-colors"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-cream/40 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gold" />
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. tushar@gmail.com"
                  className="bg-black/30 border border-white/10 focus:border-gold rounded-md px-4 py-3 text-cream placeholder:text-cream/20 text-xs font-sans focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Expandable Optional Fields Folder */}
            <div className="border border-white/5 bg-black/10 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowOptional(!showOptional)}
                className="w-full px-5 py-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-cream/65 hover:text-cream transition-colors"
              >
                <span>Artist Details &amp; Social Links (Optional)</span>
                {showOptional ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-gold" />}
              </button>

              <AnimatePresence>
                {showOptional && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="px-5 pb-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-5 pt-5"
                  >
                    {/* Project/Artist Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <User className="w-3 h-3 text-gold" /> Project / Artist Name
                      </label>
                      <input
                        type="text"
                        value={projectArtistName}
                        onChange={(e) => setProjectArtistName(e.target.value)}
                        placeholder="e.g. Shoorasena Trio"
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gold" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +91 99999 99999"
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* Instagram URL */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gold" /> Instagram URL
                      </label>
                      <input
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* Spotify URL */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <Music className="w-3 h-3 text-gold" /> Spotify URL
                      </label>
                      <input
                        type="url"
                        value={spotifyUrl}
                        onChange={(e) => setSpotifyUrl(e.target.value)}
                        placeholder="https://open.spotify.com/..."
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* YouTube URL */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <Video className="w-3 h-3 text-gold" /> YouTube URL
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* SoundCloud URL */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <Music className="w-3 h-3 text-gold" /> SoundCloud URL
                      </label>
                      <input
                        type="url"
                        value={soundcloudUrl}
                        onChange={(e) => setSoundcloudUrl(e.target.value)}
                        placeholder="https://soundcloud.com/..."
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* Website URL */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <Link className="w-3 h-3 text-gold" /> Website URL
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none"
                      />
                    </div>

                    {/* Message or Notes */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-wider text-cream/40 font-bold flex items-center gap-1">
                        <FileText className="w-3 h-3 text-gold" /> Message or Project Notes
                      </label>
                      <textarea
                        rows={3}
                        value={messageNotes}
                        onChange={(e) => setMessageNotes(e.target.value)}
                        placeholder="Detail your instrumentation, goals, or stay requests here..."
                        className="bg-black/20 border border-white/5 focus:border-gold rounded-md px-3.5 py-2.5 text-cream placeholder:text-cream/25 text-xs font-sans focus:outline-none resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Totals calculation banner */}
            {startDate && (
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 flex items-center justify-between text-xs font-sans">
                <span className="text-cream/50">Residency Stay Period:</span>
                <span className="font-bold text-gold">
                  {totalDays} {totalDays === 1 ? "Day" : "Days"} (₹{ (totalDays * 15000).toLocaleString() } Total)
                </span>
              </div>
            )}

            {/* Payment selections */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <label className="text-[10px] uppercase tracking-widest text-cream/40 font-bold block">
                Select Payment Option
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Razorpay */}
                <button
                  type="button"
                  onClick={() => setPaymentGateway("razorpay")}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 font-sans ${
                    paymentGateway === "razorpay"
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-black/20 border-white/5 text-cream/60 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">Razorpay</span>
                  <CreditCard className="w-4.5 h-4.5 opacity-70" />
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentGateway("paypal")}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 font-sans ${
                    paymentGateway === "paypal"
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-black/20 border-white/5 text-cream/60 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider">PayPal</span>
                  <Landmark className="w-4.5 h-4.5 opacity-70" />
                </button>

                {/* Pay Later */}
                <button
                  type="button"
                  onClick={() => setPaymentGateway("pay_later")}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 font-sans ${
                    paymentGateway === "pay_later"
                      ? "bg-gold/10 border-gold text-gold"
                      : "bg-black/20 border-white/5 text-cream/60 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-left">
                    Pay Later
                    <span className="block text-[8px] font-light normal-case tracking-normal text-cream/40 mt-0.5">
                      Simulated Test Mode
                    </span>
                  </span>
                  <HelpCircle className="w-4.5 h-4.5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Confirm reservations */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-lt text-ink-soft py-4 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all duration-300 shadow-xl hover:shadow-gold/20 flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Availability &amp; Checkout...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentGateway === "pay_later" ? "Confirm Booking (Test Mode)" : "Proceed to Payment &amp; Confirm"}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
