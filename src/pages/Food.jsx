import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { ShoppingCart, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Food = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // persist cart in localStorage so users can navigate away and come back
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
          const parsed = raw ? JSON.parse(raw) : [];
          // normalize cart to aggregated shape: { id, name, price, quantity }
          const grouped = parsed.reduce((acc, item) => {
            const id = item.id ?? item.foodId;
            if (id == null) return acc;
            const quantity = Number(item.quantity ?? 1);
            if (!acc[id]) {
              acc[id] = {
                id,
                name: item.name ?? item.title ?? item.foodName ?? '',
                price: item.price ?? 0,
                quantity,
              };
            } else {
              acc[id].quantity += quantity;
            }
            return acc;
          }, {});
          return Object.values(grouped);
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
      return [];
    }
  });
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [diningMode, setDiningMode] = useState('DINE_IN');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get(API_ROUTES.FOOD);
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast.error('Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };
  const addToCart = (food, qty = 1) => {
    if (!auth.isAuthenticated) {
      toast.error('Please login to place orders');
      navigate('/login');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((p) => p.id === food.id);
      if (existing) {
        return prev.map((p) => (p.id === food.id ? { ...p, quantity: p.quantity + Number(qty) } : p));
      }
      return [...prev, { id: food.id, name: food.name, price: food.price ?? 0, quantity: Number(qty) }];
    });

    toast.success(`${food.name} added to cart`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const updateQuantity = (id, nextQty) => {
    setCart((prev) => {
      if (nextQty <= 0) return prev.filter((c) => c.id !== id);
      return prev.map((c) => (c.id === id ? { ...c, quantity: Number(nextQty) } : c));
    });
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // aggregate cart items by food id into quantities
      const aggregated = Object.values(
        cart.reduce((acc, item) => {
          const id = item.id;
          if (!acc[id]) acc[id] = { foodId: id, quantity: 0 };
          acc[id].quantity += item.quantity ? Number(item.quantity) : 1;
          return acc;
        }, {})
      );

      const payload = {
        diningMode: diningMode || 'DINE_IN',
        items: aggregated,
      };

      await api.post(API_ROUTES.FOOD_ORDERS, payload);
      toast.success('Order placed successfully!');
      setCart([]);
      navigate('/my-orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  // persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading menu...</div>
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
            data-testid="food-page-title"
          >
            Culinary <span className="text-[#C1A57B]">Excellence</span>
          </h1>
          <p className="text-gray-400 text-lg">A symphony of flavors crafted by master chefs</p>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mb-8 bg-[#C1A57B]/10 border border-[#C1A57B]/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-white">
                <ShoppingCart className="mr-2 h-5 w-5 text-[#C1A57B]" />
                <span data-testid="cart-item-count">{cart.length} item(s) in cart</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Dining:</label>
                <select
                  value={diningMode}
                  onChange={(e) => setDiningMode(e.target.value)}
                  className="rounded px-2 py-1 bg-black/60 text-white border border-white/10"
                >
                  <option value="DINE_IN">Dine In</option>
                  <option value="TAKEAWAY">Takeaway</option>
                  <option value="DELIVERY">Delivery</option>
                </select>

                <Button
                  onClick={placeOrder}
                  data-testid="place-order-button"
                  className="bg-[#C1A57B] text-black hover:bg-[#D4B88E]"
                >
                  Place Order
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-black/30 p-2 rounded-md"
                  data-testid={`cart-item-${item.id}`}
                >
                  <div className="text-sm text-white">{item.name}</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-black/20 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 text-white"
                        aria-label={`decrease-qty-${item.id}`}
                      >
                        -
                      </button>
                      <div className="px-3 text-white">{item.quantity}</div>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 text-white"
                        aria-label={`increase-qty-${item.id}`}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm text-[#C1A57B]">${item.price}</div>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      size="sm"
                      variant="ghost"
                      className="text-white"
                      data-testid={`remove-from-cart-${item.id}`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Food Grid */}
        {foods.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p>No items available at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map((food) => (
              <div
                key={food.id}
                data-testid={`food-item-${food.id}`}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-[#C1A57B] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {food.featured && (
                    <div className="absolute top-3 right-3 bg-[#C1A57B] text-black px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{food.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{food.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-[#C1A57B]">${food.price}</span>
                    {food.rating && (
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span className="text-sm">{food.rating}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => addToCart(food)}
                    data-testid={`add-to-cart-${food.id}`}
                    className="w-full bg-[#C1A57B] text-black hover:bg-[#D4B88E] transition-colors"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
