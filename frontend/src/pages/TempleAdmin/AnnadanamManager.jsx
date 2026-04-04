import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function AnnadanamManager({ settings, onUpdate, showNotification }) {
  const [mealCount, setMealCount] = useState(1);
  const [serveCount, setServeCount] = useState(1);

  const updateAnnadanam = async (data) => {
    try {
      await axios.put(`${API_BASE_URL}/api/temple-admin/annadanam`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('Annadanam updated!', 'success');
      onUpdate();
    } catch (error) {
      showNotification('Error updating annadanam', 'error');
    }
  };

  const serveMeal = async () => {
    if (serveCount > settings?.annadanam?.remainingMeals) {
      showNotification('Not enough meals remaining!', 'error');
      return;
    }
    await updateAnnadanam({
      remainingMeals: settings.annadanam.remainingMeals - serveCount,
      servedCount: (settings.annadanam.servedCount || 0) + serveCount
    });
  };

  const percentageRemaining = (settings?.annadanam?.remainingMeals / settings?.annadanam?.totalMeals) * 100;

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-900 mb-4">Annadanam (Free Meal) Management</h2>
      
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">🍚</div>
          <div className="text-2xl font-bold text-green-700">{settings?.annadanam?.totalMeals || 0}</div>
          <div className="text-sm text-gray-600">Total Meals Planned</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-orange-700">{settings?.annadanam?.servedCount || 0}</div>
          <div className="text-sm text-gray-600">Meals Served Today</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-2xl font-bold text-blue-700">{settings?.annadanam?.remainingMeals || 0}</div>
          <div className="text-sm text-gray-600">Meals Remaining</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round(percentageRemaining)}% Remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-green-500 rounded-full h-4 transition-all duration-500"
            style={{ width: `${percentageRemaining}%` }}
          ></div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-3">Set Daily Meal Limit</h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={mealCount}
              onChange={(e) => setMealCount(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border rounded-lg"
              min="1"
            />
            <button
              onClick={() => updateAnnadanam({ totalMeals: mealCount, remainingMeals: mealCount })}
              className="bg-amber-700 text-white px-4 py-2 rounded-lg"
            >
              Set Limit
            </button>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-3">Serve Meal to Devotee</h3>
          <div className="flex gap-3">
            <input
              type="number"
              value={serveCount}
              onChange={(e) => setServeCount(parseInt(e.target.value))}
              className="flex-1 px-3 py-2 border rounded-lg"
              min="1"
              max={settings?.annadanam?.remainingMeals}
            />
            <button
              onClick={serveMeal}
              disabled={settings?.annadanam?.remainingMeals === 0}
              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Serve Meal
            </button>
          </div>
        </div>
      </div>

      {/* Alert when meals are low */}
      {settings?.annadanam?.remainingMeals < 100 && settings?.annadanam?.remainingMeals > 0 && (
        <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
          <p className="text-yellow-800 text-sm">
            ⚠️ Low meals alert! Only {settings.annadanam.remainingMeals} meals remaining.
          </p>
        </div>
      )}
      
      {settings?.annadanam?.remainingMeals === 0 && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-3 rounded">
          <p className="text-red-800 text-sm">
            🔴 Annadanam completed for today! All meals have been served.
          </p>
        </div>
      )}
    </div>
  );
}

export default AnnadanamManager;