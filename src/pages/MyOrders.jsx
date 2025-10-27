import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { API_ROUTES } from '../utils/apiRoutes';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Package, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(API_ROUTES.FOOD_ORDERS);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading orders...</div>
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
            data-testid="my-orders-title"
          >
            My <span className="text-[#C1A57B]">Orders</span>
          </h1>
          <p className="text-gray-400">Track your food orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No orders found</p>
            <Button
              onClick={() => navigate('/food')}
              data-testid="order-now-button"
              className="bg-[#C1A57B] text-black hover:bg-[#D4B88E]"
            >
              Order Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.orderId || order.id}
                data-testid={`order-item-${order.orderId || order.id}`}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-[#C1A57B] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <Package className="h-5 w-5 text-[#C1A57B] mr-2" />
                      <h3 className="text-xl font-semibold text-white">Order #{order.orderId || order.id}</h3>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1 mb-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-gray-400 text-sm">
                          • {item.foodName || item.name || `Item ${item.foodId || idx}`} x {item.quantity} — <span className="text-[#C1A57B]">${Number(item.unitPrice ?? item.totalPrice ?? 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Time */}
                    {(order.orderTime || order.createdAt) && (
                      <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="h-4 w-4 mr-2 text-[#C1A57B]" />
                        {new Date(order.orderTime || order.createdAt).toLocaleString()}
                      </div>
                    )}

                    {/* Dining mode */}
                    {order.diningMode && (
                      <div className="mt-1 text-gray-400 text-sm">Mode: <span className="text-[#C1A57B]">{order.diningMode}</span></div>
                    )}

                    {/* Status Badge */}
                    <div className="mt-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          String(order.status).toUpperCase() === 'DELIVERED'
                            ? 'bg-green-600/20 text-green-400'
                            : String(order.status).toUpperCase() === 'PREPARING'
                            ? 'bg-yellow-600/20 text-yellow-400'
                            : String(order.status).toUpperCase() === 'CANCELLED'
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-blue-600/20 text-blue-400'
                        }`}
                        data-testid={`order-status-${order.orderId || order.id}`}
                      >
                        {String(order.status).charAt(0).toUpperCase() + String(order.status).slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#C1A57B]">${Number(order.totalPrice ?? order.totalAmount ?? 0).toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">Total</div>
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
