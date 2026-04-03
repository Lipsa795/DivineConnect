import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL from '../config';
import axios from 'axios';

function PilgrimageTravel() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('carpool');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  // Carpool States
  const [rides, setRides] = useState([]);
  const [newRide, setNewRide] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: 1,
    price: 0,
    vehicle: 'car',
    description: '',
    contact: ''
  });
  const [showPostRide, setShowPostRide] = useState(false);
  const [requestingRide, setRequestingRide] = useState(null);

  // Hotel States
  const [hotels, setHotels] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [hotelLoading, setHotelLoading] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Cab States
  const [bookingType, setBookingType] = useState('cab');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [fareEstimate, setFareEstimate] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);

  // Get user location
  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(userLoc);
          
          try {
            const geoRes = await axios.get(`${API_BASE_URL}/api/ola-maps/reverse-geocode`, {
              params: { lat: userLoc.lat, lng: userLoc.lng }
            });
            if (geoRes.data.results?.[0]) {
              setLocationName(geoRes.data.results[0].formatted_address);
              setPickup(geoRes.data.results[0].formatted_address);
            }
          } catch (error) {
            console.error('Geocode error:', error);
          }
          
          searchHotelsNearLocation(userLoc.lat, userLoc.lng);
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLoading(false);
        }
      );
    }
  };

  // Fetch city suggestions for hotel search
  const fetchCitySuggestions = async (input) => {
    if (input.length < 2) {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/travel/autocomplete`, {
        params: { input }
      });
      setCitySuggestions(response.data);
      setShowCitySuggestions(true);
    } catch (error) {
      console.error('City suggestions error:', error);
    }
  };

  // Fetch autocomplete suggestions for pickup/dropoff
  const fetchAutocomplete = async (input, type) => {
    if (input.length < 2) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDropoffSuggestions([]);
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/travel/autocomplete`, {
        params: { input }
      });
      if (type === 'pickup') {
        setPickupSuggestions(response.data);
      } else {
        setDropoffSuggestions(response.data);
      }
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
  };

  // Search hotels using Google Places API
  const searchHotelsNearLocation = async (lat, lng) => {
    setHotelLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/travel/hotels`, {
        params: {
          lat,
          lng,
          radius: 5000
        }
      });
      setHotels(response.data || []);
    } catch (error) {
      console.error('Hotel search error:', error);
    } finally {
      setHotelLoading(false);
    }
  };

  // Search hotels by city name
  const searchHotelsByCity = async () => {
    if (!searchCity) {
      alert('Please enter a city or temple name');
      return;
    }
    
    setHotelLoading(true);
    try {
      const geoRes = await axios.get(`${API_BASE_URL}/api/ola-maps/geocode`, {
        params: { address: searchCity }
      });
      
      if (geoRes.data.results?.[0]) {
        const lat = geoRes.data.results[0].geometry.location.lat;
        const lng = geoRes.data.results[0].geometry.location.lng;
        await searchHotelsNearLocation(lat, lng);
        setLocationName(searchCity);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      alert('Error searching hotels');
    } finally {
      setHotelLoading(false);
      setShowCitySuggestions(false);
    }
  };

  // Calculate fare using Google Maps
  const calculateFare = async () => {
    if (!pickup || !dropoff) {
      alert('Please enter pickup and dropoff locations');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/travel/fare`, {
        params: {
          pickup: pickup,
          dropoff: dropoff,
          type: bookingType
        }
      });
      
      setFareEstimate(response.data);
    } catch (error) {
      console.error('Fare calculation error:', error);
      alert(error.response?.data?.error || 'Error calculating fare');
    } finally {
      setLoading(false);
    }
  };

  // Load rides from backend
  const loadRides = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/travel/rides`);
      setRides(response.data);
    } catch (error) {
      console.error('Error loading rides:', error);
    }
  };

  // Post a new ride
  const postRide = async () => {
    if (!user) {
      alert('Please login to post a ride');
      return;
    }
    
    if (!newRide.from || !newRide.to || !newRide.date || !newRide.time) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/travel/rides`, newRide, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Ride posted successfully!');
      setShowPostRide(false);
      setNewRide({ from: '', to: '', date: '', time: '', seats: 1, price: 0, vehicle: 'car', description: '', contact: '' });
      loadRides();
    } catch (error) {
      alert('Error posting ride');
    }
  };

  // Request to join a ride
  const requestRide = async (rideId) => {
    if (!user) {
      alert('Please login to request a ride');
      return;
    }
    
    setRequestingRide(rideId);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/travel/rides/${rideId}/request`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.error || 'Error requesting ride');
    } finally {
      setRequestingRide(null);
    }
  };

  useEffect(() => {
    loadRides();
    getUserLocation();
  }, []);

  const vehicleIcons = {
    car: '🚗',
    auto: '🛺',
    bike: '🏍️'
  };

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-800 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Pilgrimage Travel</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Find hotels near temples, book cabs, and share rides with fellow devotees
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <button onClick={() => setActiveTab('carpool')} className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === 'carpool' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500 hover:text-amber-600'}`}>
              <i className="fas fa-car-side mr-2"></i>Carpool
            </button>
            <button onClick={() => setActiveTab('cabs')} className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === 'cabs' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500 hover:text-amber-600'}`}>
              <i className="fas fa-taxi mr-2"></i>Cab / Auto / Bike
            </button>
            <button onClick={() => setActiveTab('hotels')} className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === 'hotels' ? 'text-amber-700 border-b-2 border-amber-700' : 'text-gray-500 hover:text-amber-600'}`}>
              <i className="fas fa-hotel mr-2"></i>Hotels & Dharamshalas
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* ========== CARPOOL TAB ========== */}
        {activeTab === 'carpool' && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={() => setShowPostRide(!showPostRide)} className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition flex items-center gap-2">
                <i className="fas fa-plus"></i>
                {showPostRide ? 'Cancel' : 'Post a Ride'}
              </button>
            </div>

            {showPostRide && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-amber-900 mb-4">Offer a Ride</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="From (City/Temple) *" value={newRide.from} onChange={(e) => setNewRide({...newRide, from: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="To (Temple/City) *" value={newRide.to} onChange={(e) => setNewRide({...newRide, to: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <input type="date" value={newRide.date} onChange={(e) => setNewRide({...newRide, date: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <input type="time" value={newRide.time} onChange={(e) => setNewRide({...newRide, time: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <select value={newRide.vehicle} onChange={(e) => setNewRide({...newRide, vehicle: e.target.value})} className="px-4 py-2 border rounded-lg">
                    <option value="car">🚗 Car</option>
                    <option value="auto">🛺 Auto</option>
                    <option value="bike">🏍️ Bike</option>
                  </select>
                  <input type="number" placeholder="Seats available *" value={newRide.seats} onChange={(e) => setNewRide({...newRide, seats: parseInt(e.target.value)})} className="px-4 py-2 border rounded-lg" />
                  <input type="number" placeholder="Price per seat (₹) *" value={newRide.price} onChange={(e) => setNewRide({...newRide, price: parseInt(e.target.value)})} className="px-4 py-2 border rounded-lg" />
                  <input type="text" placeholder="Contact number" value={newRide.contact} onChange={(e) => setNewRide({...newRide, contact: e.target.value})} className="px-4 py-2 border rounded-lg" />
                  <textarea placeholder="Additional info" value={newRide.description} onChange={(e) => setNewRide({...newRide, description: e.target.value})} className="px-4 py-2 border rounded-lg col-span-2" rows="2" />
                </div>
                <button onClick={postRide} className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition">Post Ride</button>
              </div>
            )}

            <h3 className="text-xl font-bold text-amber-900 mb-4">Available Rides</h3>
            {rides.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <div className="text-5xl mb-3">🚗</div>
                <p className="text-gray-500">No rides available yet. Be the first to post a ride!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {rides.map((ride) => (
                  <div key={ride._id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{vehicleIcons[ride.vehicle]}</span>
                          <h3 className="font-bold text-amber-800">{ride.from} → {ride.to}</h3>
                        </div>
                        <p className="text-sm text-gray-600"><i className="far fa-calendar-alt mr-1"></i>{new Date(ride.date).toLocaleDateString()} at {ride.time}</p>
                        <p className="text-sm text-gray-600"><i className="fas fa-users mr-1"></i>{ride.seats} seats available</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-700">₹{ride.price}</p>
                        <button onClick={() => requestRide(ride._id)} disabled={requestingRide === ride._id} className="mt-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm hover:bg-amber-200 transition disabled:opacity-50">
                          {requestingRide === ride._id ? 'Requesting...' : 'Request Ride'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== CAB / AUTO / BIKE TAB ========== */}
        {activeTab === 'cabs' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Book Your Ride</h3>
              
              <div className="flex gap-4 mb-6">
                {['cab', 'auto', 'bike'].map((type) => (
                  <button key={type} onClick={() => setBookingType(type)} className={`flex-1 py-3 rounded-lg font-semibold transition ${bookingType === type ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-amber-100'}`}>
                    {type === 'cab' && '🚕 Cab'}
                    {type === 'auto' && '🛺 Auto'}
                    {type === 'bike' && '🏍️ Bike'}
                  </button>
                ))}
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700 mb-2">Pickup Location</label>
                <input type="text" value={pickup} onChange={(e) => { setPickup(e.target.value); fetchAutocomplete(e.target.value, 'pickup'); }} placeholder="Current location or enter address" className="w-full px-4 py-2 border rounded-lg" />
                {pickupSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {pickupSuggestions.map((suggestion) => (
                      <div key={suggestion.place_id} className="px-4 py-2 hover:bg-amber-50 cursor-pointer" onClick={() => { setPickup(suggestion.description); setPickupSuggestions([]); }}>
                        <div className="font-medium">{suggestion.structured_formatting?.main_text || suggestion.description}</div>
                        <div className="text-xs text-gray-500">{suggestion.structured_formatting?.secondary_text}</div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={getUserLocation} className="text-sm text-amber-600 mt-1 hover:underline"><i className="fas fa-location-dot mr-1"></i>Use my current location</button>
              </div>

              <div className="mb-4 relative">
                <label className="block text-gray-700 mb-2">Dropoff Location (Temple)</label>
                <input type="text" value={dropoff} onChange={(e) => { setDropoff(e.target.value); fetchAutocomplete(e.target.value, 'dropoff'); }} placeholder="Enter temple name or address" className="w-full px-4 py-2 border rounded-lg" />
                {dropoffSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {dropoffSuggestions.map((suggestion) => (
                      <div key={suggestion.place_id} className="px-4 py-2 hover:bg-amber-50 cursor-pointer" onClick={() => { setDropoff(suggestion.description); setDropoffSuggestions([]); }}>
                        <div className="font-medium">{suggestion.structured_formatting?.main_text || suggestion.description}</div>
                        <div className="text-xs text-gray-500">{suggestion.structured_formatting?.secondary_text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={calculateFare} disabled={loading} className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition font-semibold">
                {loading ? 'Calculating...' : 'Calculate Fare'}
              </button>

              {fareEstimate && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-bold text-amber-800 mb-2">Fare Estimate</h4>
                  <div className="flex justify-between items-center">
                    <div><p className="text-sm text-gray-600">Distance: {fareEstimate.distance}</p><p className="text-sm text-gray-600">Duration: {fareEstimate.duration}</p></div>
                    <div className="text-right"><p className="text-2xl font-bold text-amber-700">₹{fareEstimate.fare}</p><p className="text-xs text-gray-500">Estimated fare</p></div>
                  </div>
                  <button className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"><i className="fas fa-check-circle mr-2"></i>Confirm Booking</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== HOTELS TAB ========== */}
        {activeTab === 'hotels' && (
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Search hotels near a temple or city..." 
                    value={searchCity} 
                    onChange={(e) => {
                      setSearchCity(e.target.value);
                      fetchCitySuggestions(e.target.value);
                    }} 
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-20 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {citySuggestions.map((suggestion) => (
                        <div
                          key={suggestion.place_id}
                          className="px-4 py-2 hover:bg-amber-50 cursor-pointer"
                          onClick={() => {
                            setSearchCity(suggestion.description);
                            setShowCitySuggestions(false);
                            searchHotelsByCity();
                          }}
                        >
                          <div className="font-medium">{suggestion.structured_formatting?.main_text || suggestion.description}</div>
                          <div className="text-xs text-gray-500">{suggestion.structured_formatting?.secondary_text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={searchHotelsByCity} className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition">Search</button>
                <button onClick={getUserLocation} className="border border-amber-700 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50 transition">
                  <i className="fas fa-location-dot mr-1"></i>Near Me
                </button>
              </div>
              {locationName && <p className="text-sm text-gray-500 mt-2"><i className="fas fa-map-pin text-amber-600 mr-1"></i>Near: {locationName}</p>}
            </div>

            {hotelLoading ? (
              <div className="text-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700 mx-auto"></div><p className="mt-2 text-gray-500">Searching hotels...</p></div>
            ) : hotels.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer" onClick={() => setSelectedHotel(hotel)}>
                    <img 
                      src={hotel.photo_url || (hotel.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${hotel.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : 'https://via.placeholder.com/400x200?text=No+Image')} 
                      alt={hotel.name} 
                      className="w-full h-48 object-cover" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }} 
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-amber-800 mb-1">{hotel.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{hotel.vicinity}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          {hotel.rating && (
                            <span className="text-sm text-yellow-500">
                              <i className="fas fa-star mr-1"></i>{hotel.rating}
                              {hotel.user_ratings_total && <span className="text-gray-500 ml-1">({hotel.user_ratings_total})</span>}
                            </span>
                          )}
                        </div>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name)}`} target="_blank" rel="noopener noreferrer" className="text-amber-700 text-sm hover:underline" onClick={(e) => e.stopPropagation()}>
                          <i className="fas fa-directions mr-1"></i>Directions
                        </a>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedHotel(hotel); }} className="flex-1 bg-amber-700 text-white py-1 rounded-lg text-sm hover:bg-amber-800 transition">View Details</button>
                        {hotel.formatted_phone_number && (
                          <a href={`tel:${hotel.formatted_phone_number}`} className="px-3 py-1 border border-amber-700 text-amber-700 rounded-lg text-sm hover:bg-amber-50 transition" onClick={(e) => e.stopPropagation()}>
                            <i className="fas fa-phone-alt"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <div className="text-5xl mb-3">🏨</div>
                <p className="text-gray-500">No hotels found. Try searching a different location.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedHotel(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-amber-800 to-amber-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-xl font-semibold">Hotel Details</h3>
              <button onClick={() => setSelectedHotel(null)} className="text-white hover:text-amber-200 text-2xl">&times;</button>
            </div>
            
            <div className="p-6">
              <img 
                src={selectedHotel.photo_url || (selectedHotel.photos?.[0]?.photo_reference ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${selectedHotel.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_API_KEY}` : 'https://via.placeholder.com/800x400?text=No+Image')} 
                alt={selectedHotel.name} 
                className="w-full h-64 object-cover rounded-lg mb-4" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }} 
              />
              
              <h2 className="text-2xl font-bold text-amber-900 mb-2">{selectedHotel.name}</h2>
              <p className="text-gray-600 mb-4 flex items-start gap-2">
                <i className="fas fa-map-marker-alt text-amber-600 mt-1"></i>
                {selectedHotel.vicinity || selectedHotel.formatted_address}
              </p>
              
              {selectedHotel.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{selectedHotel.rating}</span>
                    <span className="text-gray-500 ml-1">({selectedHotel.user_ratings_total} reviews)</span>
                  </div>
                </div>
              )}
              
              {selectedHotel.formatted_phone_number && (
                <div className="mb-4">
                  <h4 className="font-semibold text-amber-800 mb-1">Phone</h4>
                  <a href={`tel:${selectedHotel.formatted_phone_number}`} className="text-gray-700 hover:text-amber-700">{selectedHotel.formatted_phone_number}</a>
                </div>
              )}
              
              {selectedHotel.website && (
                <div className="mb-4">
                  <h4 className="font-semibold text-amber-800 mb-1">Website</h4>
                  <a href={selectedHotel.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedHotel.website}</a>
                </div>
              )}
              
              {selectedHotel.opening_hours?.weekday_text && (
                <div className="mb-4">
                  <h4 className="font-semibold text-amber-800 mb-1">Opening Hours</h4>
                  <div className="space-y-1">
                    {selectedHotel.opening_hours.weekday_text.map((day, i) => (
                      <p key={i} className="text-sm text-gray-600">{day}</p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.name)}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-amber-700 text-white py-2 rounded-lg text-center hover:bg-amber-800 transition">
                  <i className="fas fa-directions mr-2"></i>Get Directions
                </a>
                <button onClick={() => setSelectedHotel(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default PilgrimageTravel;