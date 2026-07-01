"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  size: string; // for masonry grid sizing
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All Journal" },
    { id: "studio", name: "Studio" },
    { id: "nature", name: "Nature" },
    { id: "artists", name: "Artists" },
    { id: "accommodation", name: "Accommodation" },
    { id: "village", name: "Village Life" },
  ];

  const galleryItems: GalleryItem[] = [
    {
      id: 0,
      title: "Wood acoustic treated room",
      category: "studio",
      image: "/images/studio_interior.png",
      size: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      id: 1,
      title: "Harsil Valley Drone Shot",
      category: "nature",
      image: "/images/harsil_valley.png",
      size: "col-span-1 row-span-1",
    },
    {
      id: 2,
      title: "Acoustic Vocal Tracking",
      category: "artists",
      image: "/images/artist_recording.png",
      size: "col-span-1 row-span-2",
    },
    {
      id: 3,
      title: "Luxury Chalet Bedroom",
      category: "accommodation",
      image: "/images/studio_accommodation.png",
      size: "col-span-1 row-span-1",
    },
    {
      id: 4,
      title: "Himalayan Forest Stream",
      category: "nature",
      image: "/images/nature_immersion.png",
      size: "col-span-1 row-span-1",
    },
    {
      id: 5,
      title: "Apple Orchard Settlement",
      category: "village",
      image: "/images/village_life.png",
      size: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      id: 6,
      title: "Inside the Analog Console Mixing Room",
      category: "studio",
      image: "/images/studio_interior.png",
      size: "col-span-1 row-span-1",
    },
    {
      id: 7,
      title: "Cozy Mountain Cabin View",
      category: "accommodation",
      image: "/images/studio_accommodation.png",
      size: "col-span-1 row-span-1",
    },
  ];

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx === null) return;
    const prevIdx = selectedImageIdx === 0 ? filteredItems.length - 1 : selectedImageIdx - 1;
    setSelectedImageIdx(prevIdx);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIdx === null) return;
    const nextIdx = selectedImageIdx === filteredItems.length - 1 ? 0 : selectedImageIdx + 1;
    setSelectedImageIdx(nextIdx);
  };

  return (
    <section id="gallery" className="relative py-24 md:py-32 px-6 md:px-8 lg:px-16 bg-cream border-t border-gold/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold block">Visual Journal</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-pine">
            Studio Gallery
          </h2>
          <p className="text-charcoal/70 max-w-xl mx-auto font-light text-sm">
            A window into daily life at Osadho Records: tracking sounds, sleeping in cozy chalets, and exploring Harsil.
          </p>
        </div>

        {/* Categories Tab Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs tracking-wider uppercase font-medium transition-all duration-300 border ${
                activeCategory === cat.id
                  ? "bg-pine border-pine text-cream shadow-md"
                  : "border-pine/10 hover:border-gold/30 text-pine/75 hover:text-pine hover:bg-stone/30"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`relative rounded-2xl overflow-hidden group shadow-lg border border-gold/5 cursor-pointer ${item.size}`}
                onClick={() => setSelectedImageIdx(index)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-103"
                />

                {/* Dark gradient cover */}
                <div className="absolute inset-0 bg-gradient-to-t from-pine/90 via-pine/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Info overlays on hover */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-cream text-lg font-semibold tracking-wide mt-1">
                    {item.title}
                  </h3>
                  <div className="absolute top-6 right-6 w-9 h-9 rounded-full bg-cream/20 backdrop-blur flex items-center justify-center text-cream border border-cream/25">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pine-dark/95 backdrop-blur-md"
            onClick={() => setSelectedImageIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-4xl aspect-[4/3] bg-stone rounded-2xl overflow-hidden border border-gold/20 shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredItems[selectedImageIdx].image}
                alt={filteredItems[selectedImageIdx].title}
                fill
                className="object-contain p-2"
                priority
              />

              <div className="absolute bottom-6 left-6 right-6 bg-pine-dark/85 backdrop-blur border border-gold/15 p-4 rounded-xl flex justify-between items-center z-10 text-cream">
                <div>
                  <span className="text-gold uppercase tracking-widest text-[9px] font-bold block mb-1">
                    {filteredItems[selectedImageIdx].category}
                  </span>
                  <h4 className="font-serif text-base tracking-wide font-semibold">
                    {filteredItems[selectedImageIdx].title}
                  </h4>
                </div>
                <span className="text-[10px] tracking-widest uppercase font-light text-stone/60">
                  {selectedImageIdx + 1} / {filteredItems.length}
                </span>
              </div>

              <button
                onClick={handlePrevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-pine-dark/65 hover:bg-gold hover:text-pine-dark text-cream border border-gold/10 transition-all duration-300 flex items-center justify-center"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-pine-dark/65 hover:bg-gold hover:text-pine-dark text-cream border border-gold/10 transition-all duration-300 flex items-center justify-center"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setSelectedImageIdx(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-pine-dark/65 hover:bg-gold hover:text-pine-dark text-cream border border-gold/10 transition-all duration-300"
                aria-label="Close lightbox overlay"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
