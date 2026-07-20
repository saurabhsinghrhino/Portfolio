import Navbar from "../layout/Navbar";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero = ({ introFinished }) => {
  return (
    <main className="relative min-h-screen w-full bg-[#0A0A0A]">
      {introFinished && <Navbar />}
      <section className="sticky top-0 h-screen overflow-hidden">
        <HeroBackground />

        <HeroImage introFinished={introFinished} />

        <HeroContent introFinished={introFinished} />
      </section>
    </main>
  );
};
export default Hero;
