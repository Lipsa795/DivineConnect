import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Services() {
  const { user } = useAuth();

  const services = [
    {
      title: "Pooja & Samagri Services",
      description: "Book pooja with free samagri delivery",
      link: "/samagri",
      image: "/images/pooja.jpeg",
      gradient: "from-orange-500/60 to-transparent",
      features: ["Free Samagri", "Doorstep Delivery", "Expert Pandits"],
    },
    {
      title: "Prasadam",
      description: "Receive blessed prasadam delivered to your home",
      link: "/prasadam",
      image: "/images/prasad.jpeg",
      gradient: "from-green-500/60 to-transparent",
      features: ["Temple Blessed", "Pan India Delivery", "Multiple Varieties"],
    },
    {
      title: "Charity & Donations",
      description: "Support temples and spiritual causes",
      link: "/charity",
      image: "/images/donation.jpeg",
      gradient: "from-pink-500/60 to-transparent",
      features: ["Tax Benefits", "Transparent", "Multiple Causes"],
    },
    {
      title: "Live Darshan",
      description: "Watch live aartis and temple ceremonies from anywhere",
      link: "/live-streaming",
      image: "/images/livestream.jpeg",
      gradient: "from-purple-500/60 to-transparent",
      features: ["Temple Aartis", "Spiritual Discourses", "24/7 Live Streams"],
    },
    {
      title: "3D Temple Explorer",
      description: "Explore famous temples in stunning 3D. Rotate, zoom, and examine every detail",
      link: "/sketchfab-temples",
      image: "/images/3d-temple.webp",
      gradient: "from-blue-500/60 to-transparent",
      features: ["15+ Temples", "Interactive 3D Models", "Rotate & Zoom", "Mobile Friendly"],
    },
    {
      title: "Pilgrimage Travel",
      description: "Book cabs, find carpool, and stay near temples",
      link: "/travel",
      image: "/images/travel.jpg",
      gradient: "from-teal-500/60 to-transparent",
      features: ["Cab Booking", "Carpool", "Hotels Near Temples", "Fare Estimate"],
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 text-lg">
            Spiritual services to connect you with the divine
          </p>
        </div>

        {/* Cards - Updated to 3 columns on large screens since we have 6 services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Soft Gradient Tint */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${service.gradient} mix-blend-multiply`}
                ></div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  {service.description}
                </p>

                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  {service.features.map((f, i) => (
                    <div key={i}>✓ {f}</div>
                  ))}
                </div>

                <div className="text-sm font-semibold text-orange-500 group-hover:translate-x-1 transition">
                  Learn More →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;