"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Volume2, VolumeX, ShieldCheck, Waves } from "lucide-react";
import Image from "next/image";

export default function StudioTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba208d1c683c07cb81d6d8da7d85&profile_id=164&oauth2_token_id=57447761";

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const floatingCards = [
    {
      title: "Control Room",
      image: "/images/studio_interior.png",
      pos: "lg:-left-16 lg:top-12",
      align: "left",
      delay: 0.1,
    },
    {
      title: "Recording Room",
      image: "/images/studio_interior.png",
      pos: "lg:-left-24 lg:-bottom-12",
      align: "left",
      delay: 0.3,
    },
    {
      title: "Accommodation",
      image: "/images/studio_accommodation.png",
      pos: "lg:-right-16 lg:top-24",
      align: "right",
      delay: 0.2,
    },
    {
      title: "Outdoor Creative Spaces",
      image: "/images/artist_recording.png",
      pos: "lg:-right-24 lg:-bottom-6",
      align: "right",
      delay: 0.4,
    },
  ];

  return (
    <section id="tour" className="relative py-28 md:py-36 px-6 md:px-8 lg:px-16 bg-pine text-cream overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pine-dark/70 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold block">Residential Walkthrough</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Step Inside Osadho
          </h2>
          <p className="text-stone/60 max-w-xl mx-auto font-light text-sm">
            Discover a custom-built environment where acoustics meet nature. Tour our space in the Himalayan hills.
          </p>
        </div>

        {/* Video Showcase surrounded by floating image cards */}
        <div className="relative w-full max-w-4xl mx-auto min-h-[400px] lg:min-h-[500px] flex items-center justify-center">
          
          {/* Main Cinematic Video Trigger Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative w-full lg:w-[85%] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gold/15 cursor-pointer group z-20"
            onClick={() => setIsOpen(true)}
          >
            <Image
              src="/images/studio_interior.png"
              alt="Osadho Records studio recording hall preview"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-103"
              priority
            />
            <div className="absolute inset-0 bg-pine-dark/45 group-hover:bg-pine-dark/35 transition-colors duration-500" />

            {/* Pulsing Play Trigger */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-pine-dark shadow-2xl relative"
              >
                <span className="absolute inset-0 rounded-full border-2 border-gold animate-ping opacity-45" />
                <Play className="w-6 h-6 fill-pine-dark text-pine-dark ml-1" />
              </motion.div>
            </div>

            {/* Video overlay badge */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-dark/80 backdrop-blur border border-gold/20 text-[9px] tracking-widest uppercase font-bold text-cream">
                <Waves className="w-3 h-3 text-gold animate-pulse" /> Play Virtual Tour
              </span>
            </div>
          </motion.div>

          {/* Floating cards (Desktop only) */}
          {floatingCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, delay: card.delay }}
              className={`hidden lg:block absolute ${card.pos} w-44 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-gold/15 z-30 group`}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-pine-dark/35 group-hover:bg-pine-dark/15 transition-colors duration-500" />
              <div className="absolute bottom-2.5 left-3 text-[10px] uppercase tracking-widest font-medium text-cream drop-shadow">
                {card.title}
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* Video Modal portal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-dark/95 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-5xl aspect-[16/9] bg-pine-dark rounded-xl overflow-hidden shadow-2xl border border-gold/20"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-pine-dark/80 backdrop-blur text-cream hover:text-gold border border-gold/15 transition-colors"
                aria-label="Close walkthrough"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                onClick={toggleMute}
                className="absolute bottom-6 right-6 p-2.5 rounded-full bg-pine-dark/80 backdrop-blur text-cream hover:text-gold border border-gold/15 transition-colors flex items-center gap-2 text-xs"
                aria-label="Mute controls"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-gold" />
                    <span className="hidden md:inline uppercase tracking-widest text-[9px] font-semibold">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-gold" />
                    <span className="hidden md:inline uppercase tracking-widest text-[9px] font-semibold">Mute</span>
                  </>
                )}
              </button>

              <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pine-dark/80 backdrop-blur border border-gold/20 text-[9px] tracking-widest font-bold uppercase text-cream">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Osadho Residential walk
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
