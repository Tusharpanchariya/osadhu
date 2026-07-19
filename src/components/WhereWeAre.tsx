"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Car, Plane, Train } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function WhereWeAre() {
  const directions = [
    {
      icon: Plane,
      title: "By Air",
      desc: "Fly into Jolly Grant Airport in Dehradun (DED). From there, you can enjoy a scenic 10 hour drive by private taxi through the mountains of Uttarakhand.",
    },
    {
      icon: Car,
      title: "By Road",
      desc: "Drive or hire a private taxi from Dehradun or Rishikesh via the national highway. Pass through Mussoorie, Uttarkashi and follow the river Bhagirathi up into the valley. Get in touch with us and we will be happy to assist you in finding a driver.",
    },
    {
      icon: Train,
      title: "By Rail",
      desc: "Dehradun (DDN) and Yog Nagari Rishikesh (YNRK) are the nearest major railway stations, with regular train connections to Delhi and other major Indian cities. From either station, Harsil can be reached by private taxi.",
    },
  ];

  return (
    <section id="location" className="relative bg-ink-soft py-24 md:py-36 border-t border-white/5 overflow-hidden">
      {/* Decorative mountain background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 md:mb-24 items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-4">Location</p>
            <h2
              className="font-serif font-bold text-cream leading-none"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
            >
              Find us in the<br />
              <em className="font-normal text-gold" style={{ fontStyle: "italic" }}>Himalayan heights.</em>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.9, ease }}
            className="space-y-4 max-w-md lg:ml-auto"
          >
            <p className="font-sans text-cream/45 text-sm leading-[1.8] font-light">
              Osadho Records is isolated at 7,860 ft in Harsil Valley, Uttarakhand. Surrounded by untouched pine forests, snow peaks and the pure waters of the Bhagirathi River. A few minutes drive from Gangotri Dham.
            </p>
          </motion.div>
        </div>

        {/* Map and Directions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Map Embed Card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease }}
            className="lg:col-span-7 bg-ink border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-2xl relative"
          >
            {/* Map Frame Container */}
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden border border-white/5 relative">
              <iframe
                title="Google Map location of Osadho Records"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.835467382226!2d78.73615947629532!3d31.034379174441584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390886ff00000001%3A0xc07c77efd56561cf!2sHarsil%20Valley!5e0!3m2!1sen!2sin!4v1719730000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(1.1) brightness(0.95)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Coordinates Badge */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/90 border border-white/10 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-semibold text-cream/70">
                  Osadho coordinates pinned
                </span>
              </div>
            </div>

            {/* Direct Navigation Call to Action */}
            <div className="flex items-center justify-between gap-4 mt-6 pt-2">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-cream/30 font-semibold mb-1 font-sans">
                  Ready to navigate?
                </span>
                <span className="text-xs text-cream/70 font-light font-sans">
                  Get absolute directions directly in Google Maps.
                </span>
              </div>
              
              <a
                href="https://maps.app.goo.gl/baEpCjjvHQ7uwtBL9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.25em] uppercase font-bold text-ink bg-gold hover:bg-gold-lt px-5 py-3.5 rounded-sm transition-all duration-300 shadow-xl hover:shadow-gold/20"
              >
                <Navigation className="w-3.5 h-3.5 fill-ink text-ink" />
                <span>Open Navigation</span>
              </a>
            </div>
          </motion.div>

          {/* Travel Directions Side Guide */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {directions.map((way, idx) => {
              const Icon = way.icon;
              return (
                <motion.div
                  key={way.title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease }}
                  className="bg-ink border border-white/5 p-6 rounded-2xl flex items-start gap-5 hover:border-gold/15 transition-colors duration-300 flex-1"
                >
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center text-gold border border-gold/15 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-semibold text-cream text-xs uppercase tracking-widest">
                      {way.title}
                    </h3>
                    <p className="font-sans text-cream/40 text-[12px] leading-relaxed font-light">
                      {way.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
