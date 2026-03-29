import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About"; // ✅ ADD THIS
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PoojaBooking from "./pages/PoojaBooking";
import CharityFunding from "./pages/CharityFunding";
import SamagriBooking from "./pages/SamagriBooking";
import Prasadam from "./pages/Prasadam";
import TempleDetails from "./pages/TempleDetails";
import Chatbot from "./components/Chatbot";
import BackgroundMusic from "./components/BackgroundMusic";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/temple/:id" element={<TempleDetails />} />
          {/* Protected Routes */}
          <Route path="/pooja-booking" element={<PoojaBooking />} />{" "}
          <Route
            path="/charity"
            element={
              <ProtectedRoute>
                <CharityFunding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/samagri"
            element={
              <ProtectedRoute>
                <SamagriBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prasadam"
            element={
              <ProtectedRoute>
                <Prasadam />
              </ProtectedRoute>
            }
          />
        </Routes>

      <Chatbot />
      <BackgroundMusic />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;











