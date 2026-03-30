import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';
import API_BASE_URL from '../config';

function SamagriBooking() {
  const { user } = useAuth();
  const [items, setItems] = useState([
    { name: 'Kumkum', quantity: 1, price: 50 },
    { name: 'Chandan', quantity: 1, price: 80 },
    { name: 'Agarbatti', quantity: 1, price: 40 },
    { name: 'Camphor', quantity: 1, price: 30 },
    { name: 'Flowers', quantity: 1, price: 100 },
    { name: 'Coconut', quantity: 1, price: 40 },
    { name: 'Betel Leaves', quantity: 1, price: 20 },
    { name: 'Incense Sticks', quantity: 1, price: 35 }
  ]);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Debug: Log the key
  console.log('Razorpay Key:', process.env.REACT_APP_RAZORPAY_KEY_ID);

  const updateQuantity = (index, change) => {
    const newItems = [...items];
    const newQuantity = newItems[index].quantity + change;
    if (newQuantity >= 0) {
      newItems[index].quantity = newQuantity;
      setItems(newItems);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrder = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    if (!address.street || !address.city) {
      alert('Please fill all address details');
      return;
    }

    const orderItems = items.filter(item => item.quantity > 0);
    if (orderItems.length === 0) {
      alert('Please add at least one item');
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

      const totalAmount = calculateTotal();
      
      // ✅ FIXED: Added API_BASE_URL
      const res = await axios.post(`${API_BASE_URL}/api/samagri/create-order`, {
        items: orderItems,
        totalAmount,
        address,
        phone
      });
      
      const { orderId, amount, samagriId } = res.data;
      
      const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
      
      if (!razorpayKey) {
        alert('Payment configuration error. Please contact support.');
        setLoading(false);
        return;
      }
      
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: 'INR',
        name: 'DivineConnect Samagri',
        description: 'Pooja Samagri Order',
        order_id: orderId,
        handler: async (response) => {
          try {
            // ✅ FIXED: Added API_BASE_URL
            await axios.post(`${API_BASE_URL}/api/samagri/verify-payment`, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              samagriId
            });
            
            setSuccess(true);
            alert('✅ Order confirmed! Samagri will be delivered soon.');
            
            setItems(items.map(item => ({ ...item, quantity: 1 })));
            setAddress({ street: '', city: '', state: '', pincode: '' });
            setPhone('');
          } catch (error) {
            alert('Order verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone
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
              <div className="text-6xl mb-4">🌸</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">Your pooja samagri will be delivered soon.</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg"
              >
                Place Another Order
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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🌸</div>
              <h1 className="text-3xl font-bold text-amber-900">Pooja Samagri Booking</h1>
              <p className="text-gray-600 mt-2">Get all pooja essentials delivered to your doorstep</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">Items</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-600">₹{item.price}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-amber-900 mb-4">Delivery Details</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="mt-6 bg-amber-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-amber-700">₹{calculateTotal()}</span>
                  </div>
                  <button
                    onClick={handleOrder}
                    disabled={calculateTotal() === 0 || loading}
                    className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-cart"></i>
                        Place Order & Pay ₹{calculateTotal()}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Test Mode: Use card 4111 1111 1111 1111 | Expiry: 12/30 | CVV: 111
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SamagriBooking;