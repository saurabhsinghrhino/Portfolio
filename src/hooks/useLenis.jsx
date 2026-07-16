import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

export default function useLenis() {
  useEffect(() => {
    // Respect OS-level "reduce motion" setting — skip smooth scroll
    // entirely and fall back to native instant scroll for these users.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // Drive Lenis from GSAP's own ticker instead of a separate raw
    // requestAnimationFrame loop. This keeps Lenis's scroll position
    // and every GSAP tween (your navbar pill, parallax, hover reveal,
    // scroll-direction show/hide) updating on the exact same frame —
    // no 1-frame lag between the two.
    const update = (time) => {
      lenis.raf(time * 1000); // GSAP ticker gives seconds, Lenis wants ms
    };

    gsap.ticker.add(update);

    // Disable GSAP's automatic "catch up" after a dropped frame (e.g.
    // switching tabs and coming back). Without this, resuming the tab
    // can cause Lenis to suddenly jump/skip to make up lost time.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
}
