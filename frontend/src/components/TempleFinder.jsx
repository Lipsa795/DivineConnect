// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import API_BASE_URL from '../config';  // ✅ ADD THIS LINE

// function TempleFinder() {
//   const [temples, setTemples] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [range, setRange] = useState(5000);
//   const [error, setError] = useState('');
//   const [locationName, setLocationName] = useState('');

//   // Get user's current location
//   const getUserLocation = () => {
//     setLoading(true);
//     setError('');
    
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by your browser');
//       setLoading(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const userLocation = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         };
//         setLocation(userLocation);
        
//         await getLocationName(userLocation.lat, userLocation.lng);
//         await searchNearbyTemples(userLocation.lat, userLocation.lng, range);
//       },
//       (err) => {
//         setError('Unable to get location. Please enable location services.');
//         setLoading(false);
//       }
//     );
//   };

//   const getLocationName = async (lat, lng) => {
//     try {
//       // ✅ FIXED: Added API_BASE_URL
//       const response = await axios.get(`${API_BASE_URL}/api/places/geocode`, {
//         params: { lat, lng }
//       });
      
//       if (response.data.results && response.data.results[0]) {
//         const address = response.data.results[0].formatted_address;
//         const parts = address.split(',');
//         setLocationName(parts.slice(0, 2).join(', '));
//       }
//     } catch (error) {
//       console.log('Could not get location name');
//     }
//   };

//   const searchNearbyTemples = async (lat, lng, radius) => {
//     setLoading(true);
//     setError('');
    
//     try {
//       // ✅ FIXED: Added API_BASE_URL
//       const response = await axios.get(`${API_BASE_URL}/api/places/nearby`, {
//         params: {
//           lat,
//           lng,
//           radius,
//           type: 'hindu_temple',
//           keyword: 'temple'
//         }
//       });
      
//       if (response.data.results && response.data.results.length > 0) {
//         const templesWithDetails = await Promise.all(
//           response.data.results.map(async (place, index) => {
//             let details = null;
//             let photoUrl = null;
            
//             // Get photo URL if available
//             if (place.photos && place.photos[0] && place.photos[0].photo_reference) {
//               photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyC_n4bRPCDpjRJf9TWZXPObNoMrt950VMg`;
//             }
            
//             // Get additional details
//             if (place.place_id) {
//               try {
//                 // ✅ FIXED: Added API_BASE_URL
//                 const detailsResponse = await axios.get(`${API_BASE_URL}/api/places/details`, {
//                   params: { place_id: place.place_id }
//                 });
//                 details = detailsResponse.data.result;
                
//                 // If no photo from nearby search, try to get from details
//                 if (!photoUrl && details?.photos && details.photos[0] && details.photos[0].photo_reference) {
//                   photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=AIzaSyC_n4bRPCDpjRJf9TWZXPObNoMrt950VMg`;
//                 }
//               } catch (e) {
//                 console.log('Could not get details for place:', place.name);
//               }
//             }
            
//             return {
//               id: place.place_id || index,
//               name: place.name,
//               address: place.vicinity || details?.formatted_address || 'Address available',
//               lat: place.geometry.location.lat,
//               lng: place.geometry.location.lng,
//               rating: place.rating || details?.rating || 0,
//               totalRatings: place.user_ratings_total || details?.user_ratings_total || 0,
//               photoUrl: photoUrl,
//               phone: details?.formatted_phone_number,
//               website: details?.website,
//               openNow: details?.opening_hours?.open_now || place.opening_hours?.open_now,
//               openingHours: details?.opening_hours?.weekday_text,
//               priceLevel: place.price_level,
//               imageIcon: getTempleIcon(place.name)
//             };
//           })
//         );
        
//         setTemples(templesWithDetails);
        
//         // Save search results to localStorage for persistence
//         localStorage.setItem('lastTempleSearch', JSON.stringify({
//           location,
//           range,
//           temples: templesWithDetails,
//           locationName,
//           timestamp: Date.now()
//         }));
//       } else {
//         setTemples([]);
//         setError('No temples found in this area. Try increasing the search radius.');
//       }
//     } catch (error) {
//       console.error('Error fetching temples:', error);
//       setError('Error loading temples. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTempleIcon = (name) => {
//     const lowerName = name.toLowerCase();
//     if (lowerName.includes('shiva') || lowerName.includes('kashi') || lowerName.includes('bholenath')) return '🕉️';
//     if (lowerName.includes('ganesh') || lowerName.includes('ganapati') || lowerName.includes('vinayak')) return '🐘';
//     if (lowerName.includes('krishna') || lowerName.includes('iskcon') || lowerName.includes('radha')) return '🔔';
//     if (lowerName.includes('durga') || lowerName.includes('kali') || lowerName.includes('devi')) return '🔱';
//     if (lowerName.includes('ram') || lowerName.includes('hanuman') || lowerName.includes('sita')) return '🙏';
//     if (lowerName.includes('venkateswara') || lowerName.includes('tirupati')) return '⛰️';
//     return '🛕';
//   };

//   const handleRangeChange = async (e) => {
//     const newRange = parseInt(e.target.value);
//     setRange(newRange);
//     if (location) {
//       await searchNearbyTemples(location.lat, location.lng, newRange);
//     }
//   };

//   const getDirections = (lat, lng, name) => {
//     window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place=${encodeURIComponent(name)}`, '_blank');
//   };

//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 >= 0.5;
//     const stars = [];
    
//     for (let i = 0; i < fullStars; i++) {
//       stars.push(<i key={i} className="fas fa-star text-yellow-400 text-xs"></i>);
//     }
//     if (hasHalfStar) {
//       stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400 text-xs"></i>);
//     }
//     const emptyStars = 5 - stars.length;
//     for (let i = 0; i < emptyStars; i++) {
//       stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400 text-xs"></i>);
//     }
//     return stars;
//   };

//   return (
//     <section className="py-16 bg-amber-50" id="TempleFinder">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-amber-900 mb-4">Temples Near You</h2>
//           <p className="text-gray-600 text-lg">Discover sacred places around your location</p>
//         </div>

//         {/* Location Controls */}
//         <div className="max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
//           <button
//             onClick={getUserLocation}
//             disabled={loading}
//             className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition mb-4 disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             <i className="fas fa-location-dot"></i>
//             {loading ? 'Finding temples...' : 'Use My Current Location'}
//           </button>

//           {locationName && (
//             <div className="text-center mb-4 text-gray-600 bg-amber-50 p-2 rounded-lg">
//               <i className="fas fa-map-pin text-amber-700 mr-2"></i>
//               <span className="font-medium">📍 {locationName}</span>
//             </div>
//           )}

//           {location && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Search Radius: {(range / 1000).toFixed(1)} km
//               </label>
//               <input
//                 type="range"
//                 min="1000"
//                 max="20000"
//                 step="1000"
//                 value={range}
//                 onChange={handleRangeChange}
//                 className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
//               />
//               <div className="flex justify-between text-xs text-gray-500 mt-1">
//                 <span>1km</span>
//                 <span>5km</span>
//                 <span>10km</span>
//                 <span>15km</span>
//                 <span>20km</span>
//               </div>
//             </div>
//           )}

//           {error && (
//             <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
//               <i className="fas fa-exclamation-circle mr-2"></i>
//               {error}
//             </div>
//           )}
//         </div>

//         {/* Temples Grid */}
//         {loading && (
//           <div className="text-center py-12">
//             <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
//             <p className="mt-4 text-gray-600">Searching for temples near you...</p>
//           </div>
//         )}

//         {!loading && temples.length > 0 && (
//           <>
//             <div className="mb-4 text-right text-gray-600">
//               <i className="fas fa-temple mr-1"></i> Found {temples.length} temples
//             </div>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {temples.map((temple) => (
//                 <div key={temple.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
//                   {/* Temple Image */}
//                   <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
//                     {temple.photoUrl ? (
//                       <img 
//                         src={temple.photoUrl} 
//                         alt={temple.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.style.display = 'none';
//                           e.target.parentElement.innerHTML = `
//                             <div class="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-amber-100 to-orange-100">
//                               ${temple.imageIcon}
//                             </div>
//                           `;
//                         }}
//                       />
//                     ) : (
//                       <div className="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-amber-100 to-orange-100">
//                         {temple.imageIcon}
//                       </div>
//                     )}
//                     {temple.openNow !== undefined && (
//                       <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
//                         {temple.openNow ? (
//                           <span className="text-green-600">✓ Open Now</span>
//                         ) : (
//                           <span className="text-red-600">Closed</span>
//                         )}
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="p-4">
//                     <h3 className="text-lg font-bold text-amber-900 mb-2 line-clamp-1">
//                       {temple.name}
//                     </h3>
                    
//                     {temple.rating > 0 && (
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="flex gap-0.5">
//                           {renderStars(temple.rating)}
//                         </div>
//                         <span className="text-xs text-gray-500">
//                           ({temple.totalRatings})
//                         </span>
//                       </div>
//                     )}
                    
//                     <p className="text-gray-600 text-xs mb-3 flex items-start gap-1 line-clamp-2">
//                       <i className="fas fa-map-marker-alt text-amber-600 text-xs mt-0.5"></i>
//                       <span>{temple.address}</span>
//                     </p>
                    
//                     {temple.phone && (
//                       <p className="text-gray-500 text-xs mb-3">
//                         <i className="fas fa-phone-alt mr-1"></i> {temple.phone}
//                       </p>
//                     )}
                    
//                     <div className="flex gap-2 mt-3">
//                       <Link 
//                         to={`/temple/${temple.id}`}
//                         state={{ temple }}
//                         className="flex-1 text-center bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-amber-200 transition"
//                       >
//                         View Details
//                       </Link>
//                       <button
//                         onClick={() => getDirections(temple.lat, temple.lng, temple.name)}
//                         className="bg-amber-700 text-white px-3 py-2 rounded-lg text-xs hover:bg-amber-800 transition"
//                         title="Get Directions"
//                       >
//                         <i className="fas fa-directions mr-1"></i> Directions
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {!loading && !location && temples.length === 0 && (
//           <div className="text-center py-12 bg-white rounded-xl shadow">
//             <div className="text-6xl mb-4">🛕</div>
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">Find Temples Near You</h3>
//             <p className="text-gray-500">Click "Use My Current Location" to discover temples in your area</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// export default TempleFinder;

















import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';  // ✅ ADD THIS LINE

function TempleFinder() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [range, setRange] = useState(5000);
  const [error, setError] = useState('');
  const [locationName, setLocationName] = useState('');

  // Get user's current location
  const getUserLocation = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(userLocation);
        
        await getLocationName(userLocation.lat, userLocation.lng);
        await searchNearbyTemples(userLocation.lat, userLocation.lng, range);
      },
      (err) => {
        setError('Unable to get location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const getLocationName = async (lat, lng) => {
    try {
      // ✅ FIXED: Added API_BASE_URL
      const response = await axios.get(`${API_BASE_URL}/api/places/geocode`, {
        params: { lat, lng }
      });
      
      if (response.data.results && response.data.results[0]) {
        const address = response.data.results[0].formatted_address;
        const parts = address.split(',');
        setLocationName(parts.slice(0, 2).join(', '));
      }
    } catch (error) {
      console.log('Could not get location name');
    }
  };

  const searchNearbyTemples = async (lat, lng, radius) => {
    setLoading(true);
    setError('');
    
    try {
      // ✅ FIXED: Added API_BASE_URL
      const response = await axios.get(`${API_BASE_URL}/api/places/nearby`, {
        params: {
          lat,
          lng,
          radius,
          type: 'hindu_temple',
          keyword: 'temple'
        }
      });
      
      if (response.data.results && response.data.results.length > 0) {
        const templesWithDetails = await Promise.all(
          response.data.results.map(async (place, index) => {
            let details = null;
            let photoUrl = null;
            
            // Get photo URL if available
            if (place.photos && place.photos[0] && place.photos[0].photo_reference) {
              photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=AIzaSyC_n4bRPCDpjRJf9TWZXPObNoMrt950VMg`;
            }
            
            // Get additional details
            if (place.place_id) {
              try {
                // ✅ FIXED: Added API_BASE_URL
                const detailsResponse = await axios.get(`${API_BASE_URL}/api/places/details`, {
                  params: { place_id: place.place_id }
                });
                details = detailsResponse.data.result;
                
                // If no photo from nearby search, try to get from details
                if (!photoUrl && details?.photos && details.photos[0] && details.photos[0].photo_reference) {
                  photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=AIzaSyC_n4bRPCDpjRJf9TWZXPObNoMrt950VMg`;
                }
              } catch (e) {
                console.log('Could not get details for place:', place.name);
              }
            }
            
            return {
              id: place.place_id || index,
              name: place.name,
              address: place.vicinity || details?.formatted_address || 'Address available',
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
              rating: place.rating || details?.rating || 0,
              totalRatings: place.user_ratings_total || details?.user_ratings_total || 0,
              photoUrl: photoUrl,
              phone: details?.formatted_phone_number,
              website: details?.website,
              openNow: details?.opening_hours?.open_now || place.opening_hours?.open_now,
              openingHours: details?.opening_hours?.weekday_text,
              priceLevel: place.price_level,
              imageIcon: getTempleIcon(place.name)
            };
          })
        );
        
        setTemples(templesWithDetails);
        
        // Save search results to localStorage for persistence
        localStorage.setItem('lastTempleSearch', JSON.stringify({
          location,
          range,
          temples: templesWithDetails,
          locationName,
          timestamp: Date.now()
        }));
      } else {
        setTemples([]);
        setError('No temples found in this area. Try increasing the search radius.');
      }
    } catch (error) {
      console.error('Error fetching temples:', error);
      setError('Error loading temples. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTempleIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('shiva') || lowerName.includes('kashi') || lowerName.includes('bholenath')) return '🕉️';
    if (lowerName.includes('ganesh') || lowerName.includes('ganapati') || lowerName.includes('vinayak')) return '🐘';
    if (lowerName.includes('krishna') || lowerName.includes('iskcon') || lowerName.includes('radha')) return '🔔';
    if (lowerName.includes('durga') || lowerName.includes('kali') || lowerName.includes('devi')) return '🔱';
    if (lowerName.includes('ram') || lowerName.includes('hanuman') || lowerName.includes('sita')) return '🙏';
    if (lowerName.includes('venkateswara') || lowerName.includes('tirupati')) return '⛰️';
    return '🛕';
  };

  const handleRangeChange = async (e) => {
    const newRange = parseInt(e.target.value);
    setRange(newRange);
    if (location) {
      await searchNearbyTemples(location.lat, location.lng, newRange);
    }
  };

  const getDirections = (lat, lng, name) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place=${encodeURIComponent(name)}`, '_blank');
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400 text-xs"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400 text-xs"></i>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400 text-xs"></i>);
    }
    return stars;
  };

  return (
    <section className="py-16 bg-amber-50" id="TempleFinder">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">Temples Near You</h2>
          <p className="text-gray-600 text-lg">Discover sacred places around your location</p>
        </div>

        {/* Location Controls */}
        <div className="max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition mb-4 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i className="fas fa-location-dot"></i>
            {loading ? 'Finding temples...' : 'Use My Current Location'}
          </button>

          {locationName && (
            <div className="text-center mb-4 text-gray-600 bg-amber-50 p-2 rounded-lg">
              <i className="fas fa-map-pin text-amber-700 mr-2"></i>
              <span className="font-medium">📍 {locationName}</span>
            </div>
          )}

          {location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius: {(range / 1000).toFixed(1)} km
              </label>
              <input
                type="range"
                min="1000"
                max="20000"
                step="1000"
                value={range}
                onChange={handleRangeChange}
                className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1km</span>
                <span>5km</span>
                <span>10km</span>
                <span>15km</span>
                <span>20km</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}
        </div>

        {/* Temples Grid */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
            <p className="mt-4 text-gray-600">Searching for temples near you...</p>
          </div>
        )}

        {!loading && temples.length > 0 && (
          <>
            <div className="mb-4 text-right text-gray-600">
              <i className="fas fa-temple mr-1"></i> Found {temples.length} temples
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {temples.map((temple) => (
                <div key={temple.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                  {/* Temple Image */}
                  <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                    {temple.photoUrl ? (
                      <img 
                        src={temple.photoUrl} 
                        alt={temple.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-amber-100 to-orange-100">
                              ${temple.imageIcon}
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-6xl bg-gradient-to-br from-amber-100 to-orange-100">
                        {temple.imageIcon}
                      </div>
                    )}
                    {temple.openNow !== undefined && (
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                        {temple.openNow ? (
                          <span className="text-green-600">✓ Open Now</span>
                        ) : (
                          <span className="text-red-600">Closed</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-amber-900 mb-2 line-clamp-1">
                      {temple.name}
                    </h3>
                    
                    {temple.rating > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {renderStars(temple.rating)}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({temple.totalRatings})
                        </span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 text-xs mb-3 flex items-start gap-1 line-clamp-2">
                      <i className="fas fa-map-marker-alt text-amber-600 text-xs mt-0.5"></i>
                      <span>{temple.address}</span>
                    </p>
                    
                    {temple.phone && (
                      <p className="text-gray-500 text-xs mb-3">
                        <i className="fas fa-phone-alt mr-1"></i> {temple.phone}
                      </p>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      <Link 
                        to={`/temple/${temple.id}`}
                        state={{ temple }}
                        className="flex-1 text-center bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-amber-200 transition"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => getDirections(temple.lat, temple.lng, temple.name)}
                        className="bg-amber-700 text-white px-3 py-2 rounded-lg text-xs hover:bg-amber-800 transition"
                        title="Get Directions"
                      >
                        <i className="fas fa-directions mr-1"></i> Directions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && !location && temples.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <div className="text-6xl mb-4">🛕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Find Temples Near You</h3>
            <p className="text-gray-500">Click "Use My Current Location" to discover temples in your area</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TempleFinder;