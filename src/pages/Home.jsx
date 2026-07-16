import Navbar from "../components/layout/Navbar";
import IntroAnimation from "../components/intro/IntroAnimation";
import Hero from "../components/hero/Hero";
import { useState } from "react";
import About from "./About";

const Home = () => {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <>
      <IntroAnimation onComplete={() => setIntroFinished(true)} />

      <Hero introFinished={introFinished} />
      <About />
    </>
  );
};
export default Home;
