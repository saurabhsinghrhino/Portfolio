import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../layout/Navbar";

const Hero = ({ introFinished }) => {
  useGSAP(() => {
    if (!introFinished) return;

    gsap.from(".hero-content", {
      opacity: 0,
      y: 80,
      duration: 1,
    });
  }, [introFinished]);
  return (
    <>
      <main className="relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center flex-col gap-4">
        <div className="hero relative min-h-screen w-full  flex items-center justify-center overflow-hidden">
          {" "}
          <div className="hero-bg-orb absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-linear-to-br from-amber-400/40 via-orange-500/30 to-transparent blur-3xl pointer-events-none" />{" "}
          {introFinished && <Navbar />}{" "}
        </div>
      </main>
    </>
  );
};

export default Hero;
