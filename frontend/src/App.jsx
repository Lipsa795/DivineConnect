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
    <AuthProvider>
      <BrowserRouter>
        {isLoading && <LoadingAnimation onComplete={handleLoadingComplete} />}
        <div className={isLoading ? "hidden" : "block"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/temple/:id" element={<TempleDetails />} />
            <Route path="/travel" element={<PilgrimageTravel />} />
            <Route path="/travel" element={<ProtectedRoute><PilgrimageTravel /></ProtectedRoute>} />


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
            <Route path="/live-streaming" element={<LiveStreaming />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
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
  );
}

export default App;
