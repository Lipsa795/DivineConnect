import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function DarshanSlotManager({ settings, onUpdate, showNotification }) {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newSlot, setNewSlot] = useState({
    slotName: '',
    startTime: '',
    endTime: '',
    maxDevotees: 500,
    isAvailable: true
  });

  const updateSlotAvailability = async (slotId, isAvailable) => {
    try {
      const updatedSlots = settings.darshanSlots.map(slot =>
        slot._id === slotId ? { ...slot, isAvailable: !isAvailable } : slot
      );
      await axios.put(`${API_BASE_URL}/api/temple-admin/darshan-slots`, 
        { slots: updatedSlots },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification(`Slot ${isAvailable ? 'closed' : 'opened'} successfully!`, 'success');
      onUpdate();
    } catch (error) {
      showNotification('Error updating slot', 'error');
    }
  };

  const updateDevoteeCount = async (slotId, currentCount, maxDevotees) => {
    if (currentCount >= maxDevotees) {
      showNotification('Maximum capacity reached!', 'error');
      return;
    }
    
    try {
      const updatedSlots = settings.darshanSlots.map(slot =>
        slot._id === slotId ? { ...slot, currentCount: currentCount + 1 } : slot
      );
      await axios.put(`${API_BASE_URL}/api/temple-admin/darshan-slots`, 
        { slots: updatedSlots },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification('Devotee count updated!', 'success');
      onUpdate();
    } catch (error) {
      showNotification('Error updating count', 'error');
    }
  };

  const addNewSlot = async () => {
    if (!newSlot.slotName || !newSlot.startTime || !newSlot.endTime) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    try {
      const updatedSlots = [...(settings.darshanSlots || []), { ...newSlot, _id: Date.now().toString() }];
      await axios.put(`${API_BASE_URL}/api/temple-admin/darshan-slots`, 
        { slots: updatedSlots },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification('New darshan slot added!', 'success');
      setShowAddSlot(false);
      setNewSlot({ slotName: '', startTime: '', endTime: '', maxDevotees: 500, isAvailable: true });
      onUpdate();
    } catch (error) {
      showNotification('Error adding slot', 'error');
    }
  };

  const getCapacityStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return { text: 'Full', color: 'bg-red-100 text-red-700', progress: 'bg-red-500' };
    if (percentage >= 80) return { text: 'High', color: 'bg-orange-100 text-orange-700', progress: 'bg-orange-500' };
    if (percentage >= 50) return { text: 'Medium', color: 'bg-yellow-100 text-yellow-700', progress: 'bg-yellow-500' };
    return { text: 'Available', color: 'bg-green-100 text-green-700', progress: 'bg-green-500' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-900">Darshan Slots Management</h2>
        <button
          onClick={() => setShowAddSlot(!showAddSlot)}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Add Slot
        </button>
      </div>

      {/* Add New Slot Form */}
      {showAddSlot && (
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-3">Add New Darshan Slot</h3>
          <div className="grid md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Slot Name (e.g., Morning Darshan)"
              value={newSlot.slotName}
              onChange={(e) => setNewSlot({...newSlot, slotName: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Max Devotees"
              value={newSlot.maxDevotees}
              onChange={(e) => setNewSlot({...newSlot, maxDevotees: parseInt(e.target.value)})}
              className="px-3 py-2 border rounded-lg"
            />
            <button
              onClick={addNewSlot}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Slot
            </button>
          </div>
        </div>
      )}

      {/* Slots Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {settings?.darshanSlots?.map((slot) => {
          const capacityStatus = getCapacityStatus(slot.currentCount || 0, slot.maxDevotees);
          const percentage = ((slot.currentCount || 0) / slot.maxDevotees) * 100;
          
          return (
            <div key={slot._id} className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${slot.isAvailable ? 'border-green-500' : 'border-red-500'}`}>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-amber-800 text-lg">{slot.slotName}</h3>
                    <p className="text-sm text-gray-600">
                      <i className="far fa-clock mr-1"></i> {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${slot.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {slot.isAvailable ? 'Available' : 'Closed'}
                  </span>
                </div>
                
                {/* Capacity Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacity: {slot.currentCount || 0}/{slot.maxDevotees}</span>
                    <span className={capacityStatus.color}>{capacityStatus.text}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all duration-500 ${capacityStatus.progress}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  {slot.isAvailable && (slot.currentCount || 0) < slot.maxDevotees && (
                    <button
                      onClick={() => updateDevoteeCount(slot._id, slot.currentCount || 0, slot.maxDevotees)}
                      className="flex-1 bg-amber-100 text-amber-700 py-2 rounded-lg text-sm hover:bg-amber-200 transition"
                    >
                      <i className="fas fa-user-plus mr-1"></i> Add Devotee
                    </button>
                  )}
                  <button
                    onClick={() => updateSlotAvailability(slot._id, slot.isAvailable)}
                    className={`flex-1 py-2 rounded-lg text-sm transition ${
                      slot.isAvailable 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    <i className={`fas ${slot.isAvailable ? 'fa-times-circle' : 'fa-check-circle'} mr-1`}></i>
                    {slot.isAvailable ? 'Close Slot' : 'Open Slot'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Slots Message */}
      {(!settings?.darshanSlots || settings.darshanSlots.length === 0) && (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-5xl mb-3">🕉️</div>
          <p className="text-gray-500">No darshan slots created yet</p>
          <button
            onClick={() => setShowAddSlot(true)}
            className="mt-3 text-amber-700 hover:underline"
          >
            Create your first slot
          </button>
        </div>
      )}
    </div>
  );
}

export default DarshanSlotManager;