import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Visitor counter logic
    useEffect(() => {
        const getVisitorCount = () => {
            try {
                let count = localStorage.getItem('divineconnect_visitors');
                
                if (!count) {
                    count = 1;
                    localStorage.setItem('divineconnect_visitors', count);
                } else {
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

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <footer className="bg-gray-900 text-white mt-10">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {/* Logo / About - Column 1 */}
                <div>
                    <h2 className="text-2xl font-bold text-orange-400">🕉️ DivineConnect</h2>
                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
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

                {/* Quick Links - Column 2 */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <Link to="/" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-home text-xs w-4"></i> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/pooja-booking" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-praying-hands text-xs w-4"></i> Pooja Booking
                            </Link>
                        </li>
                        <li>
                            <Link to="/charity" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-hand-holding-heart text-xs w-4"></i> Charity
                            </Link>
                        </li>
                        <li>
                            <Link to="/samagri" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-shopping-bag text-xs w-4"></i> Samagri
                            </Link>
                        </li>
                        <li>
                            <Link to="/prasadam" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-gift text-xs w-4"></i> Prasadam
                            </Link>
                        </li>
                        <li>
                            <Link to="/live-streaming" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-video text-xs w-4"></i> Live Darshan
                            </Link>
                        </li>
                        <li>
                            <Link to="/sketchfab-temples" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-cube text-xs w-4"></i> 3D Temple Explorer
                            </Link>
                        </li>
                        <li>
                            <Link to="/travel" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-car-side text-xs w-4"></i> Pilgrimage Travel
                            </Link>
                        </li>
                        <li>
                            <Link to="/#temples" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-om text-xs w-4"></i> Temples
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Services - Column 3 */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Our Services</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> Free Pooja Samagri
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> Temple Discovery
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> Charity Donations
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> Prasadam Delivery
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> 3D Temple Explorer
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> AI Spiritual Assistant
                        </li>
                        <li className="flex items-center gap-2">
                            <i className="fas fa-check-circle text-green-500 text-xs w-4"></i> Cab & Hotel Booking
                        </li>
                    </ul>
                    
                    {/* Support Links */}
                    <h3 className="text-lg font-semibold mb-3 mt-6 text-orange-400">Support</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <Link to="/contact-us" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-envelope text-xs w-4"></i> Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/careers" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-briefcase text-xs w-4"></i> Careers
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" className="hover:text-orange-400 transition flex items-center gap-2">
                                <i className="fas fa-question-circle text-xs w-4"></i> FAQ
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact & Social - Column 4 */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-orange-400">Connect With Us</h3>
                    
                    {/* Contact */}
                    <div className="space-y-2 mb-4">
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <i className="fas fa-envelope text-orange-400 w-4"></i>
                            support@divineconnect.com
                        </p>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <i className="fas fa-phone-alt text-orange-400 w-4"></i>
                            +91 12345 67890
                        </p>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <i className="fas fa-map-marker-alt text-orange-400 w-4"></i>
                            Bhubaneswar, Odisha, India
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
                        <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition group">
                            <i className="fab fa-linkedin-in text-gray-400 group-hover:text-white text-sm"></i>
                        </a>
                    </div>
                    
                    {/* Trust Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <i className="fas fa-shield-alt text-green-500"></i>
                            <span>Secure Payments</span>
                            <span className="mx-1">•</span>
                            <i className="fas fa-lock text-green-500"></i>
                            <span>Privacy Protected</span>
                            <span className="mx-1">•</span>
                            <i className="fas fa-credit-card text-green-500"></i>
                            <span>100% Secure</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="text-center text-gray-500 text-sm">
                        © {new Date().getFullYear()} DivineConnect. All rights reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                        <Link to="/privacy" className="hover:text-orange-400 transition">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-orange-400 transition">Terms & Conditions</Link>
                        <Link to="/refund" className="hover:text-orange-400 transition">Refund Policy</Link>
                        <Link to="/sitemap" className="hover:text-orange-400 transition">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;