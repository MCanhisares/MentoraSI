"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Mentor = {
  name: string;
  linkedin: string;
  photo?: string;
  role?: string;
};

export default function MentorsMarquee({ mentors }: { mentors: Mentor[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRef = useRef<HTMLAnchorElement | null>(null);
  const [items, setItems] = useState<Mentor[]>([]);

  useEffect(() => {
    if (!containerRef.current) {
      setItems([]);
      return;
    }

    const container = containerRef.current;

    const compute = () => {
      // If we don't have an item measured yet, render a single copy so the first render can measure
      const firstItem = itemRef.current;
      if (!firstItem) {
        // Render exactly two copies so the CSS animation (-50%) behaves well until measurement
        setItems(mentors.concat(mentors));
        return;
      }

      const gap = 24; // tailwind gap-6 -> 1.5rem -> 24px
      const containerWidth = container.getBoundingClientRect().width;
      const itemWidth = firstItem.getBoundingClientRect().width + gap;

      if (itemWidth === 0) {
        setItems(mentors.concat(mentors));
        return;
      }

      // We want at least twice the container width covered so the seamless -50% translate never shows empty space
      const neededCards = Math.ceil((containerWidth * 2) / itemWidth);
      const sets = Math.max(1, Math.ceil(neededCards / Math.max(1, mentors.length)));

      // Build an array with enough sets, and duplicate it once more so the track is exactly two copies of the content
      let arr: Mentor[] = [];
      for (let i = 0; i < sets; i++) arr = arr.concat(mentors);
      arr = arr.concat(arr);

      setItems(arr);
    };

    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(container);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [mentors]);

  if (!mentors || mentors.length === 0) {
    return (
      <div className="text-center text-[var(--muted)] py-6">
        Nenhum mentor disponível no momento.
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Accessible list copy for screen readers */}
      <ul className="sr-only" aria-hidden={false}>
        {mentors.map((m) => (
          <li key={m.linkedin}>{m.name} — {m.role}</li>
        ))}
      </ul>

      <div ref={containerRef} className="marquee py-6" aria-hidden={true}>
        <div className="marquee__track flex gap-6 items-stretch">
          {items.map((mentor, idx) => (
            <a
              key={`${mentor.linkedin}-${idx}`}
              href={mentor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => {
                if (idx === 0) itemRef.current = el;
              }}
              className="glass p-6 rounded-2xl text-center group hover:border-[var(--primary-500)] transition-transform hover:scale-105 shrink-0 w-56 md:w-64"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-600)] flex items-center justify-center">
                {mentor.photo ? (
                  <Image
                    src={mentor.photo}
                    alt={mentor.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-semibold">
                    {mentor.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--primary-500)] transition-colors">
                {mentor.name}
              </h3>
              <p className="text-xs text-[var(--muted)]">{mentor.role}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[var(--primary-500)]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
