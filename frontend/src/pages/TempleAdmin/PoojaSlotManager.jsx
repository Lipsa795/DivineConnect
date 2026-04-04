import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function PoojaSlotManager({ settings, onUpdate, showNotification }) {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user bookings from the database
  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bookings/all-bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/bookings/${bookingId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification(`Booking marked as ${status}!`, 'success');
      fetchUserBookings();
      onUpdate();
    } catch (error) {
      showNotification('Error updating booking', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-900 mb-4">Pooja Bookings from Devotees</h2>
      <p className="text-gray-600 mb-6">View and manage pooja bookings made by devotees</p>

      {userBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <div className="text-5xl mb-3">🙏</div>
          <p className="text-gray-500">No pooja bookings yet</p>
          <p className="text-sm text-gray-400 mt-2">Bookings will appear here when devotees make a booking</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Devotee Name</th>
                <th className="px-4 py-3 text-left">Pooja Type</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{booking.name || booking.userId?.name || 'Devotee'}</td>
                  <td className="px-4 py-3">{booking.poojaType}</td>
                  <td className="px-4 py-3">
                    {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </td>
                  <td className="px-4 py-3">₹{booking.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PoojaSlotManager;