import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HeroContent = ({ introFinished }) => {
  useGSAP(() => {
    if (!introFinished) return;

    const tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: "power3.out",
      },
    });

    tl.from(".hero-left", {
      x: -80,
      opacity: 0,
    })
      .from(
        ".hero-right",
        {
          x: 80,
          opacity: 0,
        },
        "-=0.45",
      )
      .from(
        ".scroll-indicator",
        {
          y: 25,
          opacity: 0,
        },
        "-=0.25",
      );

    gsap.to(".scroll-icon", {
      y: 12,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 1,
    });
  }, [introFinished]);

  return (
    <>
      {/* Left Bottom */}
      <div className="hero-left absolute bottom-12 left-12 z-20 hidden lg:flex flex-col">
        <span className="mb-2 text-xs uppercase tracking-[0.35em] text-[#C8A96A]">
          Current Role
        </span>

        <h2 className="text-3xl font-black uppercase leading-none text-[#F5F5F5]">
          Full Stack
        </h2>

        <h2 className="text-3xl font-black uppercase leading-none text-[#F5F5F5]">
          AI Developer
        </h2>
      </div>

      {/* Right Bottom */}
      <div className="hero-right absolute bottom-12 right-12 z-20 hidden lg:flex flex-col text-right">
        <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-[#F5F5F5]">
          BUILDING DIGITAL
        </h2>

        <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-[#F5F5F5]">
          PRODUCTS
        </h2>

        <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-[#C8A96A]">
          FOR HUMANS.
        </h2>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 lg:flex flex-col items-center">
        <span className="mb-3 text-[11px] uppercase tracking-[0.35em] text-white/40">
          Scroll
        </span>

        <div className="h-12 w-px overflow-hidden rounded-full bg-white/20">
          <div className="scroll-icon h-4 w-full bg-[#C8A96A]" />
        </div>
      </div>
    </>
  );
};

export default HeroContent;
