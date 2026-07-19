"use client";

import { motion } from "framer-motion";
import { Sliders, Bed, Utensils, Compass, UsersRound, TreePine } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const items = [
  { icon: Sliders,    title: "Recording Studio",     body: "Analog console, treated rooms, premium mic collection." },
  { icon: Bed,        title: "Private Accommodation", body: "Pine-wood chalet rooms, heated floors, mountain views." },
  { icon: Utensils,   title: "Pahadi Meals",          body: "Fresh local organic food cooked daily from the valley." },
  { icon: Compass,    title: "Forest Walks",           body: "Guided treks through orchards, creeks, glacial paths." },
  { icon: UsersRound, title: "Creative Commons",      body: "Shared writing decks, campfire circles, collaboration." },
  { icon: TreePine,   title: "Nature Immersion",      body: "Pure alpine air and stillness — the best cure for block." },
];

export default function WhatWeOffer() {
  return (
    <section id="offerings" className="bg-pine py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease }}
          >
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold/70 mb-4">
              What We Provide
            </p>
            <h2
              className="font-serif font-bold text-cream leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
            >
              Everything you need,<br />
              <em className="font-normal text-gold" style={{ fontStyle: "italic" }}>
                nothing you don&apos;t.
              </em>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.9, ease }}
            className="font-sans text-cream/40 text-sm leading-[1.9] font-light self-end max-w-sm lg:ml-auto"
          >
            The residency is curated to remove every distraction so artists can commit fully to creative discovery.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] border border-white/5 rounded-xl overflow-hidden">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.8, ease }}
                className="group relative bg-pine-mid hover:bg-pine-dark transition-colors duration-500 p-8 md:p-10 flex flex-col gap-4"
              >
                {/* thin top line accent that extends on hover */}
                <div className="absolute top-0 left-0 h-[1.5px] w-0 bg-gold group-hover:w-full transition-all duration-500" />

                <Icon className="w-5 h-5 text-gold opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <h3 className="font-sans font-semibold text-cream text-base tracking-wide">{item.title}</h3>
                <p className="font-sans text-cream/40 text-[13px] leading-[1.8] font-light">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
