"use client";

import { ArrowUp } from "lucide-react";

const links = [
  { name: "About",       href: "#about"      },
  { name: "Experience",  href: "#experience" },
  { name: "Studio",      href: "#tour"       },
  { name: "Residencies", href: "#packages"   },
  { name: "Location",    href: "#location"   },
  { name: "Gallery",     href: "#gallery"    },
];

function scrollTo(href: string) {
  if (href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="bg-ink-soft border-t border-white/5 pt-16 pb-10 px-6 md:px-10 lg:px-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 pb-14 border-b border-white/5">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-sans font-semibold text-sm tracking-[0.22em] uppercase text-cream">
            Osadho <span className="text-gold">Records</span>
          </span>
          <p className="font-sans text-cream/30 text-xs leading-[1.9] font-light max-w-xs">
            The Himalayas&apos; first residential recording studio.<br />
            Harsil Valley, Uttarakhand, India.
          </p>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-1">Navigate</p>
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
              className="font-sans text-xs text-cream/35 hover:text-gold transition-colors duration-300 font-light"
            >
              {l.name}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold/60 mb-1">Contact</p>
          <a href="https://instagram.com/osadho_records" target="_blank" rel="noopener noreferrer"
            className="font-sans text-xs text-cream/35 hover:text-gold transition-colors duration-300 font-light">
            @osadho_records
          </a>
          <a href="https://wa.me/919971141996" target="_blank" rel="noopener noreferrer"
            className="font-sans text-xs text-cream/35 hover:text-gold transition-colors duration-300 font-light">
            +91 99711 41996
          </a>
          <a href="mailto:shoorasena.osadho@gmail.com"
            className="font-sans text-xs text-cream/35 hover:text-gold transition-colors duration-300 font-light">
            shoorasena.osadho@gmail.com
          </a>
        </div>
      </div>

      {/* Subfooter */}
      <div className="max-w-7xl mx-auto pt-8 flex items-center justify-between">
        <span className="font-sans text-[10px] text-cream/20 tracking-wider font-light">
          © {new Date().getFullYear()} Osadho Records. All rights reserved.
        </span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-8 h-8 flex items-center justify-center rounded-sm border border-white/10 hover:border-gold/40 text-cream/30 hover:text-gold transition-all duration-300"
          aria-label="Back to top"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
