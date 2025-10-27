import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Users, Wifi, Coffee, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get(API_ROUTES.ROOMS);
      console.log(response.data);
      
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }
    // Store selected room and navigate to booking page
  // Navigate to the room details page where user can pick dates and confirm booking
  navigate(`/rooms/${room.id}`, { state: { room } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading rooms...</div>
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
            data-testid="rooms-page-title"
          >
            Luxury <span className="text-[#C1A57B]">Accommodations</span>
          </h1>
          <p className="text-gray-400 text-lg">Elegant rooms with breathtaking views</p>
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No rooms available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {rooms.map((room) => (
              <div
                key={room.id}
                data-testid={`room-item-${room.id}`}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-[#C1A57B] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-64 bg-gray-900 overflow-hidden">
                  <img
                    src={
                      room.images && room.images.length > 0
                        ? room.images[0]
                        : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800'
                    }
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* show created date as small tag */}
                  {room.createdAt && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-white mb-2">{room.name}</h3>
                    <span className="text-xs text-[#C1A57B] font-semibold uppercase ml-3">{room.type}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{room.description || 'No description provided.'}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {typeof room.capacity !== 'undefined' && (
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="h-4 w-4 mr-2 text-[#C1A57B]" />
                        {room.capacity} guests
                      </div>
                    )}
                    <div className="flex items-center text-gray-300 text-sm">
                      <Wifi className="h-4 w-4 mr-2 text-[#C1A57B]" />
                      Free WiFi
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Coffee className="h-4 w-4 mr-2 text-[#C1A57B]" />
                      Breakfast
                    </div>
                    {/* rating may not be provided by API */}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-[#C1A57B]">${room.price}</span>
                      <span className="text-gray-400 text-sm ml-2">per night</span>
                    </div>
                    <Button
                      onClick={() => handleBookRoom(room)}
                      data-testid={`book-room-${room.id}`}
                      // always enabled; booking flow will require auth
                      className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] transition-colors disabled:opacity-50"
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
