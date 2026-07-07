import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const GreetPage = () => {
  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    let tl = gsap.timeline();
    tl.from(".greet-first", {
      rotationX: -50,
      transformOrigin: "50% 50% -160px",
      opacity: 0,
      duration: 1,
      ease: "power3",
      stagger: 0.25,
    })
      .to(".greet-first", {
        opacity: 0,
        duration: 0.7,
      })
      .from(".greet-second", {
        rotationX: -100,
        transformOrigin: "50% 50% -160px",
        opacity: 0,
        duration: 1,
        ease: "power3",
        stagger: 0.25,
      })
      .to(".greet-second", {
        opacity: 0,
        duration: 0.7,
      })
      .from(".greet-third", {
        rotationX: -100,
        transformOrigin: "50% 50% -160px",
        opacity: 0,
        duration: 1.5,
        ease: "power3",
        stagger: 0.25,
      })
      .to(".greet-third", {
        opacity: 0,
        delay: 1,
        duration: 0.7,
      });
  });

  return (
    <main className="h-screen bg-[conic-gradient(from_180deg_at_50%_100%,_#000000,_#172554,_#000000)] w-full">
      <div className="h-screen relative flex items-center justify-center flex-col gap-4">
        <h1 className="greet-first absolute text-[#F5F5F5] text-7xl font-bold font-Khand">
          नमस्ते
        </h1>
        <h1 className="greet-second absolute text-[#F5F5F5] text-6xl font-bold font-Anton">
          Namaste
        </h1>
        <h1 className="greet-third absolute text-[#F5F5F5] text-6xl font-bold font-Anton">
          Impress You Without Noise
        </h1>
      </div>
    </main>
  );
};

export default GreetPage;
