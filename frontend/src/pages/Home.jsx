import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TempleFinder from '../components/TempleFinder';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <TempleFinder />
      <HowItWorks />
      <Testimonials />
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 DivineConnect. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;