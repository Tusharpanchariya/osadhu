"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

const blocks = [
  {
    tag:   "01 — Acoustics",
    title: "Professional\nRecording Studio",
    body:  "Custom-built acoustic rooms in local Himalayan pine. Class-A preamps, vintage condensers, analog mixing. Engineer your sound while the mountains fill your view.",
    image: "/images/studio_interior.png",
    alt:   "Studio interior at Osadho Records",
  },
  {
    tag:   "02 — Residence",
    title: "Traditional\nHimalayan Stay",
    body:  "Private chalet rooms of stone, timber, and slate. Heated floors, organic linens, ensuite bathrooms, and a composing desk facing deep pine forest.",
    image: "/images/studio_accommodation.png",
    alt:   "Artist accommodation at Osadho Records",
  },
  {
    tag:   "03 — Immersion",
    title: "Mountain\nLiving",
    body:  "Pahadi organic meals, forest walks, evening bonfire circles. Let alpine silence clear the mind and expand creative clarity.",
    image: "/images/nature_immersion.png",
    alt:   "Himalayan forest and nature walks",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-cream">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 pt-24 md:pt-32 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease }}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-earth mb-4"
        >
          The Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.9, ease }}
          className="font-serif font-bold text-pine leading-none"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)" }}
        >
          Slow living &amp;<br />
          <em className="font-normal text-earth" style={{ fontStyle: "italic" }}>deep songwriting.</em>
        </motion.h2>
      </div>

      {/* Alternating blocks */}
      {blocks.map((block, i) => {
        const isEven = i % 2 === 0;
        return (
          <motion.div
            key={block.tag}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.0, ease }}
            className={`max-w-7xl mx-auto px-6 md:px-10 lg:px-14 pb-24 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center ${
              !isEven ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg">
              <Image
                src={block.image} alt={block.alt}
                fill className="object-cover transition-transform duration-[1.8s] group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pine/20 to-transparent" />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center gap-5">
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-gold font-semibold">
                {block.tag}
              </span>
              <h3
                className="font-serif font-bold text-pine leading-tight whitespace-pre-line"
                style={{ fontSize: "clamp(1.7rem, 3vw, 2.8rem)" }}
              >
                {block.title}
              </h3>
              <p className="font-sans text-pine/60 text-sm md:text-[15px] leading-[1.85] font-light max-w-sm">
                {block.body}
              </p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
