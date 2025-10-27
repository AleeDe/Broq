import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post(API_ROUTES.LOGIN, formData);
      const authData = response.data;

      // Call login from context
      login(authData);

      toast.success('Welcome back!');

      // Redirect based on role
      if (authData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" data-testid="login-logo-link">
            <h1
              className="text-4xl font-bold tracking-wider"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="text-white">BROQ</span>
              <span className="text-[#C1A57B] ml-2">RESTAURANT</span>
            </h1>
          </Link>
          <p className="text-gray-400 mt-3 text-sm">Welcome back to luxury</p>
        </div>

        {/* Login Form */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            {/* email */}
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="login-email-input"
                  className="pl-10 bg-black/50 border-white/20 text-white focus:border-[#C1A57B]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  data-testid="login-password-input"
                  className="pl-10 pr-10 bg-black/50 border-white/20 text-white focus:border-[#C1A57B]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password-visibility"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="login-submit-button"
              className="w-full bg-[#C1A57B] text-black hover:bg-[#D4B88E] transition-colors font-semibold"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                data-testid="login-register-link"
                className="text-[#C1A57B] hover:text-[#D4B88E] transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
