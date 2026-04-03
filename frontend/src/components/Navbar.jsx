import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config";
import axios from "axios";

function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

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

  // Dropdown handlers with delay
  const handleMouseEnter = (dropdownName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Services Dropdown Items
  const servicesItems = [
    { name: "Pooja Booking", link: "/pooja-booking", icon: "praying-hands" },
    { name: "Charity", link: "/charity", icon: "hand-holding-heart" },
    { name: "Samagri", link: "/samagri", icon: "shopping-bag" },
    { name: "Prasadam", link: "/prasadam", icon: "gift" },
    { name: "Live Darshan", link: "/live-streaming", icon: "video" },
    { name: "Pilgrimage Travel", link: "/travel", icon: "car-side" },
    { name: "Find Temples", link: "#TempleFinder", icon: "om", isAnchor: true }
  ];

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
            {/* Home */}
            <Link to="/" className="relative group py-1 hover:text-amber-200 transition duration-300">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="relative group py-1 hover:text-amber-200 transition duration-300 flex items-center gap-1">
                Services
                <i className="fas fa-chevron-down text-xs ml-1 transition-transform duration-300 group-hover:rotate-180"></i>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
              </button>
              {openDropdown === 'services' && (
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                  {servicesItems.map((item, index) => (
                    item.isAnchor ? (
                      <a
                        key={index}
                        href={item.link}
                        onClick={(e) => {
                          handleScroll(e, item.link.substring(1));
                          setOpenDropdown(null);
                        }}
                        className="block px-4 py-2 hover:bg-amber-50 transition text-sm first:rounded-t-lg last:rounded-b-lg"
                      >
                        <i className={`fas fa-${item.icon} w-5 mr-2 text-amber-600`}></i>
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={index}
                        to={item.link}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 hover:bg-amber-50 transition text-sm first:rounded-t-lg last:rounded-b-lg"
                      >
                        <i className={`fas fa-${item.icon} w-5 mr-2 text-amber-600`}></i>
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* About Us - Normal Link */}
            <Link to="/about" className="relative group py-1 hover:text-amber-200 transition duration-300">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Contact Us - Normal Link */}
            <Link to="/contact-us" className="relative group py-1 hover:text-amber-200 transition duration-300">
              Contact Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Careers - Normal Link */}
            <Link to="/careers" className="relative group py-1 hover:text-amber-200 transition duration-300">
              Careers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
            </Link>

            {user ? (
              <>
                {/* User Dropdown - NotificationBell removed */}
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
                <Link to="/login" className="relative group py-1 hover:text-amber-200 transition duration-300">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-200 group-hover:w-full transition-all duration-300"></span>
                </Link>
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
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-[600px] mt-4" : "max-h-0"}`}>
          {isMenuOpen && (
            <div className="space-y-2 pb-3">
              <Link to="/" className="block hover:text-amber-200 transition py-2" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>

              {/* Services Dropdown in Mobile */}
              <div>
                <button 
                  className="flex items-center justify-between w-full py-2 hover:text-amber-200 transition"
                  onClick={() => setOpenDropdown(openDropdown === 'mobile-services' ? null : 'mobile-services')}
                >
                  <span><i className="fas fa-hands-helping w-5 mr-2"></i>Services</span>
                  <i className={`fas fa-chevron-${openDropdown === 'mobile-services' ? 'up' : 'down'} text-xs transition`}></i>
                </button>
                {openDropdown === 'mobile-services' && (
                  <div className="pl-4 space-y-2 border-l-2 border-amber-400 ml-2">
                    <Link to="/pooja-booking" className="block py-1 text-sm hover:text-amber-200" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-praying-hands w-4 mr-2"></i>Pooja Booking
                    </Link>
                    <Link to="/charity" className="block py-1 text-sm hover:text-amber-200" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-hand-holding-heart w-4 mr-2"></i>Charity
                    </Link>
                    <Link to="/samagri" className="block py-1 text-sm hover:text-amber-200" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-shopping-bag w-4 mr-2"></i>Samagri
                    </Link>
                    <Link to="/prasadam" className="block py-1 text-sm hover:text-amber-200" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-gift w-4 mr-2"></i>Prasadam
                    </Link>
                    <Link to="/live-streaming" className="block py-1 text-sm hover:text-amber-200" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-video w-4 mr-2"></i>Live Darshan
                    </Link>
                    <Link to="/travel" className="block py-1 text-sm hover:text-amber-200" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-car-side w-4 mr-2"></i>Pilgrimage Travel
                    </Link>
                    <a href="#TempleFinder" className="block py-1 text-sm hover:text-amber-200" onClick={(e) => { handleScroll(e, "TempleFinder"); setIsMenuOpen(false); }}>
                      <i className="fas fa-temple w-4 mr-2"></i>Find Temples
                    </a>
                  </div>
                )}
              </div>

              <Link to="/about" className="block hover:text-amber-200 transition py-2" onClick={() => setIsMenuOpen(false)}>
                About Us
              </Link>
              <Link to="/contact-us" className="block hover:text-amber-200 transition py-2" onClick={() => setIsMenuOpen(false)}>
                Contact Us
              </Link>
              <Link to="/careers" className="block hover:text-amber-200 transition py-2" onClick={() => setIsMenuOpen(false)}>
                Careers
              </Link>

              {user ? (
                <>
                  <hr className="border-amber-500/30 my-2" />
                  <div className="flex items-center gap-2 text-sm text-amber-200 py-1">
                    {profilePic ? (
                      <img src={profilePic} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {user.name}
                  </div>
                  <Link to="/profile" className="block hover:text-amber-200 transition py-2" onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left hover:text-amber-200 transition py-2">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block hover:text-amber-200 transition py-2" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="block bg-white text-amber-700 px-4 py-2 rounded-lg text-center hover:bg-amber-50 transition mt-2" onClick={() => setIsMenuOpen(false)}>
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