"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Props { onOpenApplication: () => void; }

const ease = [0.22, 1, 0.36, 1] as const;

export default function FinalCTA({ onOpenApplication }: Props) {
  return (
    <section className="relative bg-pine overflow-hidden">
      {/* Background fade */}
      <div className="absolute inset-0 opacity-20">
        <Image src="/images/artist_recording.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-pine/80" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-28 md:py-40 text-center flex flex-col items-center gap-8">
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease }}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold/70"
        >
          Your creative sabbatical awaits
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1, duration: 1, ease }}
          className="font-serif font-bold text-cream leading-none"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          Ready to create<br />
          <em className="text-gold font-normal" style={{ fontStyle: "italic" }}>in the Himalayas?</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.25, duration: 0.9, ease }}
          className="font-sans text-cream/40 text-sm font-light leading-[1.9] max-w-md"
        >
          Space is limited. Applications reviewed on a rolling basis.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.9, ease }}
          onClick={onOpenApplication}
          className="mt-2 text-[10px] tracking-[0.3em] uppercase font-bold bg-gold hover:bg-gold-lt text-ink px-10 py-4 rounded-sm shadow-2xl hover:shadow-gold/25 transition-all duration-300"
        >
          Apply for Residency
        </motion.button>
      </div>
    </section>
  );
}
