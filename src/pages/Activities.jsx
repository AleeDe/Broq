import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Clock, MapPin, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get(API_ROUTES.ACTIVITIES);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookActivity = (activity) => {
    // Navigate to details page where user can choose participants and confirm
    navigate(`/activities/${activity.id}`, { state: { activity } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading experiences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="activities-page-title"
          >
            Unforgettable <span className="text-[#C1A57B]">Experiences</span>
          </h1>
          <p className="text-gray-400 text-lg">Curated activities for lasting memories</p>
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No activities available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <div
                key={activity.id}
                data-testid={`activity-item-${activity.id}`}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-[#C1A57B] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-900 overflow-hidden">
                  <img
                    src={activity.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600'}
                    alt={activity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{activity.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{activity.description}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {activity.duration && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock className="h-4 w-4 mr-2 text-[#C1A57B]" />
                        {activity.duration}
                      </div>
                    )}
                    {activity.location && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-[#C1A57B]" />
                        {activity.location}
                      </div>
                    )}
                    {activity.maxParticipants && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="h-4 w-4 mr-2 text-[#C1A57B]" />
                        Up to {activity.maxParticipants} people
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#C1A57B]">${activity.price}</span>
                    <Button
                      onClick={() => handleBookActivity(activity)}
                      data-testid={`book-activity-${activity.id}`}
                      className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] transition-colors"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
