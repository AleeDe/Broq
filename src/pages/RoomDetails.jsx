import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Users, Calendar as CalendarIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const RoomDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [room, setRoom] = useState(location.state?.room || null);
  const [isLoading, setIsLoading] = useState(!room);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  useEffect(() => {
    if (room) return;

    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(API_ROUTES.ROOMS);
        const found = res.data.find((r) => String(r.id) === String(id));
        if (!found) {
          toast.error('Room not found');
          navigate('/rooms');
          return;
        }
        setRoom(found);
      } catch (error) {
        console.error('Error fetching room:', error);
        toast.error('Failed to load room details');
        navigate('/rooms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id, room, navigate]);

  // Robust date parsing: accept ISO yyyy-mm-dd or dd/mm/yyyy (common manual entry)
  const parseInputDate = (value) => {
    if (!value) return null;
    // ISO format (yyyy-mm-dd)
    if (value.includes('-')) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
    // Slash format: try dd/mm/yyyy or yyyy/mm/dd
    if (value.includes('/')) {
      const parts = value.split('/').map((p) => p.trim());
      if (parts.length !== 3) return null;
      // if first part is 4 digits, assume yyyy/mm/dd
      if (parts[0].length === 4) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const dt = new Date(y, m, d);
        return isNaN(dt.getTime()) ? null : dt;
      }
      // otherwise assume dd/mm/yyyy
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      const dt = new Date(y, m, d);
      return isNaN(dt.getTime()) ? null : dt;
    }
    // Fallback: try Date constructor
    const fallback = new Date(value);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

  const nights = (() => {
    if (!checkIn || !checkOut) return 0;
    const d1 = parseInputDate(checkIn);
    const d2 = parseInputDate(checkOut);
    if (!d1 || !d2) return 0;
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  })();

  const totalPrice = room && nights ? room.price * nights : 0;

  const handleConfirmBooking = async () => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to make a booking');
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }

    // validate date parsing
    const parsedIn = parseInputDate(checkIn);
    const parsedOut = parseInputDate(checkOut);
    if (!parsedIn || !parsedOut) {
      toast.error('Invalid date format. Use yyyy-mm-dd or dd/mm/yyyy');
      return;
    }

    const fmt = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    try {
      setIsSubmitting(true);
      // Build payload expected by backend
      const payload = {
        checkInDate: fmt(parsedIn),
        checkOutDate: fmt(parsedOut),
        roomId: room.id,
      };

      // Axios instance `api` already attaches Authorization header via interceptor
      await api.post(API_ROUTES.BOOKINGS, payload);

      toast.success('Booking created successfully');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      // Show backend message if available
      const msg = error.response?.data?.message || 'Failed to create booking';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !room) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading room...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-96 bg-gray-900">
            <img
              src={room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200'}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h2 className="text-3xl font-semibold text-white mb-2">{room.name}</h2>
            <div className="flex items-center gap-4 text-gray-300 mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-[#C1A57B]" />
                {room.capacity} guests
              </div>
              <div className="text-xs text-[#C1A57B] font-semibold uppercase">{room.type}</div>
            </div>

            <p className="text-gray-400 mb-6">{room.description || 'No description provided.'}</p>

            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-1">Check-in</label>
              <input
                type="date"
                ref={checkInRef}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                onClick={() => {
                  // Try to open native picker when supported
                  try {
                    checkInRef.current?.showPicker?.();
                  } catch (e) {
                    /* ignore */
                  }
                }}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white relative z-20 pointer-events-auto"
                data-testid="checkin-input"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-1">Check-out</label>
              <input
                type="date"
                ref={checkOutRef}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                onClick={() => {
                  try {
                    checkOutRef.current?.showPicker?.();
                  } catch (e) {
                    /* ignore */
                  }
                }}
                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white relative z-20 pointer-events-auto"
                data-testid="checkout-input"
              />
            </div>

            <div className="flex items-center justify-between mt-6">
              <div>
                <div className="text-sm text-gray-400">Price per night</div>
                <div className="text-2xl font-bold text-[#C1A57B]">${room.price}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">Nights</div>
                <div className="text-xl text-white font-semibold">{nights}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="text-sm text-gray-400">Total</div>
                <div className="text-2xl font-bold text-[#C1A57B]">${totalPrice}</div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="bg-[#C1A57B] text-black hover:bg-[#D4B88E]"
                  data-testid="confirm-booking"
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/rooms')}
                  className="text-white border-white/10"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
