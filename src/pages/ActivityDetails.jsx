import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export const ActivityDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();

  const [activity, setActivity] = useState(location.state?.activity || null);
  const [isLoading, setIsLoading] = useState(!activity);
  const [participants, setParticipants] = useState(1);

  const totalPrice = (Number(activity?.price || 0) * Number(participants || 0)).toFixed(2);

  useEffect(() => {
    if (!activity) {
      // fetch list and find by id (public endpoint returns array)
      (async () => {
        try {
          const res = await api.get(API_ROUTES.ACTIVITIES);
          const found = res.data.find((a) => String(a.id) === String(id));
          setActivity(found || null);
        } catch (err) {
          console.error('Failed to load activity', err);
          toast.error('Failed to load activity');
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [activity, id]);

  const handleSubmit = async () => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to book activities');
      navigate('/login');
      return;
    }

    if (!participants || participants < 1) {
      toast.error('Please enter a valid number of participants');
      return;
    }

    if (activity?.maxParticipants && participants > activity.maxParticipants) {
      toast.error(`Maximum participants: ${activity.maxParticipants}`);
      return;
    }

    try {
      await api.post(API_ROUTES.ACTIVITY_BOOKINGS, {
        activityId: activity.id,
        participants: Number(participants),
      });
      toast.success('Activity booked successfully!');
      navigate('/my-bookings');
    } catch (err) {
      console.error('Error booking activity', err);
      toast.error('Failed to book activity');
    }
  };

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  if (!activity) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white">Activity not found</div></div>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto bg-black/40 border border-white/10 rounded-lg overflow-hidden">
        <div className="h-64 bg-gray-900 overflow-hidden">
          <img src={activity.imageUrl} alt={activity.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-2">{activity.name}</h2>
          <p className="text-gray-300 mb-4">{activity.description}</p>

          {activity.duration && <div className="text-gray-400 mb-2">Duration: {activity.duration}</div>}
          {activity.location && <div className="text-gray-400 mb-2">Location: {activity.location}</div>}
          {activity.maxParticipants && <div className="text-gray-400 mb-4">Max: {activity.maxParticipants}</div>}

          <div className="flex items-center gap-3 mb-4">
            <label className="text-white">Participants</label>
            <input
              type="number"
              min={1}
              value={participants}
              onChange={(e) => setParticipants(Number(e.target.value))}
              className="w-24 px-2 py-1 rounded bg-black/60 text-white border border-white/10"
            />
            <div className="text-gray-300">Price per person: <span className="text-[#C1A57B]">${Number(activity.price || 0).toFixed(2)}</span></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xl text-gray-200">Total: <span className="text-2xl font-bold text-[#C1A57B]">${totalPrice}</span></div>
            <Button
              onClick={handleSubmit}
              className="bg-[#C1A57B] text-black"
              disabled={!(participants >= 1) || (activity?.maxParticipants && participants > activity.maxParticipants)}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
