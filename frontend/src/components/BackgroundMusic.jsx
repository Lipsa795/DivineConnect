import React, { useState, useEffect, useRef } from 'react';

function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element with relative path (file should be in public folder)
    // The audio file should be placed at: frontend/public/sounds/om-sound.mp3
    audioRef.current = new Audio('/sounds/om-sound.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // Handle audio load errors
    audioRef.current.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });
    
    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio file not found. Please add om-sound.mp3 to public/sounds/ folder');
      setIsLoaded(false);
    });
    
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!isLoaded) {
      console.warn('Audio not loaded yet');
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Play with promise to handle autoplay restrictions
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay was prevented. User interaction required first.');
          // First click will work, but subsequent ones may need user interaction
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 left-6 bg-amber-700/80 backdrop-blur text-white rounded-full p-3 shadow-lg hover:bg-amber-800 transition z-50 group"
      title={isPlaying ? "Pause Om Chanting" : "Play Om Chanting"}
    >
      <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'} text-xl group-hover:scale-110 transition`}></i>
      <span className="absolute -top-1 -right-1 text-xs bg-amber-500 rounded-full px-1 animate-pulse">
        🕉️
      </span>
    </button>
  );
}

export default BackgroundMusic;