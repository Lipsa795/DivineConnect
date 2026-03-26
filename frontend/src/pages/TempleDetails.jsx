import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function TempleDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if temple data was passed via state
    if (location.state?.temple) {
      setTemple(location.state.temple);
      setLoading(false);
    } else {
      // Try to load from localStorage if available
      const lastSearch = localStorage.getItem('lastTempleSearch');
      if (lastSearch) {
        const searchData = JSON.parse(lastSearch);
        const foundTemple = searchData.temples?.find(t => t.id === id);
        if (foundTemple) {
          setTemple(foundTemple);
          setLoading(false);
          return;
        }
      }
      // If no data found, go back
      navigate('/');
    }
  }, [id, location, navigate]);

  const getDirections = () => {
    if (temple) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}&destination_place=${encodeURIComponent(temple.name)}`, '_blank');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
    }
    return stars;
  };

  const handleBookPooja = () => {
    navigate('/pooja-booking', { state: { temple, preselectedTemple: temple?.name } });
  };

  const handleDonate = () => {
    navigate('/charity', { state: { temple, templeName: temple?.name } });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
        </div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛕</div>
            <p className="text-gray-600 mb-4">Temple not found</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
            >
              Go Back Home
            </button>
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
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-amber-700 hover:text-amber-800 transition bg-white px-4 py-2 rounded-lg shadow-md"
          >
            <i className="fas fa-arrow-left"></i> Back to Temples
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Temple Image */}
            <div className="h-64 md:h-96 bg-gradient-to-br from-amber-100 to-orange-100 relative">
              {temple.photoUrl ? (
                <img 
                  src={temple.photoUrl} 
                  alt={temple.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="h-full flex items-center justify-center text-8xl bg-gradient-to-br from-amber-100 to-orange-100">
                        ${temple.imageIcon || '🛕'}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-8xl bg-gradient-to-br from-amber-100 to-orange-100">
                  {temple.imageIcon || '🛕'}
                </div>
              )}
              
              {temple.openNow !== undefined && (
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {temple.openNow ? (
                    <span className="text-green-600">✓ Open Now</span>
                  ) : (
                    <span className="text-red-600">Closed</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                    {temple.name}
                  </h1>
                  <p className="text-gray-600 flex items-start gap-2">
                    <i className="fas fa-map-marker-alt text-amber-700 mt-1"></i>
                    <span>{temple.address}</span>
                  </p>
                </div>
                <button
                  onClick={getDirections}
                  className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition flex items-center gap-2 whitespace-nowrap"
                >
                  <i className="fas fa-directions"></i>
                  Get Directions
                </button>
              </div>

              {/* Rating Section */}
              {temple.rating > 0 && (
                <div className="bg-amber-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex gap-1 text-xl">
                      {renderStars(temple.rating)}
                    </div>
                    <span className="text-2xl font-bold text-amber-900">{temple.rating}</span>
                    <span className="text-gray-600">({temple.totalRatings} Google reviews)</span>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {temple.phone && (
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <i className="fas fa-phone-alt"></i>
                    Contact Information
                  </h3>
                  <p className="text-gray-700">
                    <a href={`tel:${temple.phone}`} className="hover:text-amber-700">
                      {temple.phone}
                    </a>
                  </p>
                </div>
              )}

              {temple.website && (
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <i className="fas fa-globe"></i>
                    Website
                  </h3>
                  <a 
                    href={temple.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:underline break-all"
                  >
                    {temple.website}
                  </a>
                </div>
              )}

              {/* Opening Hours */}
              {temple.openingHours && temple.openingHours.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-clock"></i>
                    Opening Hours
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {temple.openingHours.map((hours, index) => (
                      <div key={index} className="text-sm text-gray-700 py-1">
                        {hours}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map Section */}
              <div className="mt-8">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <i className="fas fa-map"></i>
                  Location Map
                </h3>
                <div className="rounded-xl overflow-hidden shadow-md">
                  <iframe
                    title="Temple Location"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${temple.lat},${temple.lng}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBookPooja}
                  className="flex-1 bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition font-semibold flex items-center justify-center gap-2"
                >
                  <i className="fas fa-praying-hands"></i>
                  Book Pooja at this Temple
                </button>
                <button
                  onClick={handleDonate}
                  className="flex-1 border-2 border-amber-700 text-amber-700 py-3 rounded-lg hover:bg-amber-50 transition font-semibold flex items-center justify-center gap-2"
                >
                  <i className="fas fa-hand-holding-heart"></i>
                  Donate to Temple
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TempleDetails;