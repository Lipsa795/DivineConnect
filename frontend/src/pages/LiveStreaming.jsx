import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL from '../config';

function LiveStreaming() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [liveStreams, setLiveStreams] = useState([]);
  const [bhajans, setBhajans] = useState([]);
  const [activeTab, setActiveTab] = useState('live');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live streams from YouTube
  const fetchLiveStreams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/youtube/live`, {
        params: { query: 'hindu temple aarti live' }
      });
      if (response.data.success) {
        setLiveStreams(response.data.videos);
      }
    } catch (error) {
      console.error('Error fetching live streams:', error);
    }
  };

  // Fetch bhajans from YouTube
  const fetchBhajans = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/youtube/bhajans`, {
        params: { query: 'popular hindu bhajan aarti' }
      });
      if (response.data.success) {
        setBhajans(response.data.videos);
      }
    } catch (error) {
      console.error('Error fetching bhajans:', error);
    }
  };

  // Refresh live streams
  const refreshLiveStreams = async () => {
    setRefreshing(true);
    await fetchLiveStreams();
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchLiveStreams(), fetchBhajans()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Format view count
  const formatViewCount = (count) => {
    if (!count) return '0';
    const num = parseInt(count);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Format duration (PT1H2M3S to 1:02:03)
  const formatDuration = (duration) => {
    if (!duration) return '';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '';
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentStreams = () => {
    if (activeTab === 'live') return liveStreams;
    return bhajans;
  };

  const filteredStreams = getCurrentStreams().filter(stream => {
    return stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           stream.channelTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-800 to-amber-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Live Spiritual Streams & Bhajans</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            {liveStreams.length > 0 
              ? `🔴 ${liveStreams.length} Live streams currently active`
              : "Experience divine aartis, kirtans, and spiritual music"}
          </p>
        </div>
      </div>

      {/* Live Indicator Banner */}
      {liveStreams.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4 text-center animate-pulse flex justify-between items-center">
          <span className="flex items-center gap-2 mx-auto">
            <i className="fas fa-circle text-white text-xs animate-pulse"></i>
            LIVE NOW: {liveStreams.length} spiritual streams currently broadcasting
          </span>
          <button 
            onClick={refreshLiveStreams}
            disabled={refreshing}
            className="text-white hover:text-amber-200 transition text-sm flex items-center gap-1"
          >
            <i className={`fas fa-sync-alt ${refreshing ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 font-semibold transition relative ${
                activeTab === 'live'
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              <i className="fas fa-circle text-red-500 text-xs mr-2 animate-pulse"></i>
              Live Now
              {liveStreams.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {liveStreams.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('bhajans')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'bhajans'
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-gray-500 hover:text-amber-600'
              }`}
            >
              <i className="fas fa-music mr-2"></i>
              Bhajans & Aartis
              <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {bhajans.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder={activeTab === 'live' ? "Search live streams..." : "Search bhajans, aartis..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-amber-500"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative max-w-4xl w-full bg-black rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white hover:text-amber-400 z-10 bg-black/50 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-gray-900 text-white">
              <div className="flex items-center gap-2 mb-2">
                {activeTab === 'live' && (
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <i className="fas fa-circle text-white text-xs animate-pulse"></i> LIVE
                  </span>
                )}
                <h3 className="text-xl font-bold">{selectedVideo.title}</h3>
              </div>
              <p className="text-amber-400 text-sm">{selectedVideo.channelTitle}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-400">
                <span><i className="far fa-eye mr-1"></i>{formatViewCount(selectedVideo.viewCount)} views</span>
                {selectedVideo.concurrentViewers && (
                  <span><i className="fas fa-users mr-1"></i>{selectedVideo.concurrentViewers} watching</span>
                )}
                {selectedVideo.duration && (
                  <span><i className="far fa-clock mr-1"></i>{formatDuration(selectedVideo.duration)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streams Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700"></div>
            <p className="mt-4 text-gray-600">Loading spiritual content...</p>
          </div>
        ) : filteredStreams.length > 0 ? (
          <>
            {activeTab === 'live' && liveStreams.length === 0 && (
              <div className="text-center py-8 bg-amber-50 rounded-lg mb-8">
                <div className="text-5xl mb-3">📺</div>
                <h3 className="text-xl font-semibold text-amber-800">No Live Streams Currently</h3>
                <p className="text-gray-600 mt-2">Check back during aarti timings or explore our bhajans collection</p>
                <button
                  onClick={() => setActiveTab('bhajans')}
                  className="mt-4 bg-amber-700 text-white px-6 py-2 rounded-full hover:bg-amber-800 transition"
                >
                  Browse Bhajans
                </button>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStreams.map(stream => (
                <div
                  key={stream.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedVideo(stream)}
                >
                  <div className="relative">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                      <div className="w-16 h-16 bg-amber-700 rounded-full flex items-center justify-center">
                        <i className="fas fa-play text-white text-2xl ml-1"></i>
                      </div>
                    </div>
                    
                    {activeTab === 'live' && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <i className="fas fa-circle text-white text-xs animate-pulse"></i> LIVE
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      <i className="far fa-eye mr-1"></i>{formatViewCount(stream.viewCount)} views
                    </div>
                    
                    {stream.duration && !activeTab === 'live' && (
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        {formatDuration(stream.duration)}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-amber-900 mb-1 line-clamp-1">{stream.title}</h3>
                    <p className="text-gray-600 text-sm">{stream.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default LiveStreaming;