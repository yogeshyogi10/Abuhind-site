import Image from "next/image";
import Navbar from "./components/navbar/Navbar";
import HeroSection from "./components/sections/heroSection/HeroSection";
import HowAbuHindCultivates from "./components/sections/cultivteSection/CultivateSection";
import AboutPage from "./components/sections/aboutSection/AboutSection";
import WhySection from "./components/sections/whySection/WhySection";
import AboutRice from "./components/sections/riceSection/RiceSection";
import Newsletter from "./components/sections/newsLetterSection/NewsLetterSection";
import Footer from "./components/footer/Footer";
import HeroVignette from "./components/sections/legacySection/LegacySection";
import StorySection from "./components/sections/storySection/StorySection";
import GrainSection from "./components/sections/grainStorySection/GrainStorySection";

export default function Home() {
  return (
   <main>
    <Navbar />
    <HeroSection />
    <HeroVignette />
    <AboutPage />
       <WhySection
      />
      <HowAbuHindCultivates />
      <AboutRice />
      <StorySection 
        
      />
        <GrainSection />
      <Newsletter />
      <Footer />
    </main>
    
  );
}
