import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { API_ROUTES } from '../../utils/apiRoutes';
import { Card } from '../../components/ui/card';
import { Users, ShoppingBag, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from admin endpoints
      const [users, bookings, orders] = await Promise.all([
        api.get(API_ROUTES.USER_ALL),
        api.get(API_ROUTES.ADMIN_BOOKINGS),
        api.get(API_ROUTES.FOOD_ORDERS),
      ]);

      const revenue = orders.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalUsers: users.data.length,
        totalBookings: bookings.data.length,
        totalOrders: orders.data.length,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="h-8 w-8" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Calendar className="h-8 w-8" />,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'text-[#C1A57B]',
      bgColor: 'bg-[#C1A57B]/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="admin-dashboard-title"
          >
            Admin <span className="text-[#C1A57B]">Dashboard</span>
          </h1>
          <p className="text-gray-400">Manage your restaurant operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#C1A57B] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>{stat.icon}</div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white" data-testid={`stat-value-${index}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/foods"
              data-testid="manage-foods-link"
              className="bg-black/60 border border-white/10 rounded-lg p-4 hover:border-[#C1A57B] transition-all text-center"
            >
              <h3 className="text-white font-semibold mb-2">Manage Foods</h3>
              <p className="text-gray-400 text-sm">Add, edit, or remove menu items</p>
            </a>
            <a
              href="/admin/rooms"
              data-testid="manage-rooms-link"
              className="bg-black/60 border border-white/10 rounded-lg p-4 hover:border-[#C1A57B] transition-all text-center"
            >
              <h3 className="text-white font-semibold mb-2">Manage Rooms</h3>
              <p className="text-gray-400 text-sm">Update room availability</p>
            </a>
            <a
              href="/admin/activities"
              data-testid="manage-activities-link"
              className="bg-black/60 border border-white/10 rounded-lg p-4 hover:border-[#C1A57B] transition-all text-center"
            >
              <h3 className="text-white font-semibold mb-2">Manage Activities</h3>
              <p className="text-gray-400 text-sm">Create and manage experiences</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
