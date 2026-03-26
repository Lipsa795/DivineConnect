import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-amber-800 to-amber-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🕉️</span>
            DivineConnect
          </Link>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            <Link to="/" className="hover:text-amber-200 transition">Home</Link>
            <Link to="/#services" className="hover:text-amber-200 transition">Services</Link>
            <Link to="/#temples" className="hover:text-amber-200 transition">Temples</Link>
            <Link to="/#about" className="hover:text-amber-200 transition">About Us</Link>
            
            {user ? (
              <>
                <Link to="/pooja-booking" className="hover:text-amber-200 transition">Pooja Booking</Link>
                <Link to="/charity" className="hover:text-amber-200 transition">Charity</Link>
                <Link to="/samagri" className="hover:text-amber-200 transition">Samagri</Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:text-amber-200">
                    <i className="fas fa-user-circle"></i>
                    {user.name}
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl hidden group-hover:block">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-amber-200 transition">Login</Link>
                <Link to="/signup" className="bg-amber-700 px-4 py-2 rounded-lg hover:bg-amber-800 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-3 pb-3">
            <Link to="/" className="block hover:text-amber-200">Home</Link>
            <Link to="/#services" className="block hover:text-amber-200">Services</Link>
            <Link to="/#temples" className="block hover:text-amber-200">Temples</Link>
            <Link to="/#about" className="block hover:text-amber-200">About Us</Link>
            {user ? (
              <>
                <Link to="/pooja-booking" className="block hover:text-amber-200">Pooja Booking</Link>
                <Link to="/charity" className="block hover:text-amber-200">Charity</Link>
                <Link to="/samagri" className="block hover:text-amber-200">Samagri</Link>
                <button onClick={handleLogout} className="block w-full text-left hover:text-amber-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-amber-200">Login</Link>
                <Link to="/signup" className="block bg-amber-700 px-4 py-2 rounded-lg text-center hover:bg-amber-800">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;