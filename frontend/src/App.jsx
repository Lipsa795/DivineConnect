import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PoojaBooking from './pages/PoojaBooking';
import CharityFunding from './pages/CharityFunding';
import SamagriBooking from './pages/SamagriBooking';
import TempleDetails from './pages/TempleDetails';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pooja-booking" element={<ProtectedRoute><PoojaBooking /></ProtectedRoute>} />
          <Route path="/charity" element={<ProtectedRoute><CharityFunding /></ProtectedRoute>} />
          <Route path="/samagri" element={<ProtectedRoute><SamagriBooking /></ProtectedRoute>} />
          <Route path="/temple/:id" element={<TempleDetails />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;