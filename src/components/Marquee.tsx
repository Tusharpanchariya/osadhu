"use client";

export default function Marquee() {
  const items = [
    "Musicians", "Producers", "Bands", "Filmmakers",
    "Podcasters", "Songwriters", "Sound Artists", "Creative Collaborators",
  ];
  const doubled = [...items, ...items, ...items];

  return (
    <section className="bg-gold py-5 overflow-hidden border-y border-gold-lt/20">
      <div className="flex whitespace-nowrap select-none animate-[marquee_40s_linear_infinite]">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6 px-6">
            <span className="font-sans text-[11px] tracking-[0.35em] uppercase font-semibold text-ink">
              {item}
            </span>
            <span className="text-ink/30 text-xs">◆</span>
          </span>
        ))}
      </div>
    </section>
  );
}
