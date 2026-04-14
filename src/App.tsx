// import { useEffect } from 'react';
import CustomCursor from './components/CustomCursor';
import WaterBackground from './components/WaterBackground';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Products from './components/Products';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Installation from './components/Installation';
import Clients from './components/Clients';
import Compare from './components/Compare';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
// import CTA from './components/CTA';
import Footer from './components/Footer';
import { useCustomCursor } from './hooks/useCustomCursor';
import { useScrollReveal } from './hooks/useScrollReveal';
import ComparisonSection from './components/ComparisonSection';

function App() {
  useCustomCursor();
  useScrollReveal();

  return (
    <>
      <CustomCursor />
      <WaterBackground />
      <Navigation />
      <Hero />
      <div className="divider"></div>
      <Products />
      <div className="divider"></div>
      <HowItWorks />
      <div className="divider"></div>
      <Benefits />
      <div className="divider"></div>
      <Installation />
      <div className="divider"></div>
      <Clients />
      <div className="divider"></div>
      <ComparisonSection/>
      <div className="divider"></div>
      <Compare />
      <div className="divider"></div>
      <Reviews />
      <div className="divider"></div>
      <FAQ />
      {/* <CTA /> */}
      <Footer />
    </>
  );
}

export default App;
