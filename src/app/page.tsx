"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import StudioTour from "@/components/StudioTour";
import ResidencyEnquiryForm from "@/components/ResidencyEnquiryForm";
import Marquee from "@/components/Marquee";
import WhyHarsil from "@/components/WhyHarsil";
import WhereWeAre from "@/components/WhereWeAre";
import Gallery from "@/components/Gallery";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StudioCalendar from "@/components/StudioCalendar";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("");
  const [calendarKey, setCalendarKey] = useState(0);
  const [isEnquiryFormOpen, setIsEnquiryFormOpen] = useState(false);

  const handleOpenApplication = () => {
    setIsEnquiryFormOpen(true);
  };

  const handleOpenApplicationWithDate = (date: string) => {
    setSelectedDate(date);
    setIsEnquiryFormOpen(true);
  };

  const handleBookingConfirmed = () => {
    // Increment calendar key to instantly trigger a re-fetch of reserved slots
    setCalendarKey((prev) => prev + 1);
  };

  const handleOpenTour = () => {
    const tourSection = document.getElementById("tour");
    if (tourSection) {
      tourSection.scrollIntoView({ behavior: "smooth" });
      // Small timeout to allow scrolling to complete before opening the modal
      setTimeout(() => {
        const playButton = tourSection.querySelector(".group") as HTMLElement;
        if (playButton) {
          playButton.click();
        }
      }, 800);
    }
  };

  return (
    <SmoothScroll>
      <Navbar onOpenApplication={handleOpenApplication} />
      
      <main className="relative flex flex-col w-full">
        {/* Hero Section */}
        <Hero 
          onOpenApplication={handleOpenApplication} 
          onOpenTour={handleOpenTour} 
        />
        
        {/* About Section */}
        <About />

        {/* Experience Section */}
        <Experience />
        
        {/* Studio Tour Section */}
        <StudioTour />

        
        {/* Who Is This For Marquee */}
        <Marquee />
        
        {/* Residency Enquiry Form Modal */}
        <ResidencyEnquiryForm 
          isOpen={isEnquiryFormOpen} 
          onClose={() => setIsEnquiryFormOpen(false)}
          initialStartDate={selectedDate}
        />
        
        {/* Studio Availability Calendar Section */}
        <section id="calendar" className="bg-ink py-24 md:py-36 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14">
            <div className="text-center mb-16 space-y-4">
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">Check Availability</p>
              <h2 className="font-serif font-bold text-cream text-4xl md:text-5xl leading-none">
                Studio Calendar
              </h2>
              <p className="text-cream/40 max-w-md mx-auto font-sans text-xs tracking-wider uppercase font-light">
                Select an available date below to begin your residency application.
              </p>
            </div>
            
            <StudioCalendar key={calendarKey} onSelectDate={handleOpenApplicationWithDate} />
          </div>
        </section>
        
        {/* Apply for Residency CTA Section */}
        <section className="bg-cream py-24 md:py-36 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pine/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
            <span className="text-pine uppercase tracking-[0.25em] text-xs font-semibold block">Your Creative Journey</span>
            <h2 className="font-serif font-bold text-pine-dark text-4xl md:text-5xl lg:text-6xl leading-tight">
              Apply for an Artist Residency
            </h2>
            <p className="text-pine max-w-2xl mx-auto font-light text-base md:text-lg leading-relaxed pb-8">
              Every residency is curated personally to create the best possible experience for each artist. We invite you to share your project and vision with us.
            </p>
            <button 
              onClick={() => setIsEnquiryFormOpen(true)}
              className="inline-flex items-center gap-3 px-10 py-5 bg-pine text-cream rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-pine/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pine/30 transition-all"
            >
              Start Application <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </section>
        {/* Why Harsil Section */}
        <WhyHarsil />
        
        {/* Where We Are / Find Us Section */}
        <WhereWeAre />
        
        {/* Gallery Section */}
        <Gallery />
        
        {/* Final CTA Section */}
        <FinalCTA onOpenApplication={handleOpenApplication} />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
