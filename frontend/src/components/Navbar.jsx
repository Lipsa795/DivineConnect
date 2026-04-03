import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";
import axios from "axios";

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  // Fetch profile picture
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (token && user) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.profilePic) {
            setProfilePic(response.data.profilePic);
          }
        } catch (error) {
          console.error('Error fetching profile pic:', error);
        }
      }
    };
    
    fetchProfilePic();
  }, [token, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Smooth scroll function for anchor links
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // NavLink component with underline hover effect
  const NavLink = ({ to, children, onClick, isAnchor = false }) => {
    const classes = "relative group py-1 hover:text-amber-200 transition duration-300";
    
    if (isAnchor) {
      return (
        <a href={to} onClick={onClick} className={classes}>
          {children}
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
        </a>
      );
    }
    
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
      </Link>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-amber-800 to-amber-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300">
            <span className="text-3xl">🕉️</span>
            DivineConnect
          </Link>

          {/* Mobile button */}
          <button
            className="lg:hidden text-2xl hover:text-amber-200 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            <NavLink to="/">Home</NavLink>

            <NavLink to="#Services" isAnchor onClick={(e) => handleScroll(e, "Services")}>
              Services
            </NavLink>
            
            <NavLink to="#TempleFinder" isAnchor onClick={(e) => handleScroll(e, "TempleFinder")}>
              Temples
            </NavLink>
            
            <NavLink to="/live-streaming">Live Darshan</NavLink>
            
            <NavLink to="/prasadam">Prasadam</NavLink>

            {user ? (
              <>
                <NavLink to="/pooja-booking">Pooja Booking</NavLink>
                <NavLink to="/charity">Charity</NavLink>
                <NavLink to="/samagri">Samagri</NavLink>
                
                {/* About Us moved here - before user dropdown */}
                <NavLink to="/About">About Us</NavLink>

                <div className="relative group">
                  <button className="flex items-center gap-2 hover:text-amber-200 transition duration-300 py-1">
                    {profilePic ? (
                      <img 
                        src={profilePic} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.name}
                    <i className="fas fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180"></i>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-amber-800 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition">
                      <i className="fas fa-user mr-2"></i>My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* About Us moved here - before Login/Signup */}
                <NavLink to="/About">About Us</NavLink>
                
                <NavLink to="/login">Login</NavLink>
                <Link
                  to="/signup"
                  className="bg-white text-amber-700 px-5 py-2 rounded-full font-semibold hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 mt-4" : "max-h-0"}`}>
          {isMenuOpen && (
            <div className="space-y-3 pb-3">
              <Link to="/" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <a
                href="#Services"
                onClick={(e) => handleScroll(e, "Services")}
                className="block hover:text-amber-200 transition py-1"
              >
                Services
              </a>
              <a
                href="#TempleFinder"
                onClick={(e) => handleScroll(e, "TempleFinder")}
                className="block hover:text-amber-200 transition py-1"
              >
                Temples
              </a>
              <Link to="/live-streaming" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                Live Darshan
              </Link>
              <Link to="/prasadam" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                Prasadam
              </Link>

              {user ? (
                <>
                  <Link to="/pooja-booking" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    Pooja Booking
                  </Link>
                  <Link to="/charity" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    Charity
                  </Link>
                  <Link to="/samagri" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    Samagri
                  </Link>
                  {/* About Us in mobile menu */}
                  <Link to="/About" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    About Us
                  </Link>
                  <hr className="border-amber-500/30 my-2" />
                  <div className="flex items-center gap-2 text-sm text-amber-200 py-1">
                    {profilePic ? (
                      <img 
                        src={profilePic} 
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.name}
                  </div>
                  <Link to="/profile" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left hover:text-amber-200 transition py-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* About Us before Login/Signup in mobile menu */}
                  <Link to="/About" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    About Us
                  </Link>
                  <Link to="/login" className="block hover:text-amber-200 transition py-1" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block bg-white text-amber-700 px-4 py-2 rounded-lg text-center hover:bg-amber-50 transition mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;