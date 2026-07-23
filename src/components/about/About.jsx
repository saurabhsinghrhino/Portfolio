import React from "react";
import SceneWhoIAm from "./SceneWhoIAm";

const About = () => {
  return (
    <section id="about" className="relative w-full select-none">
      <SceneWhoIAm />
      {/* Scene2, Scene3, etc. go here later — each one manages its
          own height/pin the same way SceneWhoIAm does */}
    </section>
  );
};

export default About;
