import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL from '../config';
import axios from 'axios';

function Profile() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [samagriOrders, setSamagriOrders] = useState([]);
  const [prasadamOrders, setPrasadamOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [showPicUpload, setShowPicUpload] = useState(false);

  // Load all user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user profile (including profile pic)
        const profileRes = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.data.profilePic) {
          setProfilePic(profileRes.data.profilePic);
        }

        // Fetch bookings
        const bookingsRes = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookingsRes.data);

        // Fetch donations
        const donationsRes = await axios.get(`${API_BASE_URL}/api/charity/my-donations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonations(donationsRes.data);

        // Fetch samagri orders
        const samagriRes = await axios.get(`${API_BASE_URL}/api/samagri/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSamagriOrders(samagriRes.data);

        // Fetch prasadam orders
        const prasadamRes = await axios.get(`${API_BASE_URL}/api/prasadam/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPrasadamOrders(prasadamRes.data);

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Compress image before saving
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions (200x200 pixels)
          let width = img.width;
          let height = img.height;
          const maxWidth = 200;
          const maxHeight = 200;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.7 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Handle profile picture upload to backend
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB)
      if (file.size > 1024 * 1024) {
        alert('Please select an image smaller than 1MB');
        return;
      }
      
      setLoading(true);
      try {
        const compressedPic = await compressImage(file);
        
        // Upload to backend
        const response = await axios.put(`${API_BASE_URL}/api/auth/profile-pic`, 
          { profilePic: compressedPic },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setProfilePic(response.data.profilePic);
        setShowPicUpload(false);
        alert('Profile picture updated successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        alert(error.response?.data?.message || 'Failed to update profile picture');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Statistics
  const stats = {
    totalBookings: bookings.length,
    totalDonations: donations.reduce((sum, d) => sum + (d.amount || 0), 0),
    totalOrders: samagriOrders.length + prasadamOrders.length,
    completedPoojas: bookings.filter(b => b.status === 'completed').length
  };

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-amber-700 to-amber-600 h-32 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                    {profilePic ? (
                      <img 
                        src={profilePic} 
                        alt={user?.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-5xl">
                        {user?.name?.charAt(0) || '👤'}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowPicUpload(!showPicUpload)}
                    className="absolute bottom-0 right-0 bg-amber-700 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-amber-800 transition"
                  >
                    <i className="fas fa-camera text-sm"></i>
                  </button>
                </div>
                {showPicUpload && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-2 z-10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-20 pb-6 px-8">
              <h1 className="text-2xl font-bold text-amber-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member since {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-3xl mb-2">🙏</div>
              <div className="text-2xl font-bold text-amber-700">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Poojas</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-2xl font-bold text-amber-700">₹{stats.totalDonations.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Donated</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-amber-700">{stats.totalOrders}</div>
              <div className="text-sm text-gray-600">Orders Placed</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-3xl mb-2">✨</div>
              <div className="text-2xl font-bold text-amber-700">{stats.completedPoojas}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex border-b overflow-x-auto">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'bookings' 
                    ? 'text-amber-700 border-b-2 border-amber-700' 
                    : 'text-gray-500 hover:text-amber-600'
                }`}
              >
                <i className="fas fa-praying-hands mr-2"></i>Pooja Bookings
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'donations' 
                    ? 'text-amber-700 border-b-2 border-amber-700' 
                    : 'text-gray-500 hover:text-amber-600'
                }`}
              >
                <i className="fas fa-hand-holding-heart mr-2"></i>Donations
              </button>
              <button
                onClick={() => setActiveTab('samagri')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'samagri' 
                    ? 'text-amber-700 border-b-2 border-amber-700' 
                    : 'text-gray-500 hover:text-amber-600'
                }`}
              >
                <i className="fas fa-shopping-bag mr-2"></i>Samagri Orders
              </button>
              <button
                onClick={() => setActiveTab('prasadam')}
                className={`px-6 py-3 font-semibold transition whitespace-nowrap ${
                  activeTab === 'prasadam' 
                    ? 'text-amber-700 border-b-2 border-amber-700' 
                    : 'text-gray-500 hover:text-amber-600'
                }`}
              >
                <i className="fas fa-gift mr-2"></i>Prasadam Orders
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : (
                <>
                  {/* Bookings Tab */}
                  {activeTab === 'bookings' && (
                    bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-3">🙏</div>
                        <p className="text-gray-500">No pooja bookings yet</p>
                        <button 
                          onClick={() => window.location.href = '/pooja-booking'}
                          className="mt-3 text-amber-700 hover:underline"
                        >
                          Book your first pooja
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h3 className="font-bold text-amber-800">{booking.poojaType}</h3>
                                <p className="text-sm text-gray-600">
                                  <i className="far fa-calendar-alt mr-1"></i>{formatDate(booking.date)} at {booking.time}
                                </p>
                                {booking.name && <p className="text-sm text-gray-500">For: {booking.name}</p>}
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                                  {booking.status}
                                </span>
                                <p className="text-lg font-bold text-amber-700 mt-1">₹{booking.amount}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* Donations Tab */}
                  {activeTab === 'donations' && (
                    donations.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-3">❤️</div>
                        <p className="text-gray-500">No donations yet</p>
                        <button 
                          onClick={() => window.location.href = '/charity'}
                          className="mt-3 text-amber-700 hover:underline"
                        >
                          Make your first donation
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {donations.map((donation) => (
                          <div key={donation._id} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h3 className="font-bold text-amber-800">
                                  {donation.cause?.replace(/_/g, ' ').toUpperCase()}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  <i className="far fa-calendar-alt mr-1"></i>{formatDate(donation.createdAt)}
                                </p>
                                {donation.message && <p className="text-sm text-gray-500 italic">"{donation.message}"</p>}
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(donation.status)}`}>
                                  {donation.status}
                                </span>
                                <p className="text-lg font-bold text-amber-700 mt-1">₹{donation.amount}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* Samagri Orders Tab */}
                  {activeTab === 'samagri' && (
                    samagriOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-3">🌸</div>
                        <p className="text-gray-500">No samagri orders yet</p>
                        <button 
                          onClick={() => window.location.href = '/samagri'}
                          className="mt-3 text-amber-700 hover:underline"
                        >
                          Order samagri
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {samagriOrders.map((order) => (
                          <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h3 className="font-bold text-amber-800">Order #{order._id.slice(-6)}</h3>
                                <p className="text-sm text-gray-600">
                                  <i className="fas fa-box mr-1"></i>{order.items?.length} items
                                </p>
                                <p className="text-sm text-gray-500">{order.address?.city}, {order.address?.state}</p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                                  {order.status}
                                </span>
                                <p className="text-lg font-bold text-amber-700 mt-1">₹{order.totalAmount}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* Prasadam Orders Tab */}
                  {activeTab === 'prasadam' && (
                    prasadamOrders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-5xl mb-3">🍛</div>
                        <p className="text-gray-500">No prasadam orders yet</p>
                        <button 
                          onClick={() => window.location.href = '/prasadam'}
                          className="mt-3 text-amber-700 hover:underline"
                        >
                          Order prasadam
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {prasadamOrders.map((order) => (
                          <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h3 className="font-bold text-amber-800">{order.prasadamName}</h3>
                                <p className="text-sm text-gray-600">
                                  <i className="fas fa-box mr-1"></i>Quantity: {order.quantity}
                                </p>
                                <p className="text-sm text-gray-500">{order.address?.split(',')[0]}</p>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                                  {order.status}
                                </span>
                                <p className="text-lg font-bold text-amber-700 mt-1">₹{order.totalAmount}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Profile;