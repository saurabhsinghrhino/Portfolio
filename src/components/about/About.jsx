import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const container = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        boxRef.current,
        { scale: 0.2 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "center center",
            scrub: true,
            // markers: true,      // uncomment to debug start/end points visually
          },
        },
      );
    }, container);

    return () => ctx.revert(); // cleanup on unmount
  }, []);

  return (
    <section
      id="about"
      ref={container}
      className="h-screen w-full bg-black flex justify-center items-center"
    >
      <div ref={boxRef} className="h-3/4 w-3/4 bg-amber-300">
        <div className="h-full w-full flex items-center justify-center">
          <h1 className="text-[200px] font-bold font-Anton text-center">
            WHO I AM
          </h1>
        </div>
      </div>
    </section>
  );
}
