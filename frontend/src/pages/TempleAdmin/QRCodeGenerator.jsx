import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';

function QRCodeGenerator() {
  const [qrText, setQrText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrType, setQrType] = useState('darshan');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const generateQR = async () => {
    setLoading(true);
    try {
      let text = '';
      const baseUrl = window.location.origin;
      
      switch(qrType) {
        case 'darshan':
          text = `${baseUrl}/darshan-slot/${qrText || 'default'}`;
          break;
        case 'pooja':
          text = `${baseUrl}/pooja-booking/${qrText || 'default'}`;
          break;
        case 'prasadam':
          text = `${baseUrl}/prasadam-order/${qrText || 'default'}`;
          break;
        case 'annadanam':
          text = `${baseUrl}/annadanam/${qrText || 'default'}`;
          break;
        default:
          text = qrText || baseUrl;
      }
      
      const qr = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#b87333',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qr);
    } catch (error) {
      console.error('QR generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `divineconnect-${qrType}-qr.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const printQR = () => {
    if (qrCodeUrl) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Print QR Code</title></head>
          <body style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column">
            <img src="${qrCodeUrl}" style="width:300px;height:300px" />
            <p style="margin-top:20px;font-family:Arial">${qrType.toUpperCase()} QR Code</p>
          </body>
        </html>
      `);
      printWindow.print();
    }
  };

  const qrTypes = [
    { id: 'darshan', name: 'Darshan Slot', icon: '🕉️', color: 'amber' },
    { id: 'pooja', name: 'Pooja Booking', icon: '🙏', color: 'green' },
    { id: 'prasadam', name: 'Prasadam Counter', icon: '🍛', color: 'orange' },
    { id: 'annadanam', name: 'Annadanam', icon: '🍚', color: 'blue' }
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-amber-900 mb-4">QR Code Generator</h2>
      <p className="text-gray-600 mb-6">Generate QR codes for offline verification of slots, bookings, and counters</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Panel - Generator */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-amber-800 mb-4">Generate QR Code</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select QR Type</label>
            <div className="grid grid-cols-2 gap-2">
              {qrTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`p-3 rounded-lg border-2 transition ${
                    qrType === type.id
                      ? 'border-amber-700 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-semibold">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrType === 'darshan' ? 'Slot ID / Name' :
               qrType === 'pooja' ? 'Booking Reference' :
               qrType === 'prasadam' ? 'Counter Number' : 'Meal Token ID'}
            </label>
            <input
              type="text"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder={`Enter ${qrType} identifier`}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={generateQR}
            disabled={loading}
            className="w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {/* Right Panel - QR Display */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="font-semibold text-amber-800 mb-4">Your QR Code</h3>
          
          {qrCodeUrl ? (
            <>
              <div className="flex justify-center mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 border rounded-lg shadow" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <i className="fas fa-download mr-2"></i>Download
                </button>
                <button
                  onClick={printQR}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <i className="fas fa-print mr-2"></i>Print
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Scan this QR code at the temple for offline verification
              </p>
            </>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-6xl mb-3">📱</div>
              <p className="text-gray-500">QR code will appear here</p>
              <p className="text-xs text-gray-400 mt-2">Select type and click generate</p>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 bg-amber-50 rounded-lg p-4">
        <h3 className="font-semibold text-amber-800 mb-2">How to Use</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-amber-600">1.</span>
            <span>Select QR type (Darshan Slot, Pooja Booking, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">2.</span>
            <span>Enter a unique identifier (Slot ID, Booking Reference, etc.)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">3.</span>
            <span>Generate and download the QR code</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600">4.</span>
            <span>Print and place at temple counter for offline verification</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default QRCodeGenerator;