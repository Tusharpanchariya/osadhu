"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, ChevronDown } from "lucide-react";

export default function Hero() {

const ease = [0.22, 1, 0.36, 1] as const;

const videoUrl =
  "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054ba208d1c683c07cb81d6d8da7d85&profile_id=164&oauth2_token_id=57447761";


  const [tourOpen, setTourOpen] = useState(false);
  const [muted, setMuted]       = useState(true);
  const videoRef                = useRef<HTMLVideoElement>(null);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink flex flex-col">

      {/* ── BACKGROUND PHOTO ──────────────────────────────────── */}
      {/* Real building photo — slow zoom */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/osadho_building.png')" }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 8, ease: "easeOut" }}
      />

      {/* ── CINEMATIC GRADING LAYERS ───────────────────────────── */}
      {/* Heavy bottom gradient so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      {/* Subtle top darkening for navbar area */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
      {/* Edge vignette */}
      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.3) 55%, transparent 75%)"
        }}
      />

      {/* ── CENTERED CONTENT ────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-24 px-6 text-center">

        {/* Location tag */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease }}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold/80 mb-6"
        >
          Harsil Valley · Uttarakhand · India
        </motion.p>

        {/* Main headline — bold, minimal */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1.2, ease }}
          className="font-serif font-bold text-cream leading-none tracking-tight"
          style={{ fontSize: "clamp(2.6rem, 6.5vw, 6rem)" }}
        >
          Where music
          <br />
          <em className="font-serif font-normal not-italic text-[#98B098]" style={{ fontStyle: "italic" }}>
            echoes in the mountains.
          </em>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 0.9, ease }}
          className="w-10 h-[1px] bg-gold/50 mt-8 mb-8 origin-center"
        />

        {/* Two buttons */}

      </div>

      {/* ── SCROLL INDICATOR ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-cream/30" />
        </motion.div>
      </motion.div>

      {/* ── STUDIO TOUR MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {tourOpen && (
          <motion.div
            key="tour"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
            style={{ background: "rgba(13,13,13,0.96)" }}
            onClick={() => setTourOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="relative w-full max-w-5xl aspect-video bg-ink-soft rounded-md overflow-hidden border border-white/8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                src={videoUrl}
                autoPlay loop playsInline muted={muted}
                className="w-full h-full object-cover"
              />

              {/* Label */}
              <div className="absolute top-4 left-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.35em] font-semibold text-cream/70">
                  Osadho · Studio Tour
                </span>
              </div>

              {/* Close */}
              <button
                onClick={() => setTourOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-sm glass-dark flex items-center justify-center text-cream/60 hover:text-cream transition-colors border border-white/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="absolute bottom-5 right-5 flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-sm text-cream/60 hover:text-gold transition-colors border border-white/10 text-[9px] uppercase tracking-widest"
              >
                {muted
                  ? <><VolumeX className="w-3 h-3" /> Unmute</>
                  : <><Volume2  className="w-3 h-3" /> Mute</>
                }
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
