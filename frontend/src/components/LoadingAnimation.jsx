import React, { useEffect, useState } from 'react';

function LoadingAnimation({ onComplete }) {
  const [sacredItems, setSacredItems] = useState([]);

  useEffect(() => {
    // Create sacred floating items
    const items = [
      { symbol: "🪷", name: "lotus" },
      { symbol: "🔔", name: "bell" },
      { symbol: "🪔", name: "diya" },
      { symbol: "🌼", name: "marigold" },
      { symbol: "🌸", name: "cherry" },
      { symbol: "🕉️", name: "om" },
      { symbol: "📿", name: "mala" },
      { symbol: "✨", name: "sparkle" }
    ];
    
    const floatingItems = [];
    for (let i = 0; i < 40; i++) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      floatingItems.push({
        id: i,
        symbol: randomItem.symbol,
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 5,
        size: 25 + Math.random() * 25,
        rotation: Math.random() * 360,
        opacity: 0.4 + Math.random() * 0.5
      });
    }
    setSacredItems(floatingItems);

    // Hide loading after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-amber-900 via-amber-800 to-orange-700 overflow-hidden">
      
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-9xl animate-pulse-slow">🕉️</div>
        <div className="absolute bottom-10 right-10 text-8xl animate-bounce-soft">🪷</div>
        <div className="absolute top-1/2 left-1/4 text-7xl animate-pulse-glow">🔔</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl animate-spin-slow">🪔</div>
      </div>

      {/* Main Loading Content */}
      <div className="text-center relative z-10">
        {/* Rotating Om Symbol */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto animate-spin-slow rounded-full border-4 border-amber-300/30 border-t-amber-300 shadow-2xl"></div>
          <div className="absolute inset-0 flex items-center justify-center animate-pulse-glow">
            <span className="text-7xl animate-bounce-soft drop-shadow-2xl">🕉️</span>
          </div>
        </div>

        {/* Divine Text */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-wider drop-shadow-xl animate-fade-in-up">
          DivineConnect
        </h1>
        
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-12 h-0.5 bg-amber-300 animate-slide-left"></div>
          <div className="text-amber-200 text-sm animate-pulse-slow">॥ शांति शांति शांतिः ॥</div>
          <div className="w-12 h-0.5 bg-amber-300 animate-slide-right"></div>
        </div>
        
        <p className="text-amber-100 text-lg mb-8 animate-pulse-slow">
          आवाहनं जानामि... (Awakening the divine within...)
        </p>
        
        {/* Animated dots with sacred symbols */}
        <div className="flex justify-center items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 animate-bounce-delay-1 flex items-center justify-center">
            <span className="text-sm">🪷</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 animate-bounce-delay-2 flex items-center justify-center">
            <span className="text-sm">🔔</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 animate-bounce-delay-3 flex items-center justify-center">
            <span className="text-sm">🪔</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 animate-bounce-delay-4 flex items-center justify-center">
            <span className="text-sm">🕉️</span>
          </div>
        </div>
      </div>

      {/* Floating Sacred Items */}
      {sacredItems.map((item) => (
        <div
          key={item.id}
          className="floating-item"
          style={{
            left: `${item.left}%`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            fontSize: `${item.size}px`,
            transform: `rotate(${item.rotation}deg)`,
            opacity: item.opacity
          }}
        >
          {item.symbol}
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-soft {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(255,215,0,0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(255,215,0,0.8);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-left {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 48px;
            opacity: 1;
          }
        }
        
        @keyframes slide-right {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 48px;
            opacity: 1;
          }
        }
        
        .floating-item {
          position: fixed;
          bottom: -50px;
          animation: floatUp linear infinite;
          pointer-events: none;
          z-index: 20;
          filter: drop-shadow(0 0 5px rgba(255,215,0,0.3));
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-bounce-soft {
          animation: bounce-soft 2s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-left {
          animation: slide-left 0.8s ease-out;
        }
        
        .animate-slide-right {
          animation: slide-right 0.8s ease-out;
        }
        
        .animate-bounce-delay-1 {
          animation: bounce-soft 1.5s ease-in-out infinite;
        }
        
        .animate-bounce-delay-2 {
          animation: bounce-soft 1.5s ease-in-out infinite 0.3s;
        }
        
        .animate-bounce-delay-3 {
          animation: bounce-soft 1.5s ease-in-out infinite 0.6s;
        }
        
        .animate-bounce-delay-4 {
          animation: bounce-soft 1.5s ease-in-out infinite 0.9s;
        }
      `}</style>
    </div>
  );
}

export default LoadingAnimation;