import React from 'react';

function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Select Your Pooja",
      description: "Choose from various pooja types and rituals",
      icon: "📝"
    },
    {
      number: "2",
      title: "Book & Confirm",
      description: "Fill details and complete payment securely",
      icon: "✅"
    },
    {
      number: "3",
      title: "Attend or Watch Live",
      description: "Join virtually or get recorded ceremony",
      icon: "📺"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg">Simple steps to connect with divinity</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 left-full w-full h-0.5 bg-amber-300 transform -translate-y-1/2"></div>
              )}
              <div className="relative">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;