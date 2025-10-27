import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, Menu, X } from 'lucide-react';

export const Header = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/food', label: 'Dining' },
    { path: '/rooms', label: 'Rooms & Suites' },
    { path: '/activities', label: 'Experiences' },
    { path: '/blog', label: 'Stories' },
  ];

  const userLinks = auth.isAuthenticated
    ? [
        { path: '/profile', label: 'Profile' },
        { path: '/my-bookings', label: 'My Bookings' },
        { path: '/my-orders', label: 'My Orders' },
      ]
    : [];

  const adminLinks =
    auth.isAuthenticated && auth.role === 'ADMIN'
      ? [{ path: '/admin/dashboard', label: 'Admin Dashboard' }]
      : [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="header-logo">
            <div className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span className="text-white">BROQ</span>
              <span className="text-[#C1A57B] ml-2">RESTAURANT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-sm tracking-wide transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-[#C1A57B]'
                    : 'text-white hover:text-[#C1A57B]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {!auth.isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  data-testid="header-login-button"
                  className="text-white hover:text-[#C1A57B] hover:bg-white/5"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  data-testid="header-register-button"
                  className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] transition-colors"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    data-testid="user-menu-trigger"
                    className="text-white hover:text-[#C1A57B] hover:bg-white/5"
                  >
                    <User className="mr-2 h-4 w-4" />
                    {auth.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-black/95 border-white/10 text-white"
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-medium">{auth.username}</p>
                    <p className="text-xs text-gray-400">{auth.email}</p>
                  </div>
                  {userLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      data-testid={`user-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="cursor-pointer hover:bg-white/5 hover:text-[#C1A57B]"
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                  {adminLinks.map((link) => (
                    <DropdownMenuItem
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      data-testid="user-menu-admin-dashboard"
                      className="cursor-pointer hover:bg-white/5 hover:text-[#C1A57B]"
                    >
                      {link.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    data-testid="user-menu-logout"
                    className="cursor-pointer hover:bg-white/5 hover:text-red-400"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-t border-white/10" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-[#C1A57B] py-2"
              >
                {link.label}
              </Link>
            ))}
            {auth.isAuthenticated && (
              <>
                <div className="border-t border-white/10 my-3"></div>
                {userLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-[#C1A57B] py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                {adminLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-[#C1A57B] py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-white hover:text-red-400 py-2"
                >
                  Sign Out
                </button>
              </>
            )}
            {!auth.isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-white border-white/20 hover:bg-white/5"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#C1A57B] text-black hover:bg-[#D4B88E]"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
