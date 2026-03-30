import React from 'react';

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Select Your Service",
      description: "Choose from Pooja Booking, Charity Donation, Samagri Order, or Prasadam",
      icon: "🙏"
    },
    {
      number: "2",
      title: "Book & Confirm",
      description: "Fill your details and complete payment securely via Razorpay",
      icon: "✅"
    },
    {
      number: "3",
      title: "Receive & Connect",
      description: "Get your prasadam/samagri delivered or book your pooja live session",
      icon: "📿"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">Simple steps to connect with divinity</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connecting line between steps (only visible on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 left-full w-full h-0.5 bg-gradient-to-r from-amber-300 to-amber-400 transform -translate-y-1/2"></div>
              )}
              
              {/* Step Icon Circle */}
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {step.number}
                </div>
              </div>
              
              {/* Step Content */}
              <h3 className="text-xl font-bold text-amber-800 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed px-2">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 pt-6 border-t border-amber-100">
          <p className="text-sm text-gray-500">
            <i className="fas fa-shield-alt text-amber-600 mr-2"></i>
            Secure payments via Razorpay • 100% authentic services
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;