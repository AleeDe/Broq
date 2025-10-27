import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChefHat, Bed, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ChefHat className="h-8 w-8" />,
      title: 'Exquisite Dining',
      description: 'Savor culinary masterpieces crafted by world-class chefs',
      path: '/food',
    },
    {
      icon: <Bed className="h-8 w-8" />,
      title: 'Luxury Suites',
      description: 'Indulge in opulent rooms with breathtaking views',
      path: '/rooms',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: 'Unique Experiences',
      description: 'Create unforgettable memories with curated activities',
      path: '/activities',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: 'Stories',
      description: 'Discover tales of elegance and extraordinary journeys',
      path: '/blog',
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=80")',
            filter: 'brightness(0.4)',
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="hero-title"
          >
            Your Ultimate Destination
            <br />
            <span className="text-[#C1A57B]">for Unimaginable Getaways</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Where luxury meets culinary artistry and every moment becomes an cherished memory. Experience
            five-star hospitality that transcends expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/rooms')}
              data-testid="hero-book-room-button"
              className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] text-base font-semibold px-8"
            >
              Book Your Stay
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/food')}
              data-testid="hero-explore-dining-button"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black text-base font-semibold px-8"
            >
              Explore Dining
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
              data-testid="features-title"
            >
              Discover <span className="text-[#C1A57B]">Excellence</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Immerse yourself in a world of refined elegance and unparalleled service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => navigate(feature.path)}
                data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group cursor-pointer bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#C1A57B] transition-all duration-300"
              >
                <div className="text-[#C1A57B] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-[#C1A57B] text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="cta-title"
          >
            Begin Your <span className="text-[#C1A57B]">Extraordinary Journey</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Reserve your escape to paradise and experience hospitality redefined
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            data-testid="cta-get-started-button"
            className="bg-[#C1A57B] text-black hover:bg-[#D4B88E] text-base font-semibold px-10"
          >
            Get Started
          </Button>
        </div>
      </section>
    </div>
  );
};
