import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

function CharityFunding() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    amount: 1000,
    cause: 'temple_maintenance',
    message: '',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const causes = [
    { id: 'temple_maintenance', name: 'Temple Maintenance', icon: '🏛️', desc: 'Support temple upkeep and rituals' },
    { id: 'food_donation', name: 'Food Donation (Anna Daan)', icon: '🍛', desc: 'Provide meals to devotees' },
    { id: 'education', name: 'Vedic Education', icon: '📚', desc: 'Support spiritual education' },
    { id: 'medical', name: 'Medical Aid', icon: '💊', desc: 'Help with medical expenses' },
    { id: 'other', name: 'Other Causes', icon: '❤️', desc: 'Support general temple activities' }
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

  const handleDonation = async () => {
    if (formData.amount <= 0) {
      alert('Please enter a valid donation amount');
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

      const response = await axios.post('/api/charity/donate', formData);
      const { orderId, amount, charityId } = response.data;
      
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'DivineConnect Charity',
        description: `Donation for ${causes.find(c => c.id === formData.cause)?.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await axios.post('/api/charity/verify-donation', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              charityId
            });
            
            setSuccess(true);
            alert('Thank you for your generous donation! May you be blessed.');
            setFormData({ amount: 1000, cause: 'temple_maintenance', message: '', anonymous: false });
          } catch (error) {
            alert('Donation verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#b87333'
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function(response) {
        alert('Donation failed: ' + response.error.description);
        setLoading(false);
      });
      razorpay.open();
      
    } catch (error) {
      console.error('Donation error:', error);
      alert('Donation failed. Please try again.');
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
              <div className="text-6xl mb-4">❤️</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Thank You for Your Donation!</h1>
              <p className="text-gray-600 mb-6">Your generosity helps preserve spiritual traditions.</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg"
              >
                Make Another Donation
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
              <div className="text-5xl mb-3">❤️</div>
              <h1 className="text-3xl font-bold text-amber-900">Charity Funding</h1>
              <p className="text-gray-600 mt-2">Your generosity helps preserve spiritual traditions</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Select Cause</label>
                <div className="grid grid-cols-2 gap-3">
                  {causes.map(cause => (
                    <button
                      key={cause.id}
                      onClick={() => setFormData({ ...formData, cause: cause.id })}
                      className={`p-3 rounded-lg border-2 transition text-left ${formData.cause === cause.id ? 'border-amber-700 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}
                    >
                      <div className="text-2xl mb-1">{cause.icon}</div>
                      <div className="text-sm font-semibold">{cause.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{cause.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Donation Amount (₹)</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[500, 1000, 2100, 5100].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setFormData({ ...formData, amount: amt })}
                      className={`p-2 rounded-lg border ${formData.amount === amt ? 'bg-amber-700 text-white' : 'border-gray-300 hover:border-amber-500'}`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Custom amount"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Write your prayer or message..."
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-gray-700">Donate anonymously</label>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Donation Amount:</span>
                  <span className="text-2xl font-bold text-amber-700">₹{formData.amount}</span>
                </div>
                <button
                  onClick={handleDonation}
                  disabled={formData.amount <= 0 || loading}
                  className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-hand-holding-heart"></i>
                      Donate ₹{formData.amount}
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

export default CharityFunding;