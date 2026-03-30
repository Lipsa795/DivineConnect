// import React, { useState, useEffect, useRef } from 'react';

// function BackgroundMusic() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     // Create audio element with relative path (file should be in public folder)
//     // The audio file should be placed at: frontend/public/sounds/om-sound.mp3
//     audioRef.current = new Audio('/sounds/om-sound.mp3');
//     audioRef.current.loop = true;
//     audioRef.current.volume = 0.3;
    
//     // Handle audio load errors
//     audioRef.current.addEventListener('canplaythrough', () => {
//       setIsLoaded(true);
//     });
    
//     audioRef.current.addEventListener('error', (e) => {
//       console.error('Audio file not found. Please add om-sound.mp3 to public/sounds/ folder');
//       setIsLoaded(false);
//     });
    
//     // Cleanup on unmount
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current = null;
//       }
//     };
//   }, []);

//   const toggleMusic = () => {
//     if (!isLoaded) {
//       console.warn('Audio not loaded yet');
//       return;
//     }
    
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       // Play with promise to handle autoplay restrictions
//       const playPromise = audioRef.current.play();
//       if (playPromise !== undefined) {
//         playPromise.catch(error => {
//           console.log('Autoplay was prevented. User interaction required first.');
//           // First click will work, but subsequent ones may need user interaction
//         });
//       }
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <button
//       onClick={toggleMusic}
//       className="fixed bottom-6 left-6 bg-amber-700/80 backdrop-blur text-white rounded-full p-3 shadow-lg hover:bg-amber-800 transition z-50 group"
//       title={isPlaying ? "Pause Om Chanting" : "Play Om Chanting"}
//     >
//       <i className={`fas ${isPlaying ? 'fa-volume-up' : 'fa-volume-mute'} text-xl group-hover:scale-110 transition`}></i>
//       <span className="absolute -top-1 -right-1 text-xs bg-amber-500 rounded-full px-1 animate-pulse">
//         🕉️
//       </span>
//     </button>
//   );
// }

// export default BackgroundMusic;








// import React from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';

// function About() {
//   const teamMembers = [
//     {
//       id: 1,
//       name: "Lipsa Dash",
//       role: "Founder & CEO",
//       bio: "Spiritual tech enthusiast with a vision to make spiritual services accessible to everyone. Leading DivineConnect with passion and devotion.",
//       image: "/images/team/lipsa_pic1.jpg",  
//       fallbackIcon: "👩‍💻",
//       github: "https://github.com/Lipsa795",
//       linkedin: "https://www.linkedin.com/in/lipsa-dash-a5395127a/",
//       registration: "2301020144"
//     },
//     {
//       id: 2,
//       name: "Rakesh Kumar Sahoo",
//       role: "Lead Developer",
//       bio: "Full-stack developer passionate about building meaningful digital experiences. Expert in React, Node.js, and MongoDB.",
//       image: "/images/team/1000181146.jpg",  
//       fallbackIcon: "👨‍💻",
//       github: "https://github.com/2301020154-code",
//       linkedin: "https://linkedin.com/in/rakesh-sahoo-13a399283",
//       registration: "2301020151"
//     },
//     {
//       id: 3,
//       name: "Kiransmith Pattnayak",
//       role: "UI Designer",
//       bio: "Expert in Vedic traditions and spiritual guidance with 10+ years of experience. Provides authentic pooja consultations.",
//       image: "/images/team/1000181147.jpg",  // Replace with your image path
//       fallbackIcon: "🙏",
//       github: "https://github.com/kiransmith006",
//       linkedin: "https://www.linkedin.com/in/kiransmithpattnayak/",
//       registration: "2301020251"
//     },
//     {
//       id: 4,
//       name: "Baijayanti Parida",
//       role: "Content Writer",
//       bio: "Building connections with temples across India for authentic spiritual experiences. Ensures quality service delivery.",
//       image: "/images/team/1000181144.jpg",  // Replace with your image path
//       fallbackIcon: "🛕",
//       github: "https://github.com/Baijayanti-parida",
//       linkedin: "https://www.linkedin.com/in/baijayanti-parida-48464128b/",
//       registration: "2301020093"
//     },
//     {
//       id: 5,
//       name: "Pratyush Jena",
//       role: "Software Tester",
//       bio: "Dedicated to providing exceptional support and ensuring every devotee's spiritual journey is seamless and fulfilling.",
//       image: "/images/team/neha-gupta.jpg",  // Replace with your image path
//       fallbackIcon: "💫",
//       github: "https://github.com/pratyushj8280-png",
//       linkedin: "https://www.linkedin.com/in/pratyush-jena-361371391/",
//       registration: "2301020151"
//     }
//   ];

//   return (
//     <div>
//       <Navbar />
      
//       {/* Hero Section with Background Image */}
//       <div 
//         className="relative bg-cover bg-center bg-fixed py-24"
//         style={{
//           backgroundImage: "url('/images/kedarnath.jpg')",
//         }}
//       >
//         {/* Dark Overlay for Text Readability */}
//         <div className="absolute inset-0 bg-black/50"></div>
        
//         <div className="container mx-auto px-4 text-center relative z-10">
//           <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fadeIn">
//             About DivineConnect
//           </h1>
//           <p className="text-xl text-amber-200 max-w-2xl mx-auto">
//             Bridging the gap between devotees and sacred traditions through technology
//           </p>
//         </div>
//       </div>

//       {/* Mission & Vision */}
//       <div className="py-16 bg-white">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="text-center mb-12">
//             <div className="text-5xl mb-4">🕉️</div>
//             <h2 className="text-3xl font-bold text-amber-900 mb-4">Our Mission & Vision</h2>
//           </div>
          
//           <div className="grid md:grid-cols-2 gap-8">
//             <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-3xl mb-3">🎯</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Our Mission</h3>
//               <p className="text-gray-700 leading-relaxed">
//                 To make spiritual services accessible to everyone, anywhere, anytime. We strive to 
//                 connect devotees with authentic pooja services, temple discoveries, and charitable 
//                 causes through innovative technology.
//               </p>
//             </div>
            
//             <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-3xl mb-3">👁️</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Our Vision</h3>
//               <p className="text-gray-700 leading-relaxed">
//                 To become the world's leading digital spiritual platform, fostering a global community 
//                 of devotees while preserving and promoting sacred traditions for generations to come.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* What We Do */}
//       <div className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-amber-900 mb-4">What We Do</h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               DivineConnect offers a comprehensive suite of spiritual services
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-4xl mb-3">🙏</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Pooja Services</h3>
//               <p className="text-gray-600">Book authentic poojas performed by experienced priests</p>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-4xl mb-3">🛕</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Temple Discovery</h3>
//               <p className="text-gray-600">Find nearby temples with ratings, photos, and directions</p>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-4xl mb-3">❤️</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Charity & Donations</h3>
//               <p className="text-gray-600">Support temple causes and spiritual education initiatives</p>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-4xl mb-3">🌸</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Prasadam Delivery</h3>
//               <p className="text-gray-600">Receive blessed offerings delivered to your doorstep</p>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-4xl mb-3">🤖</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">AI Spiritual Assistant</h3>
//               <p className="text-gray-600">24/7 chatbot powered by Gemini AI for spiritual guidance</p>
//             </div>
            
//             <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
//               <div className="text-4xl mb-3">🎓</div>
//               <h3 className="text-xl font-bold text-amber-800 mb-2">Spiritual Education</h3>
//               <p className="text-gray-600">Learn about festivals, rituals, and Vedic traditions</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Team Section */}
//       <div className="py-16 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-amber-900 mb-4">Meet Our Team</h2>
//             <p className="text-gray-600">Passionate individuals dedicated to your spiritual journey</p>
//           </div>
          
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
//             {teamMembers.map(member => (
//               <div key={member.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:scale-105 duration-300">
//                 {/* Image / Avatar */}
//                 <div className="h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
//                   {member.image ? (
//                     <img 
//                       src={member.image} 
//                       alt={member.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.style.display = 'none';
//                         e.target.parentElement.innerHTML = `
//                           <div class="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-amber-100 to-orange-100">
//                             ${member.fallbackIcon}
//                           </div>
//                         `;
//                       }}
//                     />
//                   ) : (
//                     <div className="text-6xl">{member.fallbackIcon}</div>
//                   )}
//                 </div>
                
//                 {/* Content */}
//                 <div className="p-5">
//                   <h3 className="text-lg font-bold text-amber-800 mb-1">{member.name}</h3>
//                   <p className="text-amber-600 text-xs mb-2 font-medium">{member.role}</p>
//                   <p className="text-gray-600 text-xs mb-3 line-clamp-3">{member.bio}</p>
                  
//                   {/* Registration Number */}
//                   <div className="text-xs text-gray-400 mb-3 border-t pt-2 border-gray-200">
//                     <i className="fas fa-id-card mr-1"></i> Reg: {member.registration}
//                   </div>
                  
//                   {/* Social Links */}
//                   <div className="flex gap-3 justify-center">
//                     <a 
//                       href={member.github} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-gray-500 hover:text-gray-800 transition"
//                       title="GitHub"
//                     >
//                       <i className="fab fa-github text-lg"></i>
//                     </a>
//                     <a 
//                       href={member.linkedin} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-gray-500 hover:text-blue-600 transition"
//                       title="LinkedIn"
//                     >
//                       <i className="fab fa-linkedin text-lg"></i>
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Registration & Certifications */}
//       <div className="py-12 bg-amber-50">
//         <div className="container mx-auto px-4 text-center">
//           <div className="max-w-3xl mx-auto">
//             <i className="fas fa-certificate text-4xl text-amber-700 mb-4"></i>
//             <h3 className="text-xl font-bold text-amber-800 mb-2">Registered & Certified</h3>
//             <p className="text-gray-700">
//               DivineConnect is officially registered under the Indian Trusts Act, 1882. 
//               Registration Number: SPIRIT-2024-00123 | GST: 27AAECD1234F1Z5
//             </p>
//             <p className="text-sm text-gray-500 mt-3">
//               <i className="fas fa-shield-alt mr-1"></i> C. V. Raman Global University
//             </p>
//           </div>
//         </div>
//       </div>
      
//       <Footer />
//     </div>
//   );
// }

// export default About;