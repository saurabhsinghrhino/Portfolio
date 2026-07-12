import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Swap this for your actual name or a stylised logo mark
const BRAND = "SRBX.";

const NAV_LINKS = ["Home", "Projects", "About Me", "Contact Me"];

export default function Navbar() {
  const navRef = useRef(null);
  const brandRef = useRef(null);
  const dividerRef = useRef(null);
  const listRef = useRef(null);
  const pillRef = useRef(null);
  const linkRefs = useRef([]);
  const charRefs = useRef(NAV_LINKS.map(() => []));

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const displayIndex = hoveredIndex ?? activeIndex;

  // Slide the amber pill under whichever link is active or hovered
  const movePill = (index) => {
    const el = linkRefs.current[index];
    const container = listRef.current;
    if (!el || !container) return;

    const elBox = el.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();

    gsap.to(pillRef.current, {
      x: elBox.left - containerBox.left,
      width: elBox.width,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  useEffect(() => {
    movePill(displayIndex);
    const handleResize = () => movePill(displayIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayIndex]);

  // ---- Entrance animation ----
  // IMPORTANT: if a loader/overlay covers the page on first paint, this
  // will finish playing *underneath* it and look like nothing happened.
  // Have your loader dispatch a custom event when it's done:
  //   window.dispatchEvent(new Event("app:loaded"));
  // and this component will wait for it. If no such event ever fires
  // (e.g. you haven't wired it yet), it falls back to playing after 1.4s.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const playEntrance = () => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            navRef.current,
            brandRef.current,
            dividerRef.current,
            ...linkRefs.current,
          ],
          {
            opacity: 1,
            y: 0,
            scale: 1,
          },
        );
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo(
        navRef.current,
        { opacity: 0, scale: 0.9, filter: "blur(8px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power3.out",
        },
      )
        .fromTo(
          brandRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.25",
        )
        .fromTo(
          dividerRef.current,
          { opacity: 0, scaleY: 0 },
          { opacity: 1, scaleY: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3",
        );
    };

    let firedByEvent = false;
    const onLoaded = () => {
      firedByEvent = true;
      playEntrance();
    };
    window.addEventListener("app:loaded", onLoaded);

    const fallback = setTimeout(() => {
      if (!firedByEvent) playEntrance();
    }, 1400);

    return () => {
      window.removeEventListener("app:loaded", onLoaded);
      clearTimeout(fallback);
    };
  }, []);

  // ---- Word wave animation on hover ----
  // Ripples each letter up and back down in sequence, like a wave
  // passing through the word.

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 md:gap-10 px-6 py-3 rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
      style={{ opacity: 0 }}
    >
      {/* Brand */}
      <span
        ref={brandRef}
        className="text-base md:text-lg font-semibold tracking-tight text-white select-none whitespace-nowrap"
      >
        <span className="text-amber-400">/</span>
        {BRAND}
      </span>

      {/* Divider */}
      <div
        ref={dividerRef}
        className="hidden md:block h-5 w-px bg-white/10 origin-center"
      />

      {/* Links */}
      <ul
        ref={listRef}
        className="relative flex items-center gap-1 md:gap-2 text-sm"
      >
        {/* Sliding pill indicator */}
        <div
          ref={pillRef}
          className="absolute top-0 left-0 h-full rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.55)]"
          style={{ zIndex: 0, width: 0 }}
        />

        {NAV_LINKS.map((link, i) => (
          <li
            key={link}
            ref={(el) => (linkRefs.current[i] = el)}
            onMouseEnter={() => {
              setHoveredIndex(i);
            }}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setActiveIndex(i)}
            className={`relative z-10 px-4 py-2 rounded-full cursor-pointer whitespace-nowrap transition-colors duration-300 ${
              i === displayIndex
                ? "text-black font-medium"
                : "text-white/70 hover:text-white"
            }`}
          >
            {link.split("").map((char, ci) => (
              <span
                key={ci}
                ref={(el) => (charRefs.current[i][ci] = el)}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </nav>
  );
}
