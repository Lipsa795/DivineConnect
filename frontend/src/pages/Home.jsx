import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TempleFinder from '../components/TempleFinder';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <TempleFinder />
      <HowItWorks />
      <Testimonials />

      <Footer />   {}
    </div>
  );
}

export default Home;