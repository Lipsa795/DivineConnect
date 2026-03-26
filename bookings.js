import React, { useState } from "react";

export default function TempleBooking() {
  const data = {
    Maharashtra: {
      Mumbai: ["Siddhivinayak Temple", "Mahalaxmi Temple"],
      Pune: ["Dagdusheth Ganpati"]
    },
    TamilNadu: {
      Madurai: ["Meenakshi Temple"],
      Chennai: ["Kapaleeshwarar Temple"]
    },
    UttarPradesh: {
      Varanasi: ["Kashi Vishwanath"]
    }
  };

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [temples, setTemples] = useState([]);

  const handleStateChange = (e) => {
    setState(e.target.value);
    setCity("");
    setTemples([]);
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setTemples(data[state][selectedCity]);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Select Temple for Booking</h1>

      {/* State Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label>Select State: </label>
        <select onChange={handleStateChange} value={state}>
          <option value="">--Select State--</option>
          {Object.keys(data).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* City Dropdown */}
      {state && (
        <div style={{ marginBottom: "20px" }}>
          <label>Select City: </label>
          <select onChange={handleCityChange} value={city}>
            <option value="">--Select City--</option>
            {Object.keys(data[state]).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Temples List */}
      {temples.length > 0 && (
        <div>
          <h3>Prominent Temples</h3>
          {temples.map((t, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "8px"
              }}
            >
              {t}
              <button
                style={{
                  marginLeft: "20px",
                  background: "orange",
                  color: "white",
                  border: "none",
                  padding: "5px 10px"
                }}
                onClick={() => alert(`Booking for ${t}`)}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}