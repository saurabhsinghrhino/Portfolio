// SceneStory.jsx
// Premium cinematic story section with GSAP, ScrollTrigger, and Tailwind CSS.
// This component presents the story text, animates line‑by‑line entry,
// and creates a scroll‑driven “camera‑like” zoom that fades into a mask
// ready for the next scene.

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * SceneStory
 * ----------
 * - Background: #111111, no gradients.
 * - Max reading width: 700‑800 px, large, legible typography.
 * - Line‑by‑line entrance: translateY 40 → 0, opacity 0 → 1, tiny stagger.
 * - Scroll‑driven “camera” effect: subtle scale‑up + fade‑out while pinned.
 * - Clean React + GSAP architecture using refs and proper cleanup.
 */
const SceneStory = () => {
  // Outer container that will be pinned.
  const containerRef = useRef(null);
  // Wrapper that will be scaled / faded on scroll.
  const textWrapperRef = useRef(null);
  // Individual refs for each line of text.
  const lineRefs = useRef([]);

  // Story split into separate lines for independent animation.
  const storyLines = [
    "I craft elegant software solutions that feel timeless,",
    "blending meticulous engineering with a handcrafted aesthetic.",
    "Every line of code is a brush‑stroke, every component a chapter,",
    "shaping experiences that linger long after the page fades.",
  ];

  // GSAP setup – runs once after mount.
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // -------------------------------------------------
      // 1️⃣ Line‑by‑line reveal.
      // -------------------------------------------------
      gsap.from(lineRefs.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        ease: "power1.out",
        stagger: { each: 0.07 },
      });

      // -------------------------------------------------
      // 2️⃣ Scroll‑driven “camera” effect.
      // -------------------------------------------------
      gsap.to(textWrapperRef.current, {
        // Subtle perspective‑like growth (camera moving closer).
        scale: 2.5,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top+=300%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });
    }, containerRef);

    // Clean up on unmount.
    return () => ctx.revert();
  }, []); // empty deps → run once

  return (
    <section
      ref={containerRef}
      className="bg-[#111111] relative text-white flex items-center justify-center min-h-screen py-20"
    >
      <div
        ref={textWrapperRef}
        className="mx-auto max-w-[800px] space-y-6 text-center leading-relaxed"
      >
        {/* Each line gets its own ref for GSAP animation */}
        {storyLines.map((line, i) => (
          <p
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
            className="text-4xl md:text-5xl font-light"
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  );
};

export default SceneStory;
