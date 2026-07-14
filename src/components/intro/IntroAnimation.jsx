import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "../hero/HomeLoader";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const IntroAnimation = ({ onComplete }) => {
  const container = useRef(null);
  const tl = useRef(null);

  const namasteLetters = "Namaste".split("");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduced: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduced } = ctx.conditions;

          gsap.set(".intro", { opacity: 1, display: "flex" });
          // .namaste-wrap is left alone — default opacity: 1.
          // Its children (.hindi-text, .namaste-char, .accent-line) each
          // control their own visibility via fromTo below.

          tl.current = gsap.timeline({ paused: true });

          if (reduced) {
            tl.current
              .to(".loader", { opacity: 0, duration: 0.4 })
              .set(".loader", { display: "none" })
              .to(".namaste-wrap", { opacity: 1, duration: 0.3 })
              .to(".namaste-wrap", { opacity: 0, duration: 0.3, delay: 1 })
              .set(".intro", { display: "none" });

            return;
          }

          const namasteChars = gsap.utils.toArray(".namaste-char");

          tl.current
            .to(".loader", {
              opacity: 0,
              scale: 1.05,
              filter: "blur(10px)",
              duration: 0.9,
              ease: "power2.inOut",
            })
            .set(".loader", { display: "none" })

            .fromTo(
              ".glow-orb",
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 0.6, duration: 1.2, ease: "power3.out" },
              "-=0.3",
            )

            .fromTo(
              ".hindi-text",
              { opacity: 0, y: 60, scale: 0.9, filter: "blur(8px)" },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out",
              },
              "-=0.6",
            )

            .fromTo(
              namasteChars,
              { opacity: 0, y: 40, skewX: 12 },
              {
                opacity: 1,
                y: 0,
                skewX: 0,
                duration: 0.6,
                stagger: 0.04,
                ease: "power3.out",
              },
              "-=0.5",
            )

            .fromTo(
              ".accent-line",
              { scaleX: 0 },
              { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
              "-=0.3",
            )

            .to(".namaste-wrap", {
              opacity: 0,
              y: -60,
              scale: 0.9,
              filter: "blur(6px)",
              duration: 0.9,
              ease: "power2.in",
              delay: 1.1,
            })
            .to(
              ".glow-orb",
              { scale: 2.4, opacity: 0, duration: 1, ease: "power2.in" },
              "<",
            )

            .to(
              ".intro",
              {
                clipPath: "circle(0% at 50% 50%)",
                duration: 1,
                ease: "power4.inOut",
              },
              "-=0.6",
            )
            .set(".intro", {
              display: "none",
            })

            .call(() => {
              onComplete();
            });
        },
      );

      return () => mm.revert();
    },
    { scope: container },
  );
  return (
    <>
      <main ref={container}>
        {/* Loader — solid bg-black so its own fade never exposes anything but .intro beneath it */}
        <div className="loader absolute inset-0 z-50 flex items-center justify-center bg-black">
          <Loader onComplete={() => tl.current?.play()} />
        </div>

        {/* Intro Overlay — permanently opaque black, sits beneath the loader */}
        <section
          className="intro fixed inset-0 z-40 overflow-hidden bg-black flex items-center justify-center"
          style={{ clipPath: "circle(150% at 50% 50%)" }}
        >
          <div className="glow-orb absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-400/40 via-orange-500/30 to-transparent blur-3xl" />

          <div className="namaste-wrap relative text-center px-4">
            {/* Devanagari rendered as one intact block — never split per-character */}
            <h1 className="hindi-text text-7xl  md:text-8xl font-Khand text-white">
              नमस्ते
            </h1>

            <h2
              className="mt-3 text-5xl md:text-6xl font-Anton text-white flex justify-center"
              aria-label="Namaste"
            >
              {namasteLetters.map((ch, i) => (
                <span
                  key={i}
                  className="namaste-char inline-block will-change-transform"
                  aria-hidden="true"
                >
                  {ch}
                </span>
              ))}
            </h2>
            <div className="accent-line mx-auto mt-6 h-[2px] w-32 origin-center scale-x-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          </div>
        </section>
      </main>
    </>
  );
};

export default IntroAnimation;
