import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Services() {
  const { user } = useAuth();
  
  const services = [
    {
      icon: "🙏",
      title: "Free Pooja & Samagri Booking",
      description: "Book your pooja materials and get doorstep delivery",
      link: "/samagri",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: "📱",
      title: "Online Darshan",
      description: "Experience divine presence from anywhere",
      link: "#",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: "⭐",
      title: "Astrology Consultation",
      description: "Expert astrologers for life guidance",
      link: "#",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: "🎉",
      title: "Vrat & Festival Services",
      description: "Special arrangements for festivals",
      link: "#",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">Our Services</h2>
          <p className="text-gray-600 text-lg">Spiritual services to connect you with the divine</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link 
              key={index}
              to={service.link}
              className={`bg-gradient-to-br ${service.color} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 group`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-white/90 text-sm">{service.description}</p>
              {service.link !== "#" && (
                <div className="mt-4 text-sm font-semibold">
                  Book Now →
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;