"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Calendar, Info, Loader2, Sparkles, Mic, Monitor, Headphones, X, ArrowRight, ArrowLeft } from "lucide-react";

const SERVICES_OPTIONS = [
  "Recording", "Vocal Recording", "Instrument Recording", "Podcast Recording", "Live Session Recording",
  "Production", "Music Production", "Mixing", "Mastering", "Editing", "Sound Design", "Film Scoring",
  "Meditation Music", "Healing Frequencies"
];

const INSTRUMENT_OPTIONS = [
  "Guitar", "Harmonium", "Swarmandal", "Frequency Instruments"
];

const MICROPHONE_OPTIONS = [
  "Neumann TLM 102", "Lewitt RAY", "AKG P420"
];

const FACILITIES_OPTIONS = [
  "Professional Recording Studio", "Acoustic Recording Room", "Music Production Setup", 
  "Mixing & Mastering", "Yamaha Professional PA System", "Lyric & Music Stands", 
  "High-quality Monitoring", "Songwriting Space", "Collaboration Area"
];

const ACCOMMODATION_OPTIONS = [
  "Private Room", "Twin Sharing", "Vegetarian Meals", "Vegan Meals", "Airport Pickup", 
  "Local Transportation Assistance", "High-Speed Wi-Fi", "Meditation Space", "Yoga Space"
];

const COUNTRY_CODES = [
  { code: "+1", country: "USA/CAN" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+971", country: "UAE" },
  { code: "+41", country: "Switzerland" },
];

export default function ResidencyEnquiryForm({ isOpen, onClose, initialStartDate = "" }: { isOpen?: boolean; onClose?: () => void; initialStartDate?: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    startDate: initialStartDate,
    endDate: "",
    artistName: "",
    contactPerson: "",
    email: "",
    countryCode: "+91",
    phone: "",
    instagram: "",
    country: "",
    city: "",
    website: "",
    streamingLink: "",
    projectDescription: "",
    services: [] as string[],
    instruments: [] as string[],
    otherInstrument: "",
    microphones: [] as string[],
    studioRecommendation: false,
    facilities: [] as string[],
    accommodation: [] as string[],
    notes: ""
  });

  useEffect(() => {
    if (initialStartDate) {
      setFormData(prev => ({ ...prev, startDate: initialStartDate }));
    }
    // Prevent body scroll when open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [initialStartDate, isOpen]);

  const [dateError, setDateError] = useState("");

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const todayStr = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  const minEndDate = useMemo(() => {
    if (!formData.startDate) return todayStr;
    const start = new Date(formData.startDate);
    start.setDate(start.getDate() + 6); // Add 6 days to ensure at least 7 days duration
    return start.toISOString().split('T')[0];
  }, [formData.startDate, todayStr]);

  const totalDays = useMemo(() => calculateDays(formData.startDate, formData.endDate), [formData.startDate, formData.endDate]);

  const validateDates = () => {
    if (totalDays < 7) {
      setDateError("Artist residencies require a minimum stay of 7 days.");
      return false;
    }
    setDateError("");
    return true;
  };

  const scrollToTop = () => {
    const modalContent = document.getElementById("enquiry-scroll-area");
    if (modalContent) {
      modalContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.startDate || !formData.endDate) {
        setDateError("Please select both start and end dates.");
        return;
      }
      if (!validateDates()) return;
    }
    setStep(prev => prev + 1);
    scrollToTop();
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    scrollToTop();
  };

  const toggleArrayItem = (field: keyof typeof formData, item: string) => {
    setFormData(prev => {
      const array = prev[field as keyof typeof formData] as string[];
      if (array.includes(item)) {
        return { ...prev, [field]: array.filter(i => i !== item) };
      }
      return { ...prev, [field]: [...array, item] };
    });
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const fullPhone = formData.countryCode + formData.phone;
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, phone: fullPhone, totalDays })
      });
      
      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Failed to submit enquiry. Please try again later.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen !== false && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-cream flex flex-col w-full h-full"
        >
          {/* Header */}
          <header className="w-full flex items-center justify-between px-6 py-6 border-b border-pine/10 bg-white/80 backdrop-blur-md z-10 sticky top-0 shrink-0">
            <div className="flex items-center gap-4">
              <span className="font-sans font-semibold tracking-[0.2em] uppercase text-pine text-xs md:text-sm">
                Osadho <span className="text-gold">Residency</span>
              </span>
            </div>
            
            {!isSuccess && (
              <div className="hidden md:flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step === num ? 'bg-pine text-cream ring-2 ring-pine ring-offset-2' : step > num ? 'bg-pine text-cream' : 'bg-gray-200 text-[#1A2530]'}`}>
                      {step > num ? <Check className="w-4 h-4" /> : num}
                    </div>
                    {num < 5 && <div className={`w-10 h-px transition-all duration-300 ${step > num ? 'bg-pine' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
            )}

            {onClose && (
              <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-pine-dark transition-colors flex items-center gap-2 pr-4 group">
                <X className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-pine">Close</span>
              </button>
            )}
          </header>

          {/* Scrollable Content */}
          <div id="enquiry-scroll-area" className="flex-1 overflow-y-auto w-full relative">
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-pine/5 to-transparent pointer-events-none -z-10" />
            
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 min-h-full flex flex-col">
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="m-auto text-center space-y-6 bg-white p-12 rounded-3xl shadow-2xl border border-pine/5"
                >
                  <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/30">
                    <Sparkles className="w-10 h-10 text-gold" />
                  </div>
                  <h2 className="font-serif text-4xl md:text-5xl font-bold text-pine-dark">Application Received</h2>
                  <p className="text-[#1A2530] text-lg font-light leading-relaxed max-w-lg mx-auto">
                    Thank you for applying for an Artist Residency at Osadhu Studio. 
                    <br/><br/>
                    Our team will carefully review your application and preferred dates. We aim to respond within 2–5 business days. 
                    A confirmation email has been sent to <span className="font-medium text-pine">{formData.email}</span>.
                  </p>
                  <button onClick={onClose} className="mt-8 px-8 py-3 rounded-full border border-pine text-pine hover:bg-pine hover:text-white transition-colors font-semibold uppercase tracking-wider text-sm">
                    Return to Site
                  </button>
                </motion.div>
              ) : (
                <div className="w-full">
                  <div className="text-center mb-16 space-y-4">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-pine-dark">Apply for an Artist Residency</h2>
                    <p className="text-[#1A2530] max-w-xl mx-auto font-light text-sm md:text-base leading-relaxed">
                      Every residency is curated personally to create the best possible experience. Tell us about your project.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* STEP 1: Residency Details & Artist Info */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">1</span> 
                            Residency Dates
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Preferred Start Date *</label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="date" required min={todayStr}
                                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530] font-medium"
                                  value={formData.startDate} onChange={e => { setFormData(prev => ({...prev, startDate: e.target.value})); setDateError(""); }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Preferred End Date *</label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="date" required min={minEndDate}
                                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530] font-medium"
                                  value={formData.endDate} onChange={e => { setFormData(prev => ({...prev, endDate: e.target.value})); setDateError(""); }}
                                />
                              </div>
                            </div>
                          </div>
                          {totalDays > 0 && (
                            <div className="mt-6 p-5 bg-pine/5 rounded-xl border border-pine/10 flex items-center gap-4">
                              <Info className="w-5 h-5 text-pine" />
                              <span className="text-sm font-medium text-pine-dark">Your stay is calculated as <strong className="text-lg text-pine">{totalDays}</strong> Days.</span>
                            </div>
                          )}
                          {dateError && (
                            <div className="mt-4 text-red-500 text-sm font-medium p-4 bg-red-50 rounded-xl border border-red-100">{dateError}</div>
                          )}
                        </section>

                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">2</span> 
                            Artist Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Artist / Band Name *</label>
                              <input type="text" required placeholder="Osadhu"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.artistName} onChange={e => setFormData(prev => ({...prev, artistName: e.target.value}))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Contact Person Name *</label>
                              <input type="text" required placeholder="John Doe"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.contactPerson} onChange={e => setFormData(prev => ({...prev, contactPerson: e.target.value}))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Email Address *</label>
                              <input type="email" required placeholder="hello@example.com"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.email} onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Phone Number *</label>
                              <div className="flex">
                                <select 
                                  className="px-3 py-4 bg-gray-50 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-pine outline-none transition-all border-r-0 max-w-[90px] text-[#1A2530]"
                                  value={formData.countryCode} onChange={e => setFormData(prev => ({...prev, countryCode: e.target.value}))}
                                >
                                  {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                </select>
                                <input type="tel" required placeholder="234 567 8900"
                                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                  value={formData.phone} onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Country *</label>
                              <select required
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.country} onChange={e => setFormData(prev => ({...prev, country: e.target.value}))}
                              >
                                <option value="">Select Country</option>
                                <option value="India">India</option>
                                <option value="USA">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="Australia">Australia</option>
                                <option value="Germany">Germany</option>
                                <option value="France">France</option>
                                <option value="Canada">Canada</option>
                                <option value="Japan">Japan</option>
                                <option value="UAE">United Arab Emirates</option>
                                <option value="Switzerland">Switzerland</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">City *</label>
                              <input type="text" required placeholder="Mumbai"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.city} onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Instagram URL (Optional)</label>
                              <input type="url" placeholder="https://instagram.com/..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.instagram} onChange={e => setFormData(prev => ({...prev, instagram: e.target.value}))}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Website (Optional)</label>
                              <input type="url" placeholder="https://..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.website} onChange={e => setFormData(prev => ({...prev, website: e.target.value}))}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-2 text-[#1A2530]">Spotify / YouTube Link (Optional)</label>
                              <input type="url" placeholder="Link to your best work..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                                value={formData.streamingLink} onChange={e => setFormData(prev => ({...prev, streamingLink: e.target.value}))}
                              />
                            </div>
                          </div>
                        </section>
                        
                        <div className="flex justify-end pt-4 pb-20">
                          <button onClick={handleNext} disabled={!formData.startDate || !formData.endDate || !formData.artistName || !formData.email || !formData.phone || !formData.country || !formData.city} 
                            className="flex items-center gap-3 px-8 py-4 bg-pine text-cream rounded-full hover:bg-pine-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm uppercase tracking-wider group">
                            Next Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Project & Services */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">3</span> 
                            About Your Project
                          </h3>
                          <textarea required rows={6}
                            placeholder="Describe what you are planning to create during your residency, your musical style, goals, and anything you'd like us to know."
                            className="w-full px-5 py-5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all resize-none text-[#1A2530] text-lg leading-relaxed"
                            value={formData.projectDescription} onChange={e => setFormData(prev => ({...prev, projectDescription: e.target.value}))}
                          />
                        </section>

                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">4</span> 
                            Studio Requirements
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SERVICES_OPTIONS.map(service => (
                              <label key={service} className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.services.includes(service) ? 'border-pine bg-pine/5 shadow-inner' : 'border-gray-200 bg-gray-50 hover:border-pine/30 hover:bg-white'}`}>
                                <input type="checkbox" className="w-5 h-5 rounded text-pine focus:ring-pine accent-pine" 
                                  checked={formData.services.includes(service)} onChange={() => toggleArrayItem("services", service)} 
                                />
                                <span className="text-sm font-semibold text-[#1A2530]">{service}</span>
                              </label>
                            ))}
                          </div>
                        </section>

                        <div className="flex justify-between pt-4 pb-20">
                          <button onClick={handlePrev} className="flex items-center gap-2 px-8 py-4 text-[#1A2530] hover:text-pine-dark hover:bg-gray-100 rounded-full transition-colors font-semibold text-sm uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          <button onClick={handleNext} disabled={!formData.projectDescription} 
                            className="flex items-center gap-3 px-8 py-4 bg-pine text-cream rounded-full hover:bg-pine-dark transition-all disabled:opacity-50 font-semibold text-sm uppercase tracking-wider group">
                            Next Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Instruments & Mics & System Info */}
                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">5</span> 
                            Instruments Needed
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {INSTRUMENT_OPTIONS.map(inst => (
                              <label key={inst} className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.instruments.includes(inst) ? 'border-pine bg-pine/5 shadow-inner' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                                <input type="checkbox" className="w-5 h-5 accent-pine" 
                                  checked={formData.instruments.includes(inst)} onChange={() => toggleArrayItem("instruments", inst)} 
                                />
                                <span className="text-sm font-semibold text-[#1A2530]">{inst}</span>
                              </label>
                            ))}
                          </div>
                          <input type="text" placeholder="Other instruments (Please specify)"
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all text-[#1A2530]"
                            value={formData.otherInstrument} onChange={e => setFormData(prev => ({...prev, otherInstrument: e.target.value}))}
                          />
                        </section>

                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">6</span> 
                            Microphones Required
                          </h3>
                          <p className="text-sm text-[#1A2530] mb-8 leading-relaxed">We also offer a versatile collection of dynamic and instrument microphones from AKG, Sennheiser, Shure, and Lewitt.</p>
                          
                          <label className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all mb-6 ${formData.studioRecommendation ? 'border-gold bg-gold/5 shadow-inner' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                            <input type="checkbox" className="w-5 h-5 accent-gold" 
                              checked={formData.studioRecommendation} onChange={(e) => setFormData(prev => ({...prev, studioRecommendation: e.target.checked}))} 
                            />
                            <span className="text-sm font-bold text-pine-dark">Studio Recommendation (Let our engineer choose the best microphone)</span>
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {MICROPHONE_OPTIONS.map(mic => (
                              <label key={mic} className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.microphones.includes(mic) ? 'border-pine bg-pine/5' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                                <input type="checkbox" className="w-5 h-5 accent-pine" disabled={formData.studioRecommendation}
                                  checked={formData.microphones.includes(mic)} onChange={() => toggleArrayItem("microphones", mic)} 
                                />
                                <span className={`text-sm font-semibold text-[#1A2530] ${formData.studioRecommendation ? 'opacity-50' : ''}`}>{mic}</span>
                              </label>
                            ))}
                          </div>
                        </section>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                              <Monitor className="w-8 h-8 text-gold" />
                            </div>
                            <h4 className="font-bold text-pine-dark mb-3">Production System</h4>
                            <p className="text-sm text-[#1A2530] leading-relaxed">Apple Mac mini & Logic Pro. Professional production environment with a carefully curated collection of premium plugins.</p>
                          </div>
                          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                              <Headphones className="w-8 h-8 text-gold" />
                            </div>
                            <h4 className="font-bold text-pine-dark mb-3">Monitoring</h4>
                            <p className="text-sm text-[#1A2530] leading-relaxed">Kali Audio LP-6 Studio Monitors, Beyerdynamic DT 770 Pro & DT 990 Pro. Accurate monitoring for critical listening.</p>
                          </div>
                          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                              <Mic className="w-8 h-8 text-gold" />
                            </div>
                            <h4 className="font-bold text-pine-dark mb-3">Audio Interfaces</h4>
                            <p className="text-sm text-[#1A2530] leading-relaxed">Audient iD4 & Universal Audio Volt 476. Professional-quality audio interfaces delivering transparent warmth.</p>
                          </div>
                        </div>

                        <div className="flex justify-between pt-4 pb-20">
                          <button onClick={handlePrev} className="flex items-center gap-2 px-8 py-4 text-[#1A2530] hover:text-pine-dark hover:bg-gray-100 rounded-full transition-colors font-semibold text-sm uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          <button onClick={handleNext} className="flex items-center gap-3 px-8 py-4 bg-pine text-cream rounded-full hover:bg-pine-dark transition-all font-semibold text-sm uppercase tracking-wider group">
                            Next Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: Facilities & Accommodation */}
                    {step === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">7</span> 
                            Studio Facilities
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {FACILITIES_OPTIONS.map(fac => (
                              <label key={fac} className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.facilities.includes(fac) ? 'border-pine bg-pine/5 shadow-inner' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                                <input type="checkbox" className="w-5 h-5 accent-pine" 
                                  checked={formData.facilities.includes(fac)} onChange={() => toggleArrayItem("facilities", fac)} 
                                />
                                <span className="text-sm font-semibold text-[#1A2530]">{fac}</span>
                              </label>
                            ))}
                          </div>
                        </section>

                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">8</span> 
                            Accommodation & Hospitality
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {ACCOMMODATION_OPTIONS.map(acc => (
                              <label key={acc} className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${formData.accommodation.includes(acc) ? 'border-pine bg-pine/5 shadow-inner' : 'border-gray-200 bg-gray-50 hover:bg-white'}`}>
                                <input type="checkbox" className="w-5 h-5 accent-pine" 
                                  checked={formData.accommodation.includes(acc)} onChange={() => toggleArrayItem("accommodation", acc)} 
                                />
                                <span className="text-sm font-semibold text-[#1A2530]">{acc}</span>
                              </label>
                            ))}
                          </div>
                        </section>

                        <div className="flex justify-between pt-4 pb-20">
                          <button onClick={handlePrev} className="flex items-center gap-2 px-8 py-4 text-[#1A2530] hover:text-pine-dark hover:bg-gray-100 rounded-full transition-colors font-semibold text-sm uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          <button onClick={handleNext} className="flex items-center gap-3 px-8 py-4 bg-pine text-cream rounded-full hover:bg-pine-dark transition-all font-semibold text-sm uppercase tracking-wider group">
                            Final Step <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 5: Additional Notes & Submit */}
                    {step === 5 && (
                      <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                          <h3 className="font-serif text-2xl font-semibold mb-8 flex items-center gap-3 text-pine-dark">
                            <span className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm">9</span> 
                            Additional Requirements
                          </h3>
                          <textarea rows={6}
                            placeholder="Tell us if you have any additional requirements, technical needs, accessibility requests, or special arrangements."
                            className="w-full px-5 py-5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pine outline-none transition-all resize-none text-[#1A2530] text-lg leading-relaxed"
                            value={formData.notes} onChange={e => setFormData(prev => ({...prev, notes: e.target.value}))}
                          />
                        </section>

                        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm mt-8 mb-20">
                          <button onClick={handlePrev} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-4 text-[#1A2530] hover:text-pine-dark hover:bg-gray-100 rounded-full transition-colors font-semibold text-sm uppercase tracking-wider">
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          <button onClick={submitForm} disabled={isSubmitting} 
                            className="w-full md:w-auto flex justify-center items-center gap-3 px-10 py-5 bg-pine text-cream rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-pine/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pine/30 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none">
                            {isSubmitting ? (
                              <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                            ) : (
                              <>Submit Application <Check className="w-5 h-5" /></>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
