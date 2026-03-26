import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
            
            {/* Logo / About */}
            <div>
            <h2 className="text-2xl font-bold text-orange-400">🕉️ DivineConnect</h2>
            <p className="mt-3 text-sm text-gray-400">
                Connecting devotees with temples, poojas, and charitable causes.
            </p>
            </div>

            {/* Links */}
            <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
                <li>Home</li>
                <li>Pooja Booking</li>
                <li>Charity</li>
                <li>Samagri</li>
            </ul>
            </div>

            {/* Contact */}
            <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <p className="text-gray-400">📧 support@divineconnect.com</p>
            <p className="text-gray-400">📍 India</p>
            </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-gray-500 text-sm pb-5">
            © {new Date().getFullYear()} DivineConnect. All rights reserved.
        </div>
        </footer>
    );
};

export default Footer;