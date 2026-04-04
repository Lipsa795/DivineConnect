import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import API_BASE_URL from '../config';

function TemplePartnership() {
  const [formData, setFormData] = useState({
    templeName: '',
    templeCity: '',
    templeState: '',
    templeAddress: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    templeType: '',
    establishedYear: '',
    deity: '',
    description: '',
    facilities: [],
    poojaTypes: [],
    prasadamTypes: [],
    agreementAccepted: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const templeTypes = [
    'Jyotirlinga', 'Shakti Peeth', 'Divya Desam', 'Char Dham',
    'Historic Temple', 'Modern Temple', 'Cave Temple', 'Hill Temple'
  ];

  const facilityOptions = [
    'Parking', 'Prasadam Counter', 'Shoe Stand', 'Drinking Water',
    'Wheelchair Access', 'Restrooms', 'Locker Facility', 'Guide Service'
  ];

  const poojaOptions = [
    'Abhishekam', 'Archana', 'Homam', 'Aarti', 'Sahasranamam',
    'Rudrabhishekam', 'Satyanarayan Pooja', 'Maha Mrityunjaya'
  ];

  const prasadamOptions = [
    'Ladoo', 'Kheer', 'Panchamrit', 'Chandan', 'Vibhuti', 'Kumkum'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (option, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter(item => item !== option)
        : [...prev[field], option]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreementAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }
    
    setLoading(true);
    try {
      // Send partnership request to backend
      await axios.post(`${API_BASE_URL}/api/temple-partnership/request`, formData);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      alert('Error submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">🙏</div>
              <h1 className="text-2xl font-bold text-green-600 mb-3">Partnership Request Submitted!</h1>
              <p className="text-gray-600 mb-4">
                Thank you for your interest in partnering with DivineConnect.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Our team will review your application and contact you within 3-5 business days.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-3">Partner with DivineConnect</h1>
            <p className="text-gray-600 text-lg">
              Join India's fastest growing spiritual platform. Reach millions of devotees worldwide.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl p-5 text-center shadow-md">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-bold text-amber-800">Increased Reach</h3>
              <p className="text-sm text-gray-600">Connect with devotees across India and globally</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow-md">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-bold text-amber-800">Additional Revenue</h3>
              <p className="text-sm text-gray-600">Earn from pooja bookings, prasadam sales, and donations</p>
            </div>
            <div className="bg-white rounded-xl p-5 text-center shadow-md">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-bold text-amber-800">Digital Presence</h3>
              <p className="text-sm text-gray-600">Get a dedicated temple page and management dashboard</p>
            </div>
          </div>

          {/* Partnership Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">Temple Registration Form</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Temple Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-3 border-b pb-2">Temple Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Temple Name *</label>
                    <input
                      type="text"
                      name="templeName"
                      value={formData.templeName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                      placeholder="e.g., Shri Kashi Vishwanath Temple"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Temple Type *</label>
                    <select
                      name="templeType"
                      value={formData.templeType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Select Temple Type</option>
                      {templeTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="templeCity"
                      value={formData.templeCity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., Varanasi"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="templeState"
                      value={formData.templeState}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., Uttar Pradesh"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1">Full Address *</label>
                    <textarea
                      name="templeAddress"
                      value={formData.templeAddress}
                      onChange={handleChange}
                      required
                      rows="2"
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Complete temple address with landmark"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Established Year</label>
                    <input
                      type="text"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., 1780"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Main Deity *</label>
                    <input
                      type="text"
                      name="deity"
                      value={formData.deity}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="e.g., Lord Shiva, Goddess Meenakshi"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-3 border-b pb-2">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities & Services */}
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-3 border-b pb-2">Temple Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {facilityOptions.map(facility => (
                    <label key={facility} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleMultiSelect(facility, 'facilities')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pooja Services */}
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-3 border-b pb-2">Pooja Services Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {poojaOptions.map(pooja => (
                    <label key={pooja} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.poojaTypes.includes(pooja)}
                        onChange={() => handleMultiSelect(pooja, 'poojaTypes')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{pooja}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prasadam Types */}
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-3 border-b pb-2">Prasadam Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {prasadamOptions.map(prasadam => (
                    <label key={prasadam} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.prasadamTypes.includes(prasadam)}
                        onChange={() => handleMultiSelect(prasadam, 'prasadamTypes')}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{prasadam}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-1">Temple Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Tell us about your temple's history, significance, and special features..."
                />
              </div>

              {/* Terms Agreement */}
              <div className="border-t pt-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="agreementAccepted"
                    checked={formData.agreementAccepted}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700">
                    I agree to the <a href="#" className="text-amber-700 hover:underline">Terms and Conditions</a> and confirm that the information provided is accurate.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white py-3 rounded-lg hover:from-amber-800 hover:to-amber-700 transition disabled:opacity-50 font-semibold"
              >
                {loading ? 'Submitting...' : 'Submit Partnership Request'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Have questions? Contact us at <strong className="text-amber-700">partnerships@divineconnect.com</strong> or call <strong className="text-amber-700">+91 12345 67890</strong>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default TemplePartnership;