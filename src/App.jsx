import React from 'react';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';

function App() {
  return (
    <div className="bg-success bg-opacity-10 min-vh-100">
      <HeroSection />
      <HowItWorks />
      <CTASection />
    </div>
  );
}


export default App;
