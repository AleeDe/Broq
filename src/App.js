import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';
import { setAuthContext } from './api/api';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Food } from './pages/Food';
import { Rooms } from './pages/Rooms';
import { RoomDetails } from './pages/RoomDetails';
import { Activities } from './pages/Activities';
import { ActivityDetails } from './pages/ActivityDetails';
import { Blog } from './pages/Blog';
import { Profile } from './pages/Profile';
import { MyBookings } from './pages/MyBookings';
import { MyOrders } from './pages/MyOrders';
import { Unauthorized } from './pages/Unauthorized';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFoods } from './pages/admin/AdminFoods';
import { AdminRooms } from './pages/admin/AdminRooms';
import { AdminActivities } from './pages/admin/AdminActivities';

import '@/App.css';

const AppContent = () => {
  const auth = useAuth();

  useEffect(() => {
    // Set auth context reference for API interceptor
    setAuthContext(auth);
  }, [auth]);

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/food" element={<Food />} />
        <Route path="/rooms" element={<Rooms />} />
  <Route path="/rooms/:id" element={<RoomDetails />} />
    <Route path="/activities" element={<Activities />} />
    <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/foods"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminFoods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/activities"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminActivities />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
