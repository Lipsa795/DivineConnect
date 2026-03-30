import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Visitor counter logic
    useEffect(() => {
        // Get visitor count from localStorage
        const getVisitorCount = () => {
            try {
                let count = localStorage.getItem('divineconnect_visitors');
                
                if (!count) {
                    // First time visitor
                    count = 1;
                    localStorage.setItem('divineconnect_visitors', count);
                } else {
                    // Returning visitor - increment count for new session
                    count = parseInt(count) + 1;
                    localStorage.setItem('divineconnect_visitors', count);
                }
                
                setVisitorCount(count);
                setIsLoading(false);
            } catch (error) {
                console.error('Error updating visitor count:', error);
                setIsLoading(false);
            }
        };
        
        getVisitorCount();
    }, []);

    // Format number with commas (e.g., 1000 -> 1,000)
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <footer className="bg-gray-900 text-white mt-10">
            <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
                
                {/* Logo / About */}
                <div className="md:col-span-1">
                    <h2 className="text-2xl font-bold text-orange-400">🕉️ DivineConnect</h2>
                    <p className="mt-3 text-sm text-gray-400">
                        Connecting devotees with temples, poojas, and charitable causes.
                    </p>
                    
                    {/* Visitor Counter */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                            <i className="fas fa-users text-orange-400"></i>
                            <span className="text-gray-400">Total Visitors:</span>
                            {isLoading ? (
                                <span className="text-orange-400 animate-pulse">Loading...</span>
                            ) : (
                                <span className="text-orange-400 font-semibold">
                                    {formatNumber(visitorCount)}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            <i className="fas fa-globe mr-1"></i> Join our growing spiritual community
                        </p>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <Link to="/" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-home text-xs"></i> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/pooja-booking" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-praying-hands text-xs"></i> Pooja Booking
                            </Link>
                        </li>
                        <li>
                            <Link to="/charity" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-hand-holding-heart text-xs"></i> Charity
                            </Link>
                        </li>
                        <li>
                            <Link to="/samagri" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-shopping-bag text-xs"></i> Samagri
                            </Link>
                        </li>
                        <li>
                            <Link to="/prasadam" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-gift text-xs"></i> Prasadam
                            </Link>
                        </li>
                        <li>
                            <Link to="/#temples" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-om text-xs"></i> Temples
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Services</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs"></i> Free Pooja Samagri
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs"></i> Temple Discovery
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs"></i> Charity Donations
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs"></i> Prasadam Delivery
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs"></i> AI Spiritual Assistant
                        </li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Connect With Us</h3>
                    
                    {/* Contact */}
                    <div className="space-y-2 mb-4">
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <i className="fas fa-envelope text-orange-400"></i>
                            support@divineconnect.com
                        </p>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <i className="fas fa-phone-alt text-orange-400"></i>
                            +91 12345 67890
                        </p>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <i className="fas fa-map-marker-alt text-orange-400"></i>
                            India
                        </p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 mt-3">
                        <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition group">
                            <i className="fab fa-facebook-f text-gray-400 group-hover:text-white text-sm"></i>
                        </a>
                        <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition group">
                            <i className="fab fa-twitter text-gray-400 group-hover:text-white text-sm"></i>
                        </a>
                        <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition group">
                            <i className="fab fa-instagram text-gray-400 group-hover:text-white text-sm"></i>
                        </a>
                        <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition group">
                            <i className="fab fa-youtube text-gray-400 group-hover:text-white text-sm"></i>
                        </a>
                    </div>
                    
                    {/* Trust Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <i className="fas fa-shield-alt text-green-500"></i>
                            <span>Secure Payments</span>
                            <span className="mx-1">•</span>
                            <i className="fas fa-lock text-green-500"></i>
                            <span>Privacy Protected</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} DivineConnect. All rights reserved.
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                        <Link to="/privacy" className="hover:text-orange-400 transition">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-orange-400 transition">Terms & Conditions</Link>
                        <Link to="/refund" className="hover:text-orange-400 transition">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;








