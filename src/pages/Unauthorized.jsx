import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertCircle } from 'lucide-react';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-600/20 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h1
          className="text-4xl font-bold text-white mb-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
          data-testid="unauthorized-title"
        >
          Access <span className="text-red-500">Denied</span>
        </h1>
        <p className="text-gray-400 mb-8">
          You don't have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <Button
          onClick={() => navigate('/')}
          data-testid="back-home-button"
          className="bg-[#C1A57B] text-black hover:bg-[#D4B88E]"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};
