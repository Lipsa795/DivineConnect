import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Hero() {
  const { user } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-9xl">🕉️</div>
        <div className="absolute bottom-20 right-10 text-9xl">🔱</div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6">
            Connect with Divine
          </h1>
          <p className="text-xl md:text-2xl text-amber-800 mb-8">
            Bringing Spirituality to Your Life
          </p>
          <Link 
            to={user ? "/pooja-booking" : "/signup"}
            className="inline-block bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Book Your Pooja Now
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="text-3xl mb-2">🙏</div>
            <div className="font-semibold text-amber-900">1000+</div>
            <div className="text-sm text-amber-700">Poojas Completed</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="text-3xl mb-2">🛕</div>
            <div className="font-semibold text-amber-900">500+</div>
            <div className="text-sm text-amber-700">Temples Listed</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold text-amber-900">10k+</div>
            <div className="text-sm text-amber-700">Happy Devotees</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 shadow-lg">
            <div className="text-3xl mb-2">🌟</div>
            <div className="font-semibold text-amber-900">4.9</div>
            <div className="text-sm text-amber-700">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;