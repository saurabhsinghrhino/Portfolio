import React from "react";

const HeroBackground = ({ introFinished }) => {
  return (
    <div className="hero-bg absolute inset-0 overflow-hidden">
      <div className="hero relative min-h-screen w-full  flex items-center justify-center overflow-hidden">
        {" "}
        <div className="hero-bg-orb absolute -top-40 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full bg-linear-to-br from-amber-400/40 via-amber-500/30 to-transparent blur-3xl pointer-events-none" />{" "}
        {introFinished && <Navbar />}{" "}
      </div>
    </div>
  );
};

export default HeroBackground;
