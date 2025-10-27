import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Calendar, MapPin, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get(API_ROUTES.MY_ROOM_BOOKINGS);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await api.delete(`${API_ROUTES.BOOKINGS}/${cancelBookingId}`);
      toast.success('Booking cancelled successfully');
      setBookings(bookings.filter((b) => b.id !== cancelBookingId));
      setCancelBookingId(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="my-bookings-title"
          >
            My <span className="text-[#C1A57B]">Bookings</span>
          </h1>
          <p className="text-gray-400">Manage your reservations</p>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No bookings found</p>
            <Button
              onClick={() => navigate('/rooms')}
              data-testid="book-now-button"
              className="bg-[#C1A57B] text-black hover:bg-[#D4B88E]"
            >
              Make a Booking
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                data-testid={`booking-item-${booking.id}`}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#C1A57B] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {booking.roomName || booking.activityName || 'Booking'}
                    </h3>

                    <div className="space-y-1 text-gray-400 text-sm">
                      {/* Confirmation code */}
                      {booking.bookingConfirmationCode && (
                        <div>
                          <strong className="text-gray-200">Confirmation:</strong>{' '}
                          <span className="text-[#C1A57B]">{booking.bookingConfirmationCode}</span>
                        </div>
                      )}

                      {/* Check-in / Check-out */}
                      {(booking.checkInDate || booking.checkOutDate) && (
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-[#C1A57B]" />
                            <div>
                              <div>Check-in: {booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : '-'}</div>
                              <div>Check-out: {booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : '-'}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Created at */}
                      {booking.createdAt && (
                        <div className="mt-1">
                          <small className="text-gray-500">Booked on: {new Date(booking.createdAt).toLocaleString()}</small>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          String(booking.status).toUpperCase() === 'CONFIRMED'
                            ? 'bg-green-600/20 text-green-400'
                            : String(booking.status).toUpperCase() === 'PENDING'
                            ? 'bg-yellow-600/20 text-yellow-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                        data-testid={`booking-status-${booking.id}`}
                      >
                        {String(booking.status).charAt(0).toUpperCase() + String(booking.status).slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#C1A57B]">${Number(booking.totalPrice).toFixed(2)}</div>
                      <div className="text-gray-400 text-sm">Total</div>
                    </div>
                    {String(booking.status).toUpperCase() !== 'CANCELLED' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelBookingId(booking.id)}
                        data-testid={`cancel-booking-${booking.id}`}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={cancelBookingId !== null} onOpenChange={() => setCancelBookingId(null)}>
          <AlertDialogContent className="bg-black/95 border-white/20 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="bg-transparent border-white/20 text-white hover:bg-white/5"
                data-testid="cancel-dialog-no"
              >
                No, Keep It
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelBooking}
                data-testid="cancel-dialog-yes"
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
