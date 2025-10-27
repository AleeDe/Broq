import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export const Profile = () => {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(API_ROUTES.USER_PROFILE);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="profile-title"
          >
            My <span className="text-[#C1A57B]">Profile</span>
          </h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center mr-6">
                {profile?.profilePictureUrl ? (
                  <img src={profile.profilePictureUrl} alt={profile.username || auth.username} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-[#C1A57B]" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white" data-testid="profile-username">
                  {profile?.username || auth.username}
                </h2>
                <p className="text-gray-400" data-testid="profile-email">
                  {profile?.email || auth.email}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                auth.role === 'ADMIN' ? 'bg-[#C1A57B]/20 text-[#C1A57B]' : 'bg-blue-600/20 text-blue-400'
              }`}
              data-testid="profile-role"
            >
              {auth.role}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-[#C1A57B] mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Email Address</div>
                  <div className="text-white">{profile?.email || auth.email}</div>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-5 w-5 text-[#C1A57B] mr-3 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-400">Username</div>
                  <div className="text-white">{profile?.username || auth.username}</div>
                </div>
              </div>
              {profile?.dateOfBirth && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-[#C1A57B] mr-3 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-400">Date of Birth</div>
                    <div className="text-white">{new Date(profile.dateOfBirth).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded">
                  <div className="text-sm text-gray-400">Bookings</div>
                  <div className="text-white font-semibold text-lg">{profile?.numberOfBookings ?? 0}</div>
                </div>
                <div className="bg-black/20 p-4 rounded">
                  <div className="text-sm text-gray-400">Food Orders</div>
                  <div className="text-white font-semibold text-lg">{profile?.numberOfFoodOrders ?? 0}</div>
                </div>
                <div className="bg-black/20 p-4 rounded">
                  <div className="text-sm text-gray-400">Activity Bookings</div>
                  <div className="text-white font-semibold text-lg">{profile?.numberOfActivityBookings ?? 0}</div>
                </div>
                <div className="bg-black/20 p-4 rounded">
                  <div className="text-sm text-gray-400">Active Bookings</div>
                  <div className="text-white font-semibold text-lg">{profile?.numberOfActiveBookings ?? 0}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded">
                  <div className="text-sm text-gray-400">Active Activity Bookings</div>
                  <div className="text-white font-semibold text-lg">{profile?.numberOfActiveActivityBookings ?? 0}</div>
                </div>
                <div className="bg-black/20 p-4 rounded">
                  <div className="text-sm text-gray-400">Active Dining Reservations</div>
                  <div className="text-white font-semibold text-lg">{profile?.numberOfActiveDiningReservations ?? 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/my-bookings')}
            data-testid="view-bookings-button"
            className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] h-14 text-base"
          >
            View My Bookings
          </Button>
          <Button
            onClick={() => navigate('/my-orders')}
            data-testid="view-orders-button"
            className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] h-14 text-base"
          >
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};
