import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Calendar, BookOpen } from 'lucide-react';

export const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Note: Add blog endpoint to backend if available
      const response = await api.get('/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Don't show error toast, just set empty state
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading stories...</div>
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
            data-testid="blog-page-title"
          >
            Our <span className="text-[#C1A57B]">Stories</span>
          </h1>
          <p className="text-gray-400 text-lg">Tales of elegance and extraordinary journeys</p>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No stories available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                data-testid={`blog-item-${blog.id}`}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-[#C1A57B] transition-all duration-300 group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={blog.imageUrl || 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {blog.date && (
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(blog.date).toLocaleDateString()}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#C1A57B] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3">{blog.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
