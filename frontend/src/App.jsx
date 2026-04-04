import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PoojaBooking from "./pages/PoojaBooking";
import CharityFunding from "./pages/CharityFunding";
import SamagriBooking from "./pages/SamagriBooking";
import Prasadam from "./pages/Prasadam";
import TempleDetails from "./pages/TempleDetails";
import Chatbot from "./components/Chatbot";
import BackgroundMusic from "./components/BackgroundMusic";
import LoadingAnimation from "./components/LoadingAnimation";
import LiveStreaming from "./pages/LiveStreaming";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PilgrimageTravel from "./pages/PilgrimageTravel";
import ContactUs from "./pages/ContactUs";
import Careers from "./pages/Careers";
import SketchfabTemples from './pages/SketchfabTemples';
import { DarkModeProvider } from './context/DarkModeContext';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/TempleAdmin/AdminDashboard';
import TemplePartnership from './pages/TemplePartnership';







const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <DarkModeProvider>
    <AuthProvider>
      <BrowserRouter>
        {isLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}
        <div className={isLoading ? "hidden" : "block"}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/temple/:id" element={<TempleDetails />} />
            <Route path="/live-streaming" element={<LiveStreaming />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/sketchfab-temples" element={<SketchfabTemples />} />
            <Route path="/temple-partnership" element={<TemplePartnership />} />



            
            {/* Protected Routes (require login) */}
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            <Route
              path="/pooja-booking"
              element={
                <ProtectedRoute>
                  <PoojaBooking />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/travel"
              element={
                <ProtectedRoute>
                  <PilgrimageTravel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Chatbot />
          <BackgroundMusic />

        </div>
      </BrowserRouter>
    </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;