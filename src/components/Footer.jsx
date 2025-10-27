import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3
              className="text-2xl font-bold mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="text-white">BROQ</span>
              <span className="text-[#C1A57B] ml-2">RESTAURANT</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate destination for unimaginable getaways.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#C1A57B]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#C1A57B] text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/food" className="text-gray-400 hover:text-[#C1A57B] text-sm transition-colors">
                  Dining
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-400 hover:text-[#C1A57B] text-sm transition-colors">
                  Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/activities"
                  className="text-gray-400 hover:text-[#C1A57B] text-sm transition-colors"
                >
                  Experiences
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#C1A57B]">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-start text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>123 Luxury Avenue, City</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>info@broq.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#C1A57B]">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-[#C1A57B] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#C1A57B] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#C1A57B] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Broq Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
