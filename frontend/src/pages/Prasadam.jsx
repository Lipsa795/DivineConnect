import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import API_BASE_URL from '../config';

function Prasadam() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    prasadamType: '',
    quantity: 1,
    name: user?.name || '',
    address: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const prasadamTypes = [
    { id: 'ladoo', name: 'Tirupati Ladoo', price: 150, description: 'Famous blessed ladoo from Tirupati', image: '🍪' },
    { id: 'kheer', name: 'Kheer Prasad', price: 100, description: 'Sweet rice pudding', image: '🥣' },
    { id: 'panchamrit', name: 'Panchamrit', price: 200, description: 'Holy mixture of milk, curd, honey, sugar, ghee', image: '🥛' },
    { id: 'chandan', name: 'Chandan Prasad', price: 80, description: 'Sandalwood paste', image: '🪵' },
    { id: 'vibhuti', name: 'Vibhuti (Sacred Ash)', price: 60, description: 'Holy ash from temple', image: '⚪' },
    { id: 'kumkum', name: 'Kumkum Prasad', price: 50, description: 'Sacred vermilion', image: '🔴' }
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

  const selectedPrasadam = prasadamTypes.find(p => p.id === formData.prasadamType);
  const totalAmount = selectedPrasadam ? selectedPrasadam.price * formData.quantity : 0;

  const handleOrder = async () => {
    if (!formData.prasadamType) {
      alert('Please select a prasadam type');
      return;
    }
    if (!formData.address) {
      alert('Please enter delivery address');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/prasadam/create-order`, {
        ...formData,
        totalAmount,
        prasadamName: selectedPrasadam.name
      });
      
      const { orderId, amount, prasadamId } = response.data;
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'DivineConnect Prasadam',
        description: `${selectedPrasadam.name} Prasad`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await axios.post(`${API_BASE_URL}/api/prasadam/verify-payment`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              prasadamId
            });
            
            setSuccess(true);
            alert('✅ Order confirmed! Blessed prasadam will be delivered soon.');
            setFormData({ prasadamType: '', quantity: 1, name: user?.name, address: '', phone: '', message: '' });
          } catch (error) {
            alert('Order verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: formData.phone
        },
        theme: {
          color: '#b87333'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response) {
        alert('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setLoading(false);
      });
      razorpay.open();
      
    } catch (error) {
      console.error('Order error:', error);
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
              <div className="text-6xl mb-4">🍛</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Prasadam Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">Your blessed prasadam will be delivered soon. May you be blessed! 🙏</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg"
              >
                Order More Prasadam
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
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🍛</div>
              <h1 className="text-3xl font-bold text-amber-900">Prasadam</h1>
              <p className="text-gray-600 mt-2">Receive blessed offerings from temples delivered to your home</p>
            </div>

            <div className="space-y-6">
              {/* Prasadam Selection */}
              <div>
                <label className="block text-gray-700 mb-2">Select Prasadam *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {prasadamTypes.map(prasadam => (
                    <button
                      key={prasadam.id}
                      onClick={() => setFormData({ ...formData, prasadamType: prasadam.id, quantity: 1 })}
                      className={`p-3 rounded-lg border-2 transition text-center ${formData.prasadamType === prasadam.id ? 'border-amber-700 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                    >
                      <div className="text-3xl mb-1">{prasadam.image}</div>
                      <div className="text-sm font-semibold">{prasadam.name}</div>
                      <div className="text-xs text-gray-500">₹{prasadam.price}</div>
                      <div className="text-xs text-gray-400 mt-1">{prasadam.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              {selectedPrasadam && (
                <div>
                  <label className="block text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                      className="w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{formData.quantity}</span>
                    <button
                      onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                      className="w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      +
                    </button>
                    <span className="text-gray-600 ml-4">Total: ₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Delivery Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter your complete address"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="10-digit mobile number"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Your Prayer/Message (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Share your prayer or intention..."
                />
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-2xl font-bold text-amber-700">₹{totalAmount}</span>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={!formData.prasadamType || !formData.address || !formData.phone || loading || totalAmount === 0}
                  className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-gift"></i>
                      Order Prasadam & Pay ₹{totalAmount}
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Blessed prasadam will be delivered within 5-7 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prasadam;