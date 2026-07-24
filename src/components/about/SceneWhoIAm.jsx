import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register the plugin once at module scope so hot-reloads / re-mounts
// don't register it multiple times.
gsap.registerPlugin(ScrollTrigger);

/**
 * SceneWhoIAm
 * ------------------------------------------------------------------
 * Scene 1 of the About section — an editorial, cinematic introduction.
 *
 * Behaviour (scroll-driven, pinned):
 *   1. "WHO I AM" sits centered, monumental, on a solid #111111 field.
 *   2. As the user scrolls, the title glides in from the left and
 *      fades to full opacity.
 *   3. Continuing to scroll, the title scales down and drifts upward,
 *      settling as a small permanent heading near the top of the
 *      viewport — like a camera pulling back.
 *   4. Once the title reaches its final resting state, a placeholder
 *      for the React Bits TextCursor fades in beneath it. The cursor
 *      itself is not implemented here — this only reserves the
 *      integration point for it.
 *
 * Only `transform` and `opacity` are animated, per the motion spec —
 * nothing here touches layout-triggering properties.
 * ------------------------------------------------------------------
 */
export default function SceneWhoIAm() {
  // Refs — no class-selector DOM queries anywhere in this component.
  const sectionRef = useRef(null); // pinned section (100vh stage)
  const titleRef = useRef(null); // "WHO I AM"
  const cursorSlotRef = useRef(null); // reserved slot for React Bits TextCursor

  useGSAP(
    () => {
      // Respect users who've asked for reduced motion: show the final,
      // settled state immediately and skip the scroll-driven timeline.
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(titleRef.current, {
          x: 0,
          opacity: 1,
          scale: 0.34,
          y: "-38vh",
        });
        gsap.set(cursorSlotRef.current, { opacity: 1 });
        return;
      }

      // gsap.matchMedia lets the same scene carry the same identity
      // across breakpoints while tuning the distances that are
      // meaningfully different on smaller screens (Scroll experience
      // is desktop-first, tablet-optimized, mobile-simplified).
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
        },
        (context) => {
          const { isMobile, isTablet } = context.conditions;

          // Tuning per breakpoint — kept subtle everywhere, just scaled
          // down further on smaller viewports so the motion never feels
          // exaggerated relative to the screen.
          const entryXPercent = isMobile ? -10 : isTablet ? -14 : -18;
          const finalScale = isMobile ? 0.42 : isTablet ? 0.38 : 0.34;
          const finalY = isMobile ? "-34vh" : isTablet ? "-36vh" : "-40vh";
          const pinDistance = isMobile ? "+=110%" : "+=150%";

          const timeline = buildIntroTimeline({
            section: sectionRef.current,
            title: titleRef.current,
            cursorSlot: cursorSlotRef.current,
            entryXPercent,
            finalScale,
            finalY,
            pinDistance,
          });

          // Cleanup for this breakpoint's timeline/ScrollTrigger is
          // handled automatically by useGSAP's context on unmount, and
          // by matchMedia on breakpoint change.
          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#ffffff]"
      aria-label="Who I am — introduction"
    >
      {/* Stage: centers the title initially, holds it as it migrates upward */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1
          ref={titleRef}
          className="
      font-Anton
      select-none
      text-center
      leading-[1.1]
      tracking-normal
      whitespace-nowrap
      text-[clamp(2.25rem,14vw,16rem)]
      text-[#000000]
      will-change-transform
    "
          style={{ opacity: 0 }}
        >
          WHO <span className="text-[#a97108]">I</span> AM
        </h1>
      </div>

      {/* Reserved integration point for the React Bits TextCursor.
          It stays invisible until the title settles into its final,
          top-of-viewport position, then fades in beneath it.
          Icon content is intentionally not implemented — this is
          purely the structural placeholder to wire the cursor into later. */}
      <div
        ref={cursorSlotRef}
        className="pointer-events-none absolute left-1/2 top-[18%] -translate-x-1/2"
        style={{ opacity: 0 }}
      >
        {/*
          TODO: mount <TextCursor /> from React Bits here once the
          custom technology icons are ready, e.g.:

          <TextCursor items={technologyIcons} />
        */}
        <div className="h-px w-24 bg-[#2A2A2A]" aria-hidden="true" />
      </div>
    </section>
  );
}

/**
 * buildIntroTimeline
 * ------------------------------------------------------------------
 * Pure setup: takes DOM nodes + tuned distances, returns the GSAP
 * timeline. Kept separate from the useGSAP effect above so the
 * animation choreography can be read (and adjusted) on its own.
 * ------------------------------------------------------------------
 */
function buildIntroTimeline({
  section,
  title,
  cursorSlot,
  entryXPercent,
  finalScale,
  finalY,
  pinDistance,
}) {
  // Starting state: off to the left, invisible, full size, centered.
  gsap.set(title, {
    xPercent: entryXPercent,
    opacity: 0,
    scale: 1,
    y: 0,
    transformOrigin: "center center",
  });
  gsap.set(cursorSlot, { opacity: 0 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: pinDistance,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      // invalidateOnRefresh keeps values correct if the viewport
      // resizes across the matchMedia breakpoints.
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
  });

  // Step 1 — gentle entrance from the left, fading in. No bounce,
  // no elastic easing, kept to the first third of the scroll.
  timeline.to(
    title,
    {
      xPercent: 0,
      opacity: 1,
      duration: 1,
    },
    0,
  );

  // Step 2 + 3 — the "camera pulls back": the title scales down while
  // drifting upward into its permanent, editorial heading position.
  // Combined into one movement so the scale and the rise read as a
  // single continuous gesture rather than two separate beats.
  timeline.to(
    title,
    {
      scale: finalScale,
      y: finalY,
      duration: 1.6,
    },
    1, // starts right as step 1 finishes
  );

  // Text cursor placeholder fades in only once the title has settled.
  timeline.to(
    cursorSlot,
    {
      opacity: 1,
      duration: 0.4,
    },
    ">", // begins right after the previous tween completes
  );

  return timeline;
}
