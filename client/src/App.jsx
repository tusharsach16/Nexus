import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindFriends from './pages/FindFriends';
import ProfileSettings from './pages/ProfileSettings';
import Navigation from './components/Navigation';
import useAuthStore from './store/useAuthStore';

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.img 
        src="/logo.png" 
        className="w-40 h-40 object-cover rounded-full border-4 border-primary/20 shadow-2xl"
        animate={{ 
          scale: [0.9, 1.1, 0.9],
          opacity: [0.7, 1, 0.7],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      />
    </div>
  );
  
  if (isAuthenticated) return <Navigate to="/dashboard" />;
  
  return children;
};

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  
  if (loading) return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <motion.img 
        src="/logo.png" 
        className="w-40 h-40 object-cover rounded-full border-4 border-primary/20 shadow-2xl"
        animate={{ 
          scale: [0.9, 1.1, 0.9],
          opacity: [0.7, 1, 0.7],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
      />
    </div>
  );
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0f0f0f] text-[#f5f5f5] overflow-hidden">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-hidden pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
};

const App = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333',
          },
        }}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <AuthRedirect>
              <Landing />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/login" 
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/register" 
          element={<Navigate to="/signup" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/find-friends" 
          element={
            <ProtectedLayout>
              <FindFriends />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedLayout>
              <ProfileSettings />
            </ProtectedLayout>
          } 
        />
        {/* Redirect unknown routes to landing/dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
