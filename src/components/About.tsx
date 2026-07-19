"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease } },
};

export default function About() {
  return (
    <section id="about" className="relative bg-ink overflow-hidden">

      {/* ── Full-width photo band ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease }}
        className="relative w-full h-[55vh] md:h-[65vh]"
      >
        <Image
          src="/images/harsil_valley.png"
          alt="Harsil Valley, Uttarakhand"
          fill className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
      </motion.div>

      {/* ── Text block ───────────────────────────────────── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 -mt-32 pb-28 md:pb-36">

        {/* Overline */}
        <motion.p
          variants={reveal} initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-6"
        >
          OUR VISION
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={reveal} initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          className="font-serif font-bold text-cream mb-10 leading-none"
          style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
        >
          A sanctuary<br />
          <em className="font-normal text-gold" style={{ fontStyle: "italic" }}>
            for creative souls.
          </em>
        </motion.h2>

        {/* Pull quote */}
        <motion.blockquote
          variants={reveal} initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          className="border-l-2 border-gold pl-6 mb-10"
        >
          <p className="font-serif italic text-cream/60 text-xl md:text-2xl leading-snug font-light">
            &quot;Away from noise,<br />closer to your sound.&quot;
          </p>
        </motion.blockquote>

        {/* Body */}
        <motion.p
          variants={reveal} initial="hidden" whileInView="visible"
          viewport={{ once: true }}
          className="font-sans text-cream/45 text-sm md:text-base leading-[1.9] font-light max-w-2xl"
        >
          Hidden at 7,860 ft inside the pine-scented biosphere of Harsil Valley, 
          Osadho Records offers musicians a dedicated residential workspace. 
          When the slow rhythms of Himalayan life replace the pressure of commercial studios, 
          deeper creative work emerges.
        </motion.p>
      </div>
    </section>
  );
}
