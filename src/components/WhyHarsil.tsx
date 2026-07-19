"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WhyHarsil() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section id="harsil" ref={ref} className="relative h-[80vh] min-h-[520px] overflow-hidden bg-ink flex items-center justify-center">

      {/* Parallax photo */}
      <motion.div
        className="absolute inset-0 w-full h-[130%] -top-[15%] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/harsil_valley.png')", y }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-ink/75" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-10 text-center max-w-3xl mx-auto px-6"
      >
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-7">
          Why Harsil
        </p>
        <h2
          className="font-serif font-bold text-cream leading-[1.15]"
          style={{ fontSize: "clamp(1.8rem, 4.5vw, 4rem)" }}
        >
          Silence. Space.{" "}
          <em className="font-normal text-gold" style={{ fontStyle: "italic" }}>
            Stillness.
          </em>
          <br />
          <span className="font-normal text-cream/50 text-[0.8em]">
            The rare conditions where creativity naturally flourishes.
          </span>
        </h2>
        <div className="w-8 h-[1px] bg-gold/40 mx-auto mt-10 mb-8" />
        <p className="font-sans text-cream/70 text-sm md:text-base leading-relaxed font-light">
          Harsil is one of the most beautiful and peaceful regions of the Indian Himalayas. 
          Far from crowded tourist destinations, the valley offers a unique combination of natural beauty, simplicity, and authentic mountain life. The absence of urban distractions, combined with the presence of vast landscapes and silence, creates an ideal environment for deep work and artistic exploration.
        </p>
      </motion.div>
    </section>
  );
}
