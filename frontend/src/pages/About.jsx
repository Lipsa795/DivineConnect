import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  const teamMembers = [
    {
      id: 1,
      name: "Lipsa Dash",
      role: "Founder & CEO",
      bio: "Spiritual tech enthusiast with a vision to make spiritual services accessible to everyone. Leading DivineConnect with passion and devotion.",
      image: "/images/team/lipsa_pic1.jpg",
      fallbackIcon: "👩‍💻",
      github: "https://github.com/Lipsa795",
      linkedin: "https://www.linkedin.com/in/lipsa-dash-a5395127a/",
      registration: "2301020144",
    },
    {
      id: 2,
      name: "Rakesh Kumar Sahoo",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about building meaningful digital experiences. Expert in React, Node.js, and MongoDB.",
      image: "/images/team/1000181146.jpg", // Replace with your image path
      fallbackIcon: "👨‍💻",
      github: "https://github.com/2301020154-code",
      linkedin: "https://linkedin.com/in/rakesh-sahoo-13a399283",
      registration: "2301020151",
    },
    {
      id: 3,
      name: "Kiransmith Pattnayak",
      role: "UI Designer",
      bio: "Expert in Vedic traditions and spiritual guidance with 10+ years of experience. Provides authentic pooja consultations.",
      image: "/images/team/1000181147.jpg", // Replace with your image path
      fallbackIcon: "🙏",
      github: "https://github.com/kiransmith006",
      linkedin: "https://www.linkedin.com/in/kiransmithpattnayak/",
      registration: "2301020251",
    },
    {
      id: 4,
      name: "Baijayanti Parida",
      role: "Content Writer",
      bio: "Building connections with temples across India for authentic spiritual experiences. Ensures quality service delivery.",
      image: "/images/team/1000181144.jpg", // Replace with your image path
      fallbackIcon: "🛕",
      github: "https://github.com/Baijayanti-parida",
      linkedin: "https://www.linkedin.com/in/baijayanti-parida-48464128b/",
      registration: "2301020093",
    },
    {
      id: 5,
      name: "Pratyush Jena",
      role: "Software Tester",
      bio: "Dedicated to providing exceptional support and ensuring every devotee's spiritual journey is seamless and fulfilling.",
      image: "images/team/1000181145.jpg", // Replace with your image path
      fallbackIcon: "💫",
      github: "https://github.com/pratyushj8280-png",
      linkedin: "https://www.linkedin.com/in/pratyush-jena-361371391/",
      registration: "2301020151",
    },
  ];

  return (
    <div>
      <Navbar />

      {/* HERO + WHAT WE DO COMBINED */}
<div
  className="relative bg-cover bg-center bg-fixed min-h-screen flex flex-col items-center justify-center"
  style={{ backgroundImage: "url('/images/kedarnath.jpg')" }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60"></div>

  {/* CONTENT */}
  <div className="relative z-10 text-center px-4 max-w-6xl w-full">
    
    {/* Title */}
    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
      About DivineConnect
    </h1>

    <p className="text-xl text-amber-200 mb-12">
      Bridging the gap between devotees and sacred traditions through technology
    </p>

    {/* WHAT WE DO */}
    <h2 className="text-3xl font-bold text-white mb-8">
      What We Do
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        ["🙏", "Pooja Services"],
        ["🛕", "Temple Discovery"],
        ["❤️", "Charity & Donations"],
        ["🌸", "Prasadam Delivery"],
        ["🤖", "AI Assistant"],
        ["🎓", "Spiritual Education"]
      ].map((item, index) => (
        <div
          key={index}
          className="p-6 rounded-xl 
          bg-white/10 backdrop-blur-md 
          border border-white/20 
          text-white"
        >
          <div className="text-4xl mb-3">{item[0]}</div>
          <h3 className="font-bold">{item[1]}</h3>
        </div>
      ))}
    </div>

  </div>
</div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600">
              Passionate individuals dedicated to your spiritual journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:scale-105 duration-300"
              >
                {/* Image / Avatar */}
                <div className="h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-amber-100 to-orange-100">
                            ${member.fallbackIcon}
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="text-6xl">{member.fallbackIcon}</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-amber-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-amber-600 text-xs mb-2 font-medium">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Registration Number */}
                  <div className="text-xs text-gray-400 mb-3 border-t pt-2 border-gray-200">
                    <i className="fas fa-id-card mr-1"></i> Reg:{" "}
                    {member.registration}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-3 justify-center">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800 transition"
                      title="GitHub"
                    >
                      <i className="fab fa-github text-lg"></i>
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition"
                      title="LinkedIn"
                    >
                      <i className="fab fa-linkedin text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
