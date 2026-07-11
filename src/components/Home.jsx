import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Orb from "./Orb";

const Home = () => {
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
        rotationX: 50,
        transformOrigin: "50% 50% -160px",
        opacity: 0,
        duration: 1.5,
        ease: "power3",
        stagger: 0.25,
      })
      .to(".greet-second", {
        opacity: 0,
        delay: 1,
        duration: 0.7,
      })
      .to(".main", {
        y: "-100%",
        duration: 1,
        ease: "power1.out",
        opacity: 0,
      });
  });

  return (
    <main className="main relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center flex-col gap-4">
      {/* Background */}
      <div style={{ width: "100%", height: "800px", position: "relative" }}>
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#000000"
        />
      </div>

      {/* Greeting Section */}
      <div className="greet-first absolute w-full flex flex-col items-center justify-center gap-3">
        <h1 className="text-[#F5F5F5] text-7xl font-bold font-Khand">नमस्ते</h1>

        <span>
          <h1 className="text-[#F5F5F5] text-6xl font-bold font-Anton">
            Namaste
          </h1>
        </span>
      </div>

      <h1 className="greet-second absolute text-[#F5F5F5] text-6xl font-bold font-Anton">
        Impress You Without Noise
      </h1>
    </main>
  );
};

export default Home;
