import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full p-8 rounded-xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="w-20 h-20 rounded-[28px] overflow-hidden shadow-2xl mb-4 border border-white/10"
          >
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-neutral-400 mt-2 font-medium">Nexus is better when you're here</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
              <input 
                type="email" 
                placeholder="you@example.com"
                className="input pl-11"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="input pl-11"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2 mt-6 py-3">
            Login <LogIn className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center mt-6 text-neutral-400 text-sm">
          New to Nexus?{' '}
          <Link to="/register" className="text-white hover:underline font-medium transition-all">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
