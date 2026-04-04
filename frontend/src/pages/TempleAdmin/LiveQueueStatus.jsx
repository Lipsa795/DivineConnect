import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

function LiveQueueStatus({ settings, onUpdate, showNotification }) {
  const [selectedStatus, setSelectedStatus] = useState(settings?.queueStatus?.status || 'low');
  const [waitingTime, setWaitingTime] = useState(settings?.queueStatus?.waitingTime || '10 mins');
  const [estimatedDevotees, setEstimatedDevotees] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Calculate estimated devotees based on status
    const estimates = {
      low: { min: 10, max: 50, time: '10-20 mins' },
      medium: { min: 50, max: 150, time: '30-45 mins' },
      high: { min: 150, max: 300, time: '1-1.5 hours' },
      full: { min: 300, max: 500, time: '2+ hours' }
    };
    const estimate = estimates[selectedStatus];
    if (estimate) {
      const avg = Math.floor((estimate.min + estimate.max) / 2);
      setEstimatedDevotees(avg);
      setWaitingTime(estimate.time);
    }
  }, [selectedStatus]);

  const updateQueueStatus = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`${API_BASE_URL}/api/temple-admin/queue-status`, 
        { status: selectedStatus, waitingTime },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification(`Queue status updated to ${selectedStatus.toUpperCase()}!`, 'success');
      onUpdate();
    } catch (error) {
      showNotification('Error updating queue status', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🟠';
      case 'full': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'full': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'low': return 'bg-green-100 border-green-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'high': return 'bg-orange-100 border-orange-300';
      case 'full': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const crowdLevels = [
    { id: 'low', name: 'Low', icon: '🟢', description: 'Minimal crowd, quick darshan', color: 'green', waitTime: '10-20 mins', devotees: '10-50' },
    { id: 'medium', name: 'Medium', icon: '🟡', description: 'Moderate crowd, short wait', color: 'yellow', waitTime: '30-45 mins', devotees: '50-150' },
    { id: 'high', name: 'High', icon: '🟠', description: 'Heavy crowd, significant wait', color: 'orange', waitTime: '1-1.5 hours', devotees: '150-300' },
    { id: 'full', name: 'Full', icon: '🔴', description: 'Maximum capacity, very long wait', color: 'red', waitTime: '2+ hours', devotees: '300-500' }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-900 mb-4">Live Queue Status</h2>
      <p className="text-gray-600 mb-6">Update real-time crowd status for devotees checking live darshan</p>

      {/* Current Status Display */}
      <div className={`rounded-xl p-6 mb-6 ${getStatusBg(settings?.queueStatus?.status || 'low')} border-2`}>
        <div className="text-center">
          <div className="text-8xl mb-3">
            {getStatusIcon(settings?.queueStatus?.status || 'low')}
          </div>
          <h3 className={`text-3xl font-bold mb-2 ${getStatusColor(settings?.queueStatus?.status || 'low')}`}>
            {settings?.queueStatus?.status?.toUpperCase()} CROWD
          </h3>
          <p className="text-gray-700 mb-2">
            Estimated wait time: <strong>{settings?.queueStatus?.waitingTime}</strong>
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {settings?.queueStatus?.lastUpdated ? new Date(settings.queueStatus.lastUpdated).toLocaleTimeString() : 'Not updated'}
          </p>
        </div>
      </div>

      {/* Status Selection */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {crowdLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => setSelectedStatus(level.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedStatus === level.id
                ? `border-${level.color}-500 bg-${level.color}-50 shadow-lg scale-105`
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div className="text-3xl mb-2">{level.icon}</div>
            <div className={`font-bold ${selectedStatus === level.id ? `text-${level.color}-600` : 'text-gray-700'}`}>
              {level.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">{level.waitTime}</div>
          </button>
        ))}
      </div>

      {/* Preview Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold text-amber-800 mb-4">Preview - What Devotees Will See</h3>
        <div className={`p-4 rounded-lg ${getStatusBg(selectedStatus)}`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{getStatusIcon(selectedStatus)}</div>
              <div>
                <div className={`font-bold text-xl ${getStatusColor(selectedStatus)}`}>
                  {selectedStatus.toUpperCase()} Crowd
                </div>
                <div className="text-sm text-gray-600">Est. {estimatedDevotees} devotees in queue</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">Wait Time</div>
              <div className="text-2xl font-bold text-amber-700">{waitingTime}</div>
            </div>
          </div>
          
          {/* Progress Bar for Queue */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Queue Length</span>
              <span>{estimatedDevotees} devotees</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`rounded-full h-2 transition-all duration-500 ${
                  selectedStatus === 'low' ? 'bg-green-500 w-1/4' :
                  selectedStatus === 'medium' ? 'bg-yellow-500 w-1/2' :
                  selectedStatus === 'high' ? 'bg-orange-500 w-3/4' : 'bg-red-500 w-full'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <button
        onClick={updateQueueStatus}
        disabled={isUpdating}
        className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isUpdating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Updating...
          </>
        ) : (
          <>
            <i className="fas fa-sync-alt"></i>
            Update Live Queue Status
          </>
        )}
      </button>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <i className="fas fa-info-circle"></i> About Queue Status
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Low</strong> - Minimal crowd, devotees can have quick darshan</li>
          <li>• <strong>Medium</strong> - Moderate crowd, expect short waiting time</li>
          <li>• <strong>High</strong> - Heavy crowd, significant wait time</li>
          <li>• <strong>Full</strong> - Temple at capacity, very long wait times</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Status updates reflect instantly on the live streaming page for devotees
        </p>
      </div>
    </div>
  );
}

export default LiveQueueStatus;