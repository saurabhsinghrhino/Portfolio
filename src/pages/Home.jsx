import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import IntroAnimation from "../components/intro/IntroAnimation";
import Hero from "../components/hero/Hero";
import About from "../components/about/About";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Home = () => {
  const [introFinished, setIntroFinished] = useState(false);

  useGSAP(
    () => {
      if (!introFinished) return;

      // Force a ScrollTrigger recalculation once the intro animation
      // finishes and the Hero/Navbar sections are fully rendered in the DOM.
      ScrollTrigger.refresh();

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isTablet } = context.conditions;

          const yMove = isDesktop ? -60 : isTablet ? -40 : -20;
          const scaleValue = isDesktop ? 0.92 : isTablet ? 0.94 : 0.96;

          // Transition timeline: active while the About section slides up over the Hero.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".about-section",
              start: "top bottom", // Starts when the top of About enters the viewport bottom
              end: "top top",     // Ends when About covers the viewport completely
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          // Scale down the portrait wrapper
          tl.to(
            ".hero-portrait-wrap",
            {
              scale: scaleValue,
              transformOrigin: "center bottom",
              ease: "none",
            },
            0
          );

          // Disable hover interactions on portrait during scroll to avoid GSAP hover tween conflicts
          tl.to(
            ".hero-portrait-wrap",
            {
              pointerEvents: "none",
              duration: 0.01,
            },
            0
          );

          // Shift text elements upward to create parallax cinematic depth
          tl.to(
            [
              ".hero-left",
              ".hero-right",
              ".scroll-indicator",
              ".hero-bg-text",
            ],
            {
              y: yMove,
              ease: "none",
            },
            0
          );

          // Fade ambient glow orbs to avoid cluttering visual styling
          tl.to(
            [
              ".hero-glow-orb",
              ".hero-ambient-glow",
              ".hero-bg-orb",
            ],
            {
              opacity: 0.05,
              ease: "none",
            },
            0
          );

          // Gently reduce the overall Hero opacity and transition background color
          // to `#050505` to blend seamlessly with the top color of the About panel.
          tl.to(
            ".hero-sticky-container",
            {
              opacity: 0.9,
              backgroundColor: "#050505",
              ease: "none",
            },
            0
          );
        }
      );

      return () => mm.revert();
    },
    { dependencies: [introFinished] }
  );

  return (
    <div className="relative w-full bg-[#0A0A0A] overflow-x-hidden">
      <IntroAnimation onComplete={() => setIntroFinished(true)} />

      {introFinished && <Navbar />}

      <Hero introFinished={introFinished} />

      <About introFinished={introFinished} />
    </div>
  );
};

export default Home;
