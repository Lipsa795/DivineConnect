import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import DarshanSlotManager from './DarshanSlotManager';
import PoojaSlotManager from './PoojaSlotManager';
import AnnadanamManager from './AnnadanamManager';
import SamagriStockManager from './SamagriStockManager';
import LiveQueueStatus from './LiveQueueStatus';
import EventSlotManager from './EventSlotManager';
import QRCodeGenerator from './QRCodeGenerator';
import PrasadamManager from './PrasadamManager';  // ✅ ADD THIS IMPORT

function AdminDashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [activeModule, setActiveModule] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/temple-admin/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation Modules with their components
  const modules = [
    { id: 'overview', name: 'Dashboard', icon: '📊', component: null },
    { id: 'darshan', name: 'Darshan Slots', icon: '🕉️', component: DarshanSlotManager },
    { id: 'pooja', name: 'Pooja Booking', icon: '🙏', component: PoojaSlotManager },
    { id: 'prasadam', name: 'Prasadam', icon: '🍛', component: PrasadamManager },
    { id: 'annadanam', name: 'Annadanam', icon: '🍚', component: AnnadanamManager },
    { id: 'samagri', name: 'Samagri Stock', icon: '📦', component: SamagriStockManager },
    { id: 'queue', name: 'Live Queue', icon: '👥', component: LiveQueueStatus },
    { id: 'events', name: 'Events', icon: '🎉', component: EventSlotManager },
    { id: 'qrcode', name: 'QR Code', icon: '📱', component: QRCodeGenerator }
  ];

  // Calculate stats
  const stats = {
    totalPrasadamSold: settings?.prasadamItems?.reduce((sum, item) => sum + (item.dailyProduction - item.remaining), 0) || 0,
    remainingPrasadam: settings?.prasadamItems?.reduce((sum, item) => sum + item.remaining, 0) || 0,
    totalDarshanSlots: settings?.darshanSlots?.length || 0,
    activeDarshanSlots: settings?.darshanSlots?.filter(s => s.isAvailable).length || 0,
    bookedPoojas: settings?.poojaSlots?.filter(s => s.status === 'booked').length || 0,
    totalAnnadanam: settings?.annadanam?.remainingMeals || 0,
    crowdLevel: settings?.queueStatus?.status || 'low'
  };

  const getCrowdColor = () => {
    switch(stats.crowdLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'full': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const CurrentComponent = modules.find(m => m.id === activeModule)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded-lg shadow-lg`}>
            <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {notification.message}
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md sticky top-0 z-30">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-amber-700 transition"
            >
              <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <h1 className="text-xl font-bold text-amber-800">Temple Admin Panel</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 transition"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 bg-white shadow-lg min-h-[calc(100vh-73px)]`}>
          <div className="p-4">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeModule === module.id
                    ? 'bg-amber-50 text-amber-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{module.icon}</span>
                {sidebarOpen && <span className="font-medium">{module.name}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeModule === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-amber-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Total Prasadam</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalPrasadamSold}</p>
                      <p className="text-xs text-green-600 mt-1">Sold Today</p>
                    </div>
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🍛</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Remaining Prasadam</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.remainingPrasadam}</p>
                      <p className="text-xs text-orange-600 mt-1">Available Now</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-purple-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Darshan Slots</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.activeDarshanSlots}/{stats.totalDarshanSlots}</p>
                      <p className="text-xs text-blue-600 mt-1">Active</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🕉️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm">Annadanam Meals</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalAnnadanam}</p>
                      <p className="text-xs text-emerald-600 mt-1">Available Today</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🍚</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-bolt text-amber-500"></i> Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setActiveModule('queue')} className="p-3 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition">
                      <span className="text-2xl block mb-1">👥</span>
                      <span className="text-sm font-medium text-amber-700">Update Queue</span>
                    </button>
                    <button onClick={() => setActiveModule('prasadam')} className="p-3 bg-orange-50 rounded-xl text-center hover:bg-orange-100 transition">
                      <span className="text-2xl block mb-1">🍛</span>
                      <span className="text-sm font-medium text-orange-700">Prasadam Stock</span>
                    </button>
                    <button onClick={() => setActiveModule('darshan')} className="p-3 bg-indigo-50 rounded-xl text-center hover:bg-indigo-100 transition">
                      <span className="text-2xl block mb-1">🕉️</span>
                      <span className="text-sm font-medium text-indigo-700">Darshan Slots</span>
                    </button>
                    <button onClick={() => setActiveModule('pooja')} className="p-3 bg-rose-50 rounded-xl text-center hover:bg-rose-100 transition">
                      <span className="text-2xl block mb-1">🙏</span>
                      <span className="text-sm font-medium text-rose-700">Pooja Booking</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fas fa-bell text-amber-500"></i> Live Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Crowd Level</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCrowdColor()}`}>
                        {stats.crowdLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Active Darshan Slots</span>
                      <span className="font-semibold text-amber-700">{stats.activeDarshanSlots} / {stats.totalDarshanSlots}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">Booked Poojas Today</span>
                      <span className="font-semibold text-rose-700">{stats.bookedPoojas}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Render the actual component for other modules */}
          {activeModule !== 'overview' && CurrentComponent && (
            <CurrentComponent settings={settings} onUpdate={fetchSettings} showNotification={showNotification} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AdminDashboard;