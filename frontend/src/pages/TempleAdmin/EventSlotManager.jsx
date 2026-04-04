import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function EventSlotManager({ settings, onUpdate, showNotification }) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    date: '',
    totalCapacity: 100,
    price: 500
  });

  const addEvent = async () => {
    if (!newEvent.eventName || !newEvent.date) {
      showNotification('Please fill all fields', 'error');
      return;
    }
    
    try {
      await axios.post(`${API_BASE_URL}/api/temple-admin/event-slot`, newEvent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showNotification('Event slot added!', 'success');
      setShowAddEvent(false);
      setNewEvent({ eventName: '', date: '', totalCapacity: 100, price: 500 });
      onUpdate();
    } catch (error) {
      showNotification('Error adding event', 'error');
    }
  };

  const bookEvent = async (eventId, currentBooked) => {
    try {
      await axios.put(`${API_BASE_URL}/api/temple-admin/event-slot/${eventId}`, 
        { bookedCount: currentBooked + 1 },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification('Booking confirmed!', 'success');
      onUpdate();
    } catch (error) {
      showNotification('Error booking event', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-amber-900">Special Event Slots</h2>
        <button
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition"
        >
          + Create Event
        </button>
      </div>

      {showAddEvent && (
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-3">Create New Event Slot</h3>
          <div className="grid md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Event Name"
              value={newEvent.eventName}
              onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newEvent.totalCapacity}
              onChange={(e) => setNewEvent({...newEvent, totalCapacity: parseInt(e.target.value)})}
              className="px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={newEvent.price}
              onChange={(e) => setNewEvent({...newEvent, price: parseInt(e.target.value)})}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addEvent} className="bg-green-600 text-white px-4 py-2 rounded-lg">Create Event</button>
            <button onClick={() => setShowAddEvent(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {settings?.eventSlots?.map((event) => {
          const percentageBooked = (event.bookedCount / event.totalCapacity) * 100;
          const availableSpots = event.totalCapacity - event.bookedCount;
          
          return (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`h-2 ${
                availableSpots === 0 ? 'bg-red-500' :
                availableSpots < 20 ? 'bg-orange-500' :
                availableSpots < 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <div className="p-4">
                <h3 className="font-bold text-amber-800 text-lg">{event.eventName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <i className="far fa-calendar-alt mr-1"></i> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <i className="fas fa-tag mr-1"></i> ₹{event.price} per person
                </p>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Capacity: {event.bookedCount}/{event.totalCapacity}</span>
                    <span>{availableSpots} spots left</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all duration-500 ${
                        availableSpots === 0 ? 'bg-red-500' :
                        availableSpots < 20 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentageBooked}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-3 flex gap-2">
                  {availableSpots > 0 ? (
                    <button
                      onClick={() => bookEvent(event._id, event.bookedCount)}
                      className="flex-1 bg-amber-700 text-white py-2 rounded-lg text-sm hover:bg-amber-800 transition"
                    >
                      Book Slot
                    </button>
                  ) : (
                    <button className="flex-1 bg-gray-300 text-gray-500 py-2 rounded-lg text-sm cursor-not-allowed" disabled>
                      Sold Out
                    </button>
                  )}
                  <button className="px-3 py-2 border border-amber-700 text-amber-700 rounded-lg text-sm hover:bg-amber-50 transition">
                    Details
                  </button>
                </div>
                
                {availableSpots < 20 && availableSpots > 0 && (
                  <p className="text-xs text-orange-600 mt-2">⚠️ Only {availableSpots} spots remaining!</p>
                )}
                {availableSpots === 0 && (
                  <p className="text-xs text-red-600 mt-2">🔴 Event is fully booked!</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventSlotManager;