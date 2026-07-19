"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenApplication: () => void;
}

const navLinks = [
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

export default function Navbar({ onOpenApplication }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 glass-dark border-b border-white/5"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-between">

          {/* ── Logo ─────────────────────── */}
          <a
     

  href="#"
  onClick={(e) => { e.preventDefault(); scrollTo("#"); }}
  className="group flex items-center gap-3"
>
  {/* Logo image */}
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src="/osadhu.png"
    alt="Osadho Records"
    width={50}
    height={50}
    className="transition-transform duration-500 group-hover:rotate-6"
  />
  <span className="font-sans font-semibold text-sm tracking-[0.22em] uppercase text-cream">
    Osadho <span className="text-gold">Records</span>
  </span>
</a>

          {/* ── Desktop links ─────────────── */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="relative text-[11px] tracking-[0.2em] uppercase font-medium text-cream/60 hover:text-cream transition-colors duration-300 group py-1"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gold transition-all duration-400 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* ── Desktop CTA ──────────────── */}
          <div className="hidden lg:block">
            <button
              onClick={onOpenApplication}
              className="text-[10px] tracking-[0.22em] uppercase font-semibold text-ink bg-gold hover:bg-gold-lt px-6 py-2.5 rounded-sm transition-all duration-300 shadow-lg hover:shadow-gold/20"
            >
              Begin Residency
            </button>
          </div>

          {/* ── Hamburger ────────────────── */}
          <button
            className="lg:hidden p-2 text-cream"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ── Mobile overlay menu ──────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] glass-dark flex flex-col"
          >
            {/* Close */}
            <div className="flex justify-between items-center px-6 py-6">
              <span className="font-sans font-semibold text-sm tracking-[0.22em] uppercase text-cream">
                Osadho <span className="text-gold">Records</span>
              </span>
              <button onClick={() => setOpen(false)} className="p-2 text-cream/70 hover:text-cream">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col items-start px-8 mt-10 gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); setOpen(false); }}
                  className="font-serif text-3xl font-medium text-cream/80 hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>

            {/* Footer of menu */}
            <div className="mt-auto px-8 pb-12 flex flex-col gap-5">
              <button
                onClick={() => { onOpenApplication(); setOpen(false); }}
                className="w-full text-center text-[11px] tracking-[0.22em] uppercase font-semibold text-ink bg-gold py-4 rounded-sm"
              >
                Begin Your Residency
              </button>
              <p className="text-cream/30 text-xs tracking-widest text-center font-light">
                Harsil Valley, Uttarakhand · India
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
