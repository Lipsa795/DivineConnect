import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function PrasadamManager({ settings, onUpdate, showNotification }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const updatePrasadam = async (itemId, data) => {
    try {
      await axios.put(`${API_BASE_URL}/api/temple-admin/prasadam/${itemId}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('Prasadam updated successfully!', 'success');
      onUpdate();
    } catch (error) {
      showNotification('Error updating prasadam', 'error');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-900 mb-4">Prasadam Manager</h2>
      <p className="text-gray-600 mb-6">Manage daily prasadam production and track remaining stock</p>

      <div className="grid md:grid-cols-2 gap-6">
        {settings?.prasadamItems?.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className={`h-2 ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-amber-800">{item.itemName}</h3>
                  <p className="text-sm text-gray-500">Daily Production: {item.dailyProduction}</p>
                  <p className="text-sm text-gray-500">Max Limit: {item.maxLimit}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.isAvailable ? 'Available' : 'Sold Out'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Remaining: {item.remaining}</span>
                  <span>Sold: {item.dailyProduction - item.remaining}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`rounded-full h-3 transition-all duration-500 ${
                      (item.remaining / item.dailyProduction) > 0.3 ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${(item.remaining / item.dailyProduction) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Slider Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Remaining Quantity
                </label>
                <input
                  type="range"
                  min="0"
                  max={item.dailyProduction}
                  value={item.remaining}
                  onChange={(e) => updatePrasadam(item._id, { remaining: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const newProd = prompt('Enter new daily production:', item.dailyProduction);
                    if (newProd) updatePrasadam(item._id, { dailyProduction: parseInt(newProd) });
                  }}
                  className="bg-amber-100 text-amber-700 py-2 rounded-lg text-sm hover:bg-amber-200 transition"
                >
                  Set Production
                </button>
                <button
                  onClick={() => {
                    const newLimit = prompt('Enter max limit:', item.maxLimit);
                    if (newLimit) updatePrasadam(item._id, { maxLimit: parseInt(newLimit) });
                  }}
                  className="bg-amber-100 text-amber-700 py-2 rounded-lg text-sm hover:bg-amber-200 transition"
                >
                  Set Max Limit
                </button>
              </div>

              {/* Low Stock Alert */}
              {item.remaining < (item.dailyProduction * 0.2) && item.remaining > 0 && (
                <div className="mt-3 p-2 bg-orange-100 rounded-lg text-center">
                  <p className="text-xs text-orange-700">⚠️ Low stock! Only {item.remaining} left</p>
                </div>
              )}
              {item.remaining === 0 && (
                <div className="mt-3 p-2 bg-red-100 rounded-lg text-center">
                  <p className="text-xs text-red-700">🔴 Sold Out! Please increase production</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrasadamManager;