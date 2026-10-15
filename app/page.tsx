import Nav from "@/components/Nav";
import HeroReel from "@/components/HeroReel";
import Manifesto from "@/components/Manifesto";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Services from "@/components/Services";
import Desktop from "@/components/Desktop";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HeroReel />
      <Nav />
      <main>
        <Manifesto />
        <Process />
        <Work />
        <Services />
        <Desktop />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
