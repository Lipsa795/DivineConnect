// import React from 'react';

// function Testimonials() {
//   const testimonials = [
//     {
//       name: "Anjali S.",
//       rating: 5,
//       text: "Highly recommend! The pooja services are authentic and well-organized. The priests were knowledgeable and the live streaming was seamless.",
//       icon: "🙏"
//     },
//     {
//       name: "Rajesh K.",
//       rating: 5,
//       text: "I felt truly connected to the divine through their services. The samagri booking was hassle-free and delivered on time.",
//       icon: "🕉️"
//     },
//     {
//       name: "Priya M.",
//       rating: 5,
//       text: "Excellent platform for spiritual needs. The charity donation process is transparent and they support great causes.",
//       icon: "✨"
//     }
//   ];

//   return (
//     <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-amber-900 mb-4">What Our Users Say</h2>
//           <p className="text-gray-600 text-lg">Join thousands of satisfied devotees</p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {testimonials.map((testimonial, index) => (
//             <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
//               <div className="flex items-center mb-4">
//                 <div className="text-4xl mr-3">{testimonial.icon}</div>
//                 <div>
//                   <h3 className="font-bold text-amber-900">{testimonial.name}</h3>
//                   <div className="flex text-yellow-400">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <i key={i} className="fas fa-star text-sm"></i>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-600 italic">"{testimonial.text}"</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Testimonials;





import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      name: "Anjali S.",
      rating: 5,
      text: "Highly recommend! The pooja services are authentic and well-organized. The priests were knowledgeable and the live streaming was seamless.",
      icon: "🙏"
    },
    {
      name: "Rajesh K.",
      rating: 5,
      text: "I felt truly connected to the divine through their services. The samagri booking was hassle-free and delivered on time.",
      icon: "🕉️"
    },
    {
      name: "Priya M.",
      rating: 5,
      text: "Excellent platform for spiritual needs. The charity donation process is transparent and they support great causes.",
      icon: "✨"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">What Our Users Say</h2>
          <p className="text-gray-600 text-lg">Join thousands of satisfied devotees</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">{testimonial.icon}</div>
                <div>
                  <h3 className="font-bold text-amber-900">{testimonial.name}</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-sm"></i>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;