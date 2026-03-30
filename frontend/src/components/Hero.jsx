import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const { user } = useAuth();

  return (
    <div 
      className="relative bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/pexels-abhisek-tripathy-467053315-33518945.jpg')",
      }}
    >
      {/* Light overlay for better text readability - REMOVED the duplicate dark overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeIn drop-shadow-lg">
          Connect with Divine
        </h1>
        <p className="text-xl md:text-2xl text-amber-200 mb-8 drop-shadow-lg">
          Bringing Spirituality to Your Life
        </p>
        <Link 
          to={user ? "/pooja-booking" : "/signup"}
          className="inline-block bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Book Your Pooja Now
        </Link>
      </div>
    </div>
  );
}

export default Hero;














