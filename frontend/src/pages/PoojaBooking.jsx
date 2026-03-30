import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import API_BASE_URL from '../config';  // ✅ ADD THIS LINE

function PoojaBooking() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    poojaType: '',
    date: '',
    time: '',
    name: user?.name || '',
    gotra: '',
    amount: 1100
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const poojaTypes = [
    { id: 'griha_shanti', name: 'Griha Shanti Pooja', price: 1100, description: 'For peace and harmony in home' },
    { id: 'satyanarayan', name: 'Satyanarayan Pooja', price: 2100, description: 'For prosperity and abundance' },
    { id: 'rudrabhishek', name: 'Rudrabhishek Pooja', price: 3100, description: 'For Lord Shiva blessings' },
    { id: 'maha_mrityunjaya', name: 'Maha Mrityunjaya Pooja', price: 5100, description: 'For health and longevity' }
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!formData.poojaType || !formData.date || !formData.time) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      // ✅ FIXED: Added API_BASE_URL
      const response = await axios.post(`${API_BASE_URL}/api/bookings/create-order`, {
        ...formData,
        amount: formData.amount
      });
      
      const { orderId, amount, bookingId } = response.data;
      
      // Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'DivineConnect',
        description: `${formData.poojaType}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // ✅ FIXED: Added API_BASE_URL
            await axios.post(`${API_BASE_URL}/api/bookings/verify-payment`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId
            });
            
            setSuccess(true);
            alert('✅ Booking confirmed! Pooja details sent to your email.');
            
            // Reset form
            setFormData({ poojaType: '', date: '', time: '', name: user?.name, gotra: '', amount: 1100 });
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || formData.name,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#b87333'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response) {
        alert('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Order failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">🙏</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">Your pooja has been successfully booked.</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg"
              >
                Book Another Pooja
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🙏</div>
              <h1 className="text-3xl font-bold text-amber-900">Book Your Pooja</h1>
              <p className="text-gray-600 mt-2">Choose a pooja and connect with divine energy</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Select Pooja Type *</label>
                <select
                  value={formData.poojaType}
                  onChange={(e) => {
                    const selected = poojaTypes.find(p => p.name === e.target.value);
                    setFormData({ ...formData, poojaType: e.target.value, amount: selected?.price || 1100 });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                >
                  <option value="">Choose a pooja</option>
                  {poojaTypes.map(pooja => (
                    <option key={pooja.id} value={pooja.name}>
                      {pooja.name} - ₹{pooja.price}
                    </option>
                  ))}
                </select>
                {formData.poojaType && (
                  <p className="text-xs text-gray-500 mt-1">
                    {poojaTypes.find(p => p.name === formData.poojaType)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Select Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Preferred Time *</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select time</option>
                  <option value="06:00">06:00 AM - Morning</option>
                  <option value="09:00">09:00 AM - Late Morning</option>
                  <option value="12:00">12:00 PM - Noon</option>
                  <option value="17:00">05:00 PM - Evening</option>
                  <option value="19:00">07:00 PM - Night</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Gotra (Optional)</label>
                <input
                  type="text"
                  value={formData.gotra}
                  onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  placeholder="e.g., Kashyap, Vashishta"
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-amber-700">₹{formData.amount}</span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={!formData.poojaType || !formData.date || !formData.time || loading}
                  className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-rupee-sign"></i>
                      Pay ₹{formData.amount}
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoojaBooking;




























// import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Navbar from '../components/Navbar';
// import axios from 'axios';
// import API_BASE_URL from '../config';  // ✅ ADD THIS LINE

// function PoojaBooking() {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     poojaType: '',
//     date: '',
//     time: '',
//     name: user?.name || '',
//     gotra: '',
//     amount: 1100
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const poojaTypes = [
//     { id: 'griha_shanti', name: 'Griha Shanti Pooja', price: 1100, description: 'For peace and harmony in home' },
//     { id: 'satyanarayan', name: 'Satyanarayan Pooja', price: 2100, description: 'For prosperity and abundance' },
//     { id: 'rudrabhishek', name: 'Rudrabhishek Pooja', price: 3100, description: 'For Lord Shiva blessings' },
//     { id: 'maha_mrityunjaya', name: 'Maha Mrityunjaya Pooja', price: 5100, description: 'For health and longevity' }
//   ];

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePayment = async () => {
//     if (!formData.poojaType || !formData.date || !formData.time) {
//       alert('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Load Razorpay script
//       const isScriptLoaded = await loadRazorpayScript();
//       if (!isScriptLoaded) {
//         alert('Failed to load payment gateway. Please try again.');
//         setLoading(false);
//         return;
//       }

//       // ✅ FIXED: Added API_BASE_URL
//       const response = await axios.post(`${API_BASE_URL}/api/bookings/create-order`, {
//         ...formData,
//         amount: formData.amount
//       });
      
//       const { orderId, amount, bookingId } = response.data;
      
//       // Razorpay options
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: amount,
//         currency: 'INR',
//         name: 'DivineConnect',
//         description: `${formData.poojaType}`,
//         order_id: orderId,
//         handler: async (response) => {
//           try {
//             // ✅ FIXED: Added API_BASE_URL
//             await axios.post(`${API_BASE_URL}/api/bookings/verify-payment`, {
//               orderId: response.razorpay_order_id,
//               paymentId: response.razorpay_payment_id,
//               signature: response.razorpay_signature,
//               bookingId
//             });
            
//             setSuccess(true);
//             alert('✅ Booking confirmed! Pooja details sent to your email.');
            
//             // Reset form
//             setFormData({ poojaType: '', date: '', time: '', name: user?.name, gotra: '', amount: 1100 });
//           } catch (error) {
//             alert('Payment verification failed. Please contact support.');
//           }
//         },
//         prefill: {
//           name: user?.name || formData.name,
//           email: user?.email,
//           contact: '9999999999'
//         },
//         theme: {
//           color: '#b87333'
//         },
//         modal: {
//           ondismiss: function() {
//             setLoading(false);
//           }
//         }
//       };
      
//       const razorpay = new window.Razorpay(options);
//       razorpay.on('payment.failed', function(response) {
//         alert('Payment failed: ' + response.error.description);
//         setLoading(false);
//       });
//       razorpay.open();
      
//     } catch (error) {
//       console.error('Payment error:', error);
//       alert('Order failed. Please try again.');
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div>
//         <Navbar />
//         <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
//           <div className="container mx-auto px-4 max-w-2xl">
//             <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//               <div className="text-6xl mb-4">🙏</div>
//               <h1 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h1>
//               <p className="text-gray-600 mb-6">Your pooja has been successfully booked.</p>
//               <button
//                 onClick={() => setSuccess(false)}
//                 className="bg-amber-700 text-white px-6 py-2 rounded-lg"
//               >
//                 Book Another Pooja
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
//         <div className="container mx-auto px-4 max-w-2xl">
//           <div className="bg-white rounded-2xl shadow-xl p-8">
//             <div className="text-center mb-8">
//               <div className="text-5xl mb-3">🙏</div>
//               <h1 className="text-3xl font-bold text-amber-900">Book Your Pooja</h1>
//               <p className="text-gray-600 mt-2">Choose a pooja and connect with divine energy</p>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-2">Select Pooja Type *</label>
//                 <select
//                   value={formData.poojaType}
//                   onChange={(e) => {
//                     const selected = poojaTypes.find(p => p.name === e.target.value);
//                     setFormData({ ...formData, poojaType: e.target.value, amount: selected?.price || 1100 });
//                   }}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//                   required
//                 >
//                   <option value="">Choose a pooja</option>
//                   {poojaTypes.map(pooja => (
//                     <option key={pooja.id} value={pooja.name}>
//                       {pooja.name} - ₹{pooja.price}
//                     </option>
//                   ))}
//                 </select>
//                 {formData.poojaType && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     {poojaTypes.find(p => p.name === formData.poojaType)?.description}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2">Select Date *</label>
//                 <input
//                   type="date"
//                   value={formData.date}
//                   onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                   min={new Date().toISOString().split('T')[0]}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2">Preferred Time *</label>
//                 <select
//                   value={formData.time}
//                   onChange={(e) => setFormData({ ...formData, time: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//                 >
//                   <option value="">Select time</option>
//                   <option value="06:00">06:00 AM - Morning</option>
//                   <option value="09:00">09:00 AM - Late Morning</option>
//                   <option value="12:00">12:00 PM - Noon</option>
//                   <option value="17:00">05:00 PM - Evening</option>
//                   <option value="19:00">07:00 PM - Night</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2">Your Name *</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 mb-2">Gotra (Optional)</label>
//                 <input
//                   type="text"
//                   value={formData.gotra}
//                   onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
//                   placeholder="e.g., Kashyap, Vashishta"
//                 />
//               </div>

//               <div className="bg-amber-50 p-4 rounded-lg mt-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="font-semibold">Total Amount:</span>
//                   <span className="text-2xl font-bold text-amber-700">₹{formData.amount}</span>
//                 </div>
//                 <button
//                   onClick={handlePayment}
//                   disabled={!formData.poojaType || !formData.date || !formData.time || loading}
//                   className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fas fa-rupee-sign"></i>
//                       Pay ₹{formData.amount}
//                     </>
//                   )}
//                 </button>
//                 <p className="text-xs text-gray-500 text-center mt-3">
//                   Secure payment powered by Razorpay
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PoojaBooking;