import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function SamagriStockManager({ settings, onUpdate, showNotification }) {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/samagri/all-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/api/samagri/${orderId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification(`Order marked as ${status}!`, 'success');
      fetchUserOrders();
    } catch (error) {
      showNotification('Error updating order', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Stock items from settings
  const stockItems = settings?.samagriInventory || [];

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-900 mb-4">Samagri Stock & Orders</h2>
      
      {/* Stock Items Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">Current Stock</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stockItems.map((item) => {
            const percentage = (item.quantity / (item.lowStockAlert * 2)) * 100;
            return (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-amber-800">{item.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.quantity === 0 ? 'bg-red-100 text-red-700' :
                    item.quantity <= item.lowStockAlert ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {item.quantity === 0 ? 'Out of Stock' :
                     item.quantity <= item.lowStockAlert ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stock: {item.quantity} {item.unit}</span>
                    <span>Alert: {item.lowStockAlert} {item.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`rounded-full h-2 transition-all duration-500 ${
                        item.quantity <= item.lowStockAlert ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Orders Section */}
      <div>
        <h3 className="text-lg font-semibold text-amber-800 mb-3">Devotee Orders</h3>
        {userOrders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow">
            <div className="text-5xl mb-3">📦</div>
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Devotee</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{order.userId?.name || 'Devotee'}</td>
                    <td className="px-4 py-3">
                      {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-sm">{order.address?.city}</td>
                    <td className="px-4 py-3">₹{order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SamagriStockManager;