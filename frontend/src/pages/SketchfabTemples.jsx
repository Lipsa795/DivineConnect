import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SketchfabViewer from '../components/SketchfabViewer';
import axios from 'axios';
import API_BASE_URL from '../config';

function SketchfabTemples() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templeImages, setTempleImages] = useState({});

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Temples', icon: '🕉️' },
    { id: 'jyotirlinga', name: 'Jyotirlingas', icon: '🕉️' },
    { id: 'south', name: 'South Indian', icon: '🏛️' },
    { id: 'north', name: 'North Indian', icon: '🏰' },
    { id: 'east', name: 'East Indian', icon: '🌅' },
    { id: 'west', name: 'West Indian', icon: '🌊' }
  ];

  // Famous Temples of India with Sketchfab Model IDs
  const templeModels = [
    // North India
    {
      id: '1b31f9e888b640dbbbab371aa8550697',
      name: 'Shri Kashi Vishwanath Temple',
      city: 'Varanasi, Uttar Pradesh',
      state: 'Uttar Pradesh',
      category: 'jyotirlinga',
      description: 'One of the 12 Jyotirlingas, situated on the banks of River Ganga. It is one of the most sacred Hindu temples.',
      deity: 'Lord Shiva',
      significance: '12 Jyotirlingas, Moksha dayalu',
      bestTime: '5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM',
      festivals: 'Maha Shivaratri, Dev Deepawali',
      searchQuery: 'Kashi Vishwanath Temple Varanasi'
    },
    {
      id: '898b63804d924b6ea89385336f2f8171',
      name: 'Kedarnath Temple',
      city: 'Kedarnath, Uttarakhand',
      state: 'Uttarakhand',
      category: 'jyotirlinga',
      description: 'Highest among the 12 Jyotirlingas, located in the Himalayas at 3,583 meters.',
      deity: 'Lord Shiva',
      significance: 'One of the Char Dham sites',
      bestTime: 'May - October',
      festivals: 'Maha Shivaratri, Samadhi Puja',
      searchQuery: 'Kedarnath Temple Uttarakhand'
    },
    {
      id: 'cf07ee16a4a2432ab2a2f7e1740b1699',
      name: 'Golden Temple (Harmandir Sahib)',
      city: 'Amritsar, Punjab',
      state: 'Punjab',
      category: 'north',
      description: 'The holiest Sikh gurudwara, known for its golden dome and sarovar.',
      deity: 'Guru Granth Sahib',
      significance: 'Sikhism\'s holiest site',
      bestTime: '4:00 AM - 10:00 PM',
      festivals: 'Gurpurab, Baisakhi',
      searchQuery: 'Golden Temple Amritsar'
    },
    {
      id: '3ee2817318164b6a8601d1755d8c350d',
      name: 'Vaishno Devi Temple',
      city: 'Katra, Jammu & Kashmir',
      state: 'Jammu & Kashmir',
      category: 'north',
      description: 'Sacred cave temple dedicated to Goddess Vaishno Devi, located in Trikuta Mountains.',
      deity: 'Goddess Vaishno Devi',
      significance: 'Shakti Peeth',
      bestTime: 'All year',
      festivals: 'Navratri',
      searchQuery: 'Vaishno Devi Temple Katra'
    },

    // South India
    {
      id: '2a0a8e2df2f04b32a7ddd88b71c7eab5',
      name: 'Tirumala Venkateswara Temple',
      city: 'Tirupati, Andhra Pradesh',
      state: 'Andhra Pradesh',
      category: 'south',
      description: 'The richest temple in the world, dedicated to Lord Venkateswara.',
      deity: 'Lord Venkateswara (Balaji)',
      significance: 'One of the richest temples',
      bestTime: '4:00 AM - 6:00 AM (Suprabhatam)',
      festivals: 'Brahmotsavam, Vaikunta Ekadasi',
      searchQuery: 'Tirumala Venkateswara Temple Tirupati'
    },
    {
      id: 'd5a5733adc884eecaa16d47295e4ab66',
      name: 'Meenakshi Amman Temple',
      city: 'Madurai, Tamil Nadu',
      state: 'Tamil Nadu',
      category: 'south',
      description: 'Famous for its stunning architecture with 14 colorful gopurams and 1000 pillars hall.',
      deity: 'Goddess Meenakshi & Lord Sundareswarar',
      significance: 'UNESCO World Heritage nominee',
      bestTime: '5:00 AM - 12:30 PM, 4:00 PM - 9:30 PM',
      festivals: 'Meenakshi Thirukalyanam',
      searchQuery: 'Meenakshi Amman Temple Madurai'
    },
    {
      id: '86c20c9b292b4536b015a7a21f4bc70f',
      name: 'Brihadeeswarar Temple',
      city: 'Thanjavur, Tamil Nadu',
      state: 'Tamil Nadu',
      category: 'south',
      description: 'Ancient Chola temple, UNESCO World Heritage site, with a 216 feet tall vimana.',
      deity: 'Lord Shiva',
      significance: 'UNESCO World Heritage',
      bestTime: '6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM',
      festivals: 'Maha Shivaratri',
      searchQuery: 'Brihadeeswarar Temple Thanjavur'
    },
    {
      id: '038e4dc3a8f843719ad8db3473f245f1',
      name: 'Sabarimala Temple',
      city: 'Sabarimala, Kerala',
      state: 'Kerala',
      category: 'south',
      description: 'Famous Ayyappa temple located in the Western Ghats.',
      deity: 'Lord Ayyappa',
      significance: 'Makaravilakku festival',
      bestTime: 'November - January',
      festivals: 'Makar Sankranti',
      searchQuery: 'Sabarimala Temple Kerala'
    },
    {
      id: '764f3a3192c84f0f9ff2a0aa5c075dc2',
      name: 'Padmanabhaswamy Temple',
      city: 'Thiruvananthapuram, Kerala',
      state: 'Kerala',
      category: 'south',
      description: 'Known for its vast underground vaults and Dravidian architecture.',
      deity: 'Lord Vishnu',
      significance: 'Richest temple treasury',
      bestTime: '3:30 AM - 12:00 PM, 5:00 PM - 7:20 PM',
      festivals: 'Alpashy festival',
      searchQuery: 'Padmanabhaswamy Temple Thiruvananthapuram'
    },

    // East India
    {
      id: 'c01040eb7a414084bda1c967c93bfbcc',
      name: 'Jagannath Temple',
      city: 'Puri, Odisha',
      state: 'Odisha',
      category: 'east',
      description: 'Famous for the annual Rath Yatra (Chariot Festival).',
      deity: 'Lord Jagannath, Balabhadra, Subhadra',
      significance: 'Char Dham',
      bestTime: '5:00 AM - 10:00 PM',
      festivals: 'Rath Yatra, Snana Yatra',
      searchQuery: 'Jagannath Temple Puri'
    },
    {
      id: '6cc905be2ae34e8091eb1eaa84a17738',
      name: 'Konark Sun Temple',
      city: 'Konark, Odisha',
      state: 'Odisha',
      category: 'east',
      description: 'UNESCO World Heritage site, designed as a giant chariot of the Sun God.',
      deity: 'Sun God (Surya)',
      significance: 'UNESCO World Heritage',
      bestTime: '6:00 AM - 6:00 PM',
      festivals: 'Konark Dance Festival',
      searchQuery: 'Konark Sun Temple Odisha'
    },

    // West India
    {
      id: 'af914f8e413a49b791772f0afbeae4a5',
      name: 'Somnath Temple',
      city: 'Somnath, Gujarat',
      state: 'Gujarat',
      category: 'jyotirlinga',
      description: 'The first among the 12 Jyotirlingas, located on the Arabian Sea coast.',
      deity: 'Lord Shiva',
      significance: 'First Jyotirlinga',
      bestTime: '6:00 AM - 9:00 PM',
      festivals: 'Maha Shivaratri',
      searchQuery: 'Somnath Temple Gujarat'
    },
    {
      id: '47c7088dfa504072be893650d204cfbe',
      name: 'Dwarkadhish Temple',
      city: 'Dwarka, Gujarat',
      state: 'Gujarat',
      category: 'west',
      description: 'One of the Char Dham sites, believed to be Lord Krishna\'s kingdom.',
      deity: 'Lord Krishna',
      significance: 'Char Dham',
      bestTime: '6:30 AM - 1:00 PM, 4:00 PM - 9:30 PM',
      festivals: 'Janmashtami',
      searchQuery: 'Dwarkadhish Temple Dwarka'
    },
    {
      id: '1d885cb0b0054e6cb1c9a8dd176db58f',
      name: 'Shirdi Sai Baba Temple',
      city: 'Shirdi, Maharashtra',
      state: 'Maharashtra',
      category: 'west',
      description: 'Famous temple dedicated to Sai Baba, visited by millions annually.',
      deity: 'Sai Baba',
      significance: 'Samadhi Mandir',
      bestTime: '4:00 AM - 11:00 PM',
      festivals: 'Ramnavmi, Gurupurnima',
      searchQuery: 'Shirdi Sai Baba Temple Maharashtra'
    },
    {
      id: '2a23bd0a421c4900a044f19e8184bbe7',
      name: 'Maha Lakshmi Temple',
      city: 'Kolhapur, Maharashtra',
      state: 'Maharashtra',
      category: 'west',
      description: 'One of the 108 Shakti Peethas, dedicated to Goddess Mahalakshmi.',
      deity: 'Goddess Mahalakshmi',
      significance: 'Shakti Peeth',
      bestTime: '4:30 AM - 9:00 PM',
      festivals: 'Navratri',
      searchQuery: 'Mahalakshmi Temple Kolhapur'
    }
  ];

  // Fetch temple images from Google Places API
  const fetchTempleImage = async (templeName, templeId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/places/search-photo`, {
        params: { query: templeName }
      });
      
      if (response.data && response.data.photoUrl) {
        setTempleImages(prev => ({
          ...prev,
          [templeId]: response.data.photoUrl
        }));
      } else {
        // Fallback to placeholder
        setTempleImages(prev => ({
          ...prev,
          [templeId]: null
        }));
      }
    } catch (error) {
      console.error('Error fetching image for:', templeName);
      setTempleImages(prev => ({
        ...prev,
        [templeId]: null
      }));
    }
  };

  // Load images for all temples
  useEffect(() => {
    templeModels.forEach(temple => {
      fetchTempleImage(temple.searchQuery, temple.id);
    });
  }, []);

  const filteredModels = templeModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-amber-800 to-amber-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">3D Temple Explorer</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Explore famous temples of India in stunning 3D. Rotate, zoom, and examine every architectural detail.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          
          {!selectedModel ? (
            <>
              {/* Stats Counter */}
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  <i className="fas fa-cube text-amber-600 mr-1"></i>
                  {filteredModels.length} Temples Available in 3D
                </p>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full transition ${
                      selectedCategory === cat.id
                        ? 'bg-amber-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-amber-100'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span> {cat.name}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search temples by name, city or state..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Temple Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model)}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    {/* Temple Image - Now using Google Places API */}
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 relative overflow-hidden">
                      {templeImages[model.id] ? (
                        <img 
                          src={templeImages[model.id]} 
                          alt={model.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.parentElement.innerHTML = `
                              <div class="h-full flex items-center justify-center">
                                <span class="text-6xl">🛕</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-pulse">
                            <span className="text-6xl">🛕</span>
                            <p className="text-xs text-gray-500 mt-2">Loading image...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-amber-900">{model.name}</h3>
                      <p className="text-gray-600 text-sm">{model.city}</p>
                      <p className="text-gray-500 text-xs mt-1">{model.state}</p>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{model.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                          {model.category === 'jyotirlinga' ? 'Jyotirlinga' : 
                           model.category === 'south' ? 'South Indian' :
                           model.category === 'north' ? 'North Indian' :
                           model.category === 'east' ? 'East Indian' : 'West Indian'}
                        </span>
                        <button className="text-amber-700 font-semibold text-sm">
                          Explore in 3D →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredModels.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No temples found</h3>
                  <p className="text-gray-500">Try a different search term or category</p>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-12 bg-amber-100 rounded-xl p-6 text-center">
                <i className="fas fa-cube text-amber-700 text-3xl mb-3"></i>
                <p className="text-amber-800 font-medium">
                  🎯 15+ Famous Temples | 3D Interactive Models
                </p>
                <p className="text-amber-700 text-sm mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Drag to rotate | Right-click to pan | Scroll to zoom | Touch gestures on mobile
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <button
                onClick={() => setSelectedModel(null)}
                className="mb-4 bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition flex items-center gap-2"
              >
                <i className="fas fa-arrow-left"></i> Back to Temples
              </button>

              {/* 3D Viewer */}
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-800 to-amber-600 px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-white text-xl font-bold">{selectedModel.name}</h2>
                      <p className="text-amber-200 text-sm">{selectedModel.city}, {selectedModel.state}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <SketchfabViewer modelId={selectedModel.id} title={selectedModel.name} />
                </div>
                
                <div className="p-6 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">📿 About this Temple</h3>
                      <p className="text-gray-600">{selectedModel.description}</p>
                      <div className="mt-3">
                        <span className="font-semibold text-amber-700">Deity:</span>
                        <span className="text-gray-600 ml-2">{selectedModel.deity}</span>
                      </div>
                      <div className="mt-1">
                        <span className="font-semibold text-amber-700">Significance:</span>
                        <span className="text-gray-600 ml-2">{selectedModel.significance}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2">🕒 Darshan Timings</h3>
                      <p className="text-gray-600">{selectedModel.bestTime}</p>
                      <h3 className="font-bold text-amber-800 mt-3 mb-2">🎉 Festivals</h3>
                      <p className="text-gray-600">{selectedModel.festivals}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                    <i className="fas fa-cube mr-1"></i> 
                    3D Model | Interactive Viewer | Full 360° Experience
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default SketchfabTemples;