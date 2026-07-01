"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

interface Props { onOpenApplication: (pkg: string) => void; }

const packages = [
  {
    id: "5-day", days: "5", label: "Days",
    price: "₹15,000", unit: "/ day",
    desc: "High-focus sprint. Ideal for tracking sessions and short creative escapes.",
    features: ["Studio — 6 hrs/day", "Private chalet room", "2 organic meals/day", "Forest walk access"],
    cta: "Apply",
  },
  {
    id: "10-day", days: "10", label: "Days",
    price: "₹12,000", unit: "/ day",
    desc: "Our signature residency. Write, track, and polish a full EP in the mountains.",
    features: ["Studio — 6 hrs/day", "Private chalet room", "2 organic meals/day", "Valley guided hike", "Campfire session", "Mix review"],
    cta: "Apply",
    highlight: true,
  },
  {
    id: "15-day", days: "15", label: "Days",
    price: "₹10,000", unit: "/ day",
    desc: "Deep immersion for bands and producers completing an album.",
    features: ["Studio — 6 hrs/day", "Private chalet room", "2 organic meals/day", "Gangotri day trip", "Campfire sessions", "Stem mix review"],
    cta: "Apply",
  },
  {
    id: "custom", days: "∞", label: "Custom",
    price: "Enquiry", unit: "",
    desc: "Design your own timeline and creative support package.",
    features: ["Priority room choice", "Custom meal plan", "Flexible scheduling", "Dedicated collaboration", "Post-production support"],
    cta: "Enquire",
  },
];

export default function ResidencyPackages({ onOpenApplication }: Props) {
  return (
    <section id="packages" className="bg-ink py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease }}
          className="mb-20 text-center"
        >
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Residency Packages</p>
          <h2
            className="font-serif font-bold text-cream leading-none"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)" }}
          >
            Reserve your space
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.85, ease }}
              className={`relative flex flex-col rounded-xl p-7 border transition-all duration-300 ${
                pkg.highlight
                  ? "bg-gold border-gold text-ink"
                  : "bg-white/3 border-white/8 text-cream hover:border-gold/30"
              }`}
            >
              {pkg.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.28em] font-bold text-ink bg-gold px-4 py-1 rounded-full shadow">
                  Most Popular
                </span>
              )}

              {/* Days count */}
              <div className={`font-serif font-bold leading-none mb-1 ${pkg.highlight ? "text-ink" : "text-gold"}`}
                style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)" }}>
                {pkg.days}
              </div>
              <p className={`font-sans text-[10px] tracking-[0.3em] uppercase font-semibold mb-4 ${pkg.highlight ? "text-ink/70" : "text-cream/40"}`}>
                {pkg.label}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-current/10">
                <span className="font-sans font-bold text-2xl">{pkg.price}</span>
                {pkg.unit && <span className={`text-xs font-light ${pkg.highlight ? "text-ink/60" : "text-cream/40"}`}>{pkg.unit}</span>}
              </div>

              <p className={`font-sans text-xs leading-[1.8] font-light mb-5 ${pkg.highlight ? "text-ink/70" : "text-cream/40"}`}>
                {pkg.desc}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px] font-light">
                    <Check className={`w-3 h-3 mt-0.5 flex-shrink-0 ${pkg.highlight ? "text-ink" : "text-gold"}`} />
                    <span className={pkg.highlight ? "text-ink/80" : "text-cream/55"}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => onOpenApplication(pkg.id)}
                className={`text-[10px] tracking-[0.28em] uppercase font-bold py-3 rounded-sm transition-all duration-300 ${
                  pkg.highlight
                    ? "bg-ink text-cream hover:bg-ink/80"
                    : "border border-gold/40 text-gold hover:bg-gold hover:text-ink"
                }`}
              >
                {pkg.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <p className="text-center text-cream/25 text-xs tracking-widest mt-12 font-light">
          Custom long-term residencies available · Contact us for bespoke arrangements
        </p>
      </div>
    </section>
  );
}
