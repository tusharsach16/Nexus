import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),

  login: async (email, password) => {
    try {
      set({ loading: true });
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.accessToken);
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true });
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.accessToken);
      set({ user: data.user, isAuthenticated: true, loading: false });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error', error);
    }
  },

  checkAuth: async () => {
    try {
      const { data } = await api.get('/user/profile');
      set({ user: data.profile, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  }
}));

export default useAuthStore;
