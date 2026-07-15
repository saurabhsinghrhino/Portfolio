import Navbar from "../layout/Navbar";
import HeroBackground from "./HeroBackground";
import HeroImage from "./HeroImage";

const Hero = ({ introFinished }) => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A]">
      {introFinished && <Navbar />}

      <section className="relative flex min-h-screen items-center justify-center">
        <HeroBackground />

        <HeroImage introFinished={introFinished} />

        {/* <HeroContent introFinished={introFinished} /> */}
      </section>
    </main>
  );
};
export default Hero;
