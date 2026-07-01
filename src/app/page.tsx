"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import StudioTour from "@/components/StudioTour";
import WhatWeOffer from "@/components/WhatWeOffer";
import ResidencyPackages from "@/components/ResidencyPackages";
import Marquee from "@/components/Marquee";
import WhyHarsil from "@/components/WhyHarsil";
import WhereWeAre from "@/components/WhereWeAre";
import Gallery from "@/components/Gallery";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StudioCalendar from "@/components/StudioCalendar";
import BookingSection from "@/components/BookingSection";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("");
  const [calendarKey, setCalendarKey] = useState(0);

  const handleOpenApplication = (packageName: string = "") => {
    // Smoothly scroll down to the inline booking webpage section
    document.getElementById("booking-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenApplicationWithDate = (date: string) => {
    setSelectedDate(date);
    // Smoothly scroll down to the inline booking webpage section
    document.getElementById("booking-form-section")?.scrollIntoView({ behavior: "smooth" });
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
      <Navbar onOpenApplication={() => handleOpenApplication("")} />
      
      <main className="relative flex flex-col w-full">
        {/* Hero Section */}
        <Hero 
          onOpenApplication={() => handleOpenApplication("")} 
          onOpenTour={handleOpenTour} 
        />
        
        {/* About Section */}
        <About />

        {/* Experience Section */}
        <Experience />
        
        {/* Studio Tour Section */}
        <StudioTour />
        
        {/* What We Offer Section */}
        <WhatWeOffer />
        
        {/* Who Is This For Marquee */}
        <Marquee />
        
        {/* Residency Packages Section */}
        <ResidencyPackages onOpenApplication={handleOpenApplication} />
        
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
        
        {/* Inline Booking & Payment Section */}
        <BookingSection 
          selectedDate={selectedDate} 
          onBookingConfirmed={handleBookingConfirmed} 
        />
        
        {/* Why Harsil Section */}
        <WhyHarsil />
        
        {/* Where We Are / Find Us Section */}
        <WhereWeAre />
        
        {/* Gallery Section */}
        <Gallery />
        
        {/* Final CTA Section */}
        <FinalCTA onOpenApplication={() => handleOpenApplication("")} />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
