import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Services() {
  const { user } = useAuth();

  const services = [
    {
      icon: "🙏",
      title: "Pooja & Samagri Services",
      description: "Book pooja with free samagri delivery",
      link: "/samagri",
      color: "from-red-500 to-orange-500",
      features: ["Free Samagri", "Doorstep Delivery", "Expert Priests"],
    },
    {
      icon: "🍛",
      title: "Prasadam",
      description: "Receive blessed prasadam delivered to your home",
      link: "/prasadam",
      color: "from-green-500 to-teal-500",
      features: ["Temple Blessed", "Pan India Delivery", "Multiple Varieties"],
    },
    {
      icon: "❤️",
      title: "Charity & Donations",
      description: "Support temples and spiritual causes",
      link: "/charity",
      color: "from-pink-500 to-rose-500",
      features: ["Tax Benefits", "Transparent", "Multiple Causes"],
    },
    {
      icon: "📺",
      title: "Live Darshan",
      description: "Watch live aartis and temple ceremonies from anywhere",
      link: "/live-streaming",
      color: "from-purple-500 to-pink-500",
      features: ["Temple Aartis", "Spiritual Discourses", "24/7 Live Streams"],
    },
  ];

  return (
    <section id="Services" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg">
            Spiritual services to connect you with the divine
          </p>
        </div>

        {/* Changed to md:grid-cols-4 for 4 boxes, and added auto-rows-fr for equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className={`bg-gradient-to-br ${service.color} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all duration-300 group flex flex-col h-full`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 min-h-[56px]">
                {service.title}
              </h3>
              <p className="text-white/90 text-sm mb-3 min-h-[40px]">
                {service.description}
              </p>
              <div className="text-xs text-white/80 space-y-1 flex-grow">
                {service.features.map((feature, i) => (
                  <div key={i}>✓ {feature}</div>
                ))}
              </div>
              <div className="mt-4 text-sm font-semibold group-hover:translate-x-2 transition-transform">
                Learn More →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;