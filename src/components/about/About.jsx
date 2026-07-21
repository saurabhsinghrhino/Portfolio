import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import portraitSrc from "../../assets/Me1.png";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      // 1. Establish the master timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: "+=3000",
        },
      });

      // 2. Add animation sequences linked to labels
      tl.addLabel("start")
        // WHO I AM enters from the right to the center
        .fromTo(
          ".typography-title",
          { x: "100vw", opacity: 0 },
          { x: "0vw", opacity: 1, duration: 1.5, ease: "power2.out" },
          "start",
        )
        // Brief pause at center
        .to({}, { duration: 0.5 })

        // Typography fades into portrait, Portrait appears
        .addLabel("portraitReveal")
        .to(
          ".typography-title",
          { opacity: 0, duration: 1, ease: "power2.inOut" },
          "portraitReveal",
        )
        .fromTo(
          ".portrait-img",
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power2.inOut" },
          "portraitReveal",
        )
        .to({}, { duration: 0.5 })

        // Portrait moves left & Story fades in from right
        .addLabel("storyReveal")
        .to(
          ".portrait-img",
          {
            x: () => (window.innerWidth < 768 ? "-10vw" : "-20vw"),
            opacity: () => (window.innerWidth < 768 ? 0.25 : 1),
            duration: 1.5,
            ease: "power2.inOut",
          },
          "storyReveal",
        )
        .fromTo(
          ".story-container",
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
          "storyReveal",
        )
        .to({}, { duration: 0.5 })

        // Story fades out, Portrait fades out
        .addLabel("storyFadeOut")
        .to(
          ".story-container",
          { opacity: 0, y: -60, duration: 1.0, ease: "power2.in" },
          "storyFadeOut",
        )
        .to(
          ".portrait-img",
          { opacity: 0, duration: 1.0, ease: "power2.in" },
          "storyFadeOut",
        )
        .to({}, { duration: 0.3 })

        // Timeline grows from top
        .addLabel("timelineGrow")
        .fromTo(
          ".timeline-line",
          { scaleY: 0 },
          { scaleY: 1, duration: 2.0, ease: "none" },
          "timelineGrow",
        )

        // Milestone 1 staggers
        .fromTo(
          ".milestone-dot-1",
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" },
          "timelineGrow+=0.5",
        )
        .fromTo(
          ".milestone-content-1",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "timelineGrow+=0.5",
        )

        // Milestone 2 staggers
        .fromTo(
          ".milestone-dot-2",
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" },
          "timelineGrow+=1.0",
        )
        .fromTo(
          ".milestone-content-2",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "timelineGrow+=1.0",
        )

        // Milestone 3 staggers
        .fromTo(
          ".milestone-dot-3",
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: "back.out(2)" },
          "timelineGrow+=1.5",
        )
        .fromTo(
          ".milestone-content-3",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "timelineGrow+=1.5",
        )
        .to({}, { duration: 0.8 })

        // Timeline fades
        .addLabel("timelineFade")
        .to(
          ".timeline-wrapper",
          { opacity: 0, duration: 1.0, ease: "power2.inOut" },
          "timelineFade",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="about-section relative w-full h-screen bg-[#0A0A0A] overflow-hidden select-none"
    >
      {/* 1. Large Hero Typography */}
      <h2 className="typography-title absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 font-TFMadloud text-[15vw] uppercase tracking-tighter text-neutral-100 leading-none whitespace-nowrap pointer-events-none opacity-0 will-change-transform">
        WHO I AM ?
      </h2>

      {/* 2. Portrait */}
      <img
        src={portraitSrc}
        alt="Saurabh Portrait"
        draggable={false}
        className="portrait-img absolute top-0 bottom-0 left-0 right-0 m-auto z-20 h-auto max-h-[75vh] w-[85vw] md:w-[70vw] lg:w-[60vw] max-w-[800px] object-contain opacity-0 pointer-events-none will-change-[transform,opacity]"
      />

      {/* 3. Story */}
      <div className="story-container absolute left-[5%] right-[5%] md:left-auto md:right-[8%] lg:right-[12%] top-1/2 -translate-y-1/2 w-[90vw] md:w-[45vw] lg:w-[35vw] flex flex-col justify-center z-30 opacity-0 bg-black/40 backdrop-blur-md md:bg-transparent md:backdrop-blur-none p-6 md:p-0 rounded-2xl border border-white/5 md:border-none will-change-[transform,opacity]">
        <span className="font-Khand text-accent tracking-[0.35em] text-xs md:text-sm font-semibold uppercase mb-3">
          STORY
        </span>
        <h3 className="font-Anton text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-tight leading-none mb-6">
          SHAPING DIGITAL EMOTIONS
        </h3>
        <div className="font-Khand font-light text-text/80 text-base md:text-lg lg:text-xl leading-relaxed tracking-wide space-y-4 max-w-xl">
          <p>
            I am a Creative Developer & Motion Designer specializing in crafting
            high-end digital experiences. By bridging the gap between design and
            technology, I build interactive interfaces that feel alive.
          </p>
          <p>
            With a focus on performance, clean architecture, and fluid
            typography, I collaborate with forward-thinking brands to bring
            award-winning ideas to life on the web.
          </p>
        </div>
      </div>

      {/* 4. Timeline */}
      <div className="timeline-wrapper absolute inset-0 z-30 flex items-center justify-center pointer-events-none ">
        {/* Simple vertical line */}
        <div className="timeline-line absolute left-[10%] md:left-1/2 top-[20vh] bottom-[20vh] w-[2px] bg-accent/20 origin-top scale-y-0 -translate-x-1/2 will-change-transform" />

        {/* Milestone 1 */}
        <div className="milestone-dot-1 absolute left-[10%] md:left-1/2 top-[30vh] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-2 border-black z-40 scale-0 will-change-transform" />
        <div className="milestone-content-1 absolute left-[18%] md:left-auto md:right-[55%] top-[27vh] w-[70vw] md:w-[35vw] flex flex-col md:items-end md:text-right opacity-0 will-change-[transform,opacity]">
          <span className="font-Anton text-3xl md:text-4xl text-accent leading-none mb-1">
            2023
          </span>
          <span className="font-Khand font-semibold text-lg text-text tracking-wider uppercase mb-1">
            FOUNDATION
          </span>
          <p className="font-Khand font-light text-sm md:text-base text-text/70 leading-relaxed max-w-[280px] md:max-w-md">
            Began crafting immersive web experiences, focusing on WebGL and
            high-performance motion design.
          </p>
        </div>

        {/* Milestone 2 */}
        <div className="milestone-dot-2 absolute left-[10%] md:left-1/2 top-[50vh] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-2 border-black z-40 scale-0 will-change-transform" />
        <div className="milestone-content-2 absolute left-[18%] md:left-[55%] top-[47vh] w-[70vw] md:w-[35vw] flex flex-col md:items-start md:text-left opacity-0 will-change-[transform,opacity]">
          <span className="font-Anton text-3xl md:text-4xl text-accent leading-none mb-1">
            2024
          </span>
          <span className="font-Khand font-semibold text-lg text-text tracking-wider uppercase mb-1">
            EXPANSION
          </span>
          <p className="font-Khand font-light text-sm md:text-base text-text/70 leading-relaxed max-w-[280px] md:max-w-md">
            Collaborated with global creative agencies to build award-winning,
            interactive portfolios.
          </p>
        </div>

        {/* Milestone 3 */}
        <div className="milestone-dot-3 absolute left-[10%] md:left-1/2 top-[70vh] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-accent border-2 border-black z-40 scale-0 will-change-transform" />
        <div className="milestone-content-3 absolute left-[18%] md:left-auto md:right-[55%] top-[67vh] w-[70vw] md:w-[35vw] flex flex-col md:items-end md:text-right opacity-0 will-change-[transform,opacity]">
          <span className="font-Anton text-3xl md:text-4xl text-accent leading-none mb-1">
            2025
          </span>
          <span className="font-Khand font-semibold text-lg text-text tracking-wider uppercase mb-1">
            LEADERSHIP
          </span>
          <p className="font-Khand font-light text-sm md:text-base text-text/70 leading-relaxed max-w-[280px] md:max-w-md">
            Leading creative frontend architectures and pushing the boundaries
            of web animation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
