import { create } from 'zustand';
import api from '../services/api';
import useChatStore from './useChatStore';

const useUserStore = create((set) => ({
  searchResults: [],
  pendingRequests: [],
  sentRequests: [],
  selectedUser: null,
  loading: false,

  setSelectedUser: (user) => set({ selectedUser: user }),

  searchUsers: async (query) => {
    try {
      set({ loading: true });
      const { data } = await api.get(`/user/search?q=${query}`);
      set({ searchResults: data.users, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  sendRequest: async (receiverId) => {
    try {
      await api.post('/user/request', { receiverId });
      return true;
    } catch (error) {
      throw error;
    }
  },

  cancelRequest: async (receiverId) => {
    try {
      await api.delete(`/user/request/${receiverId}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  fetchRequests: async () => {
    try {
      const { data } = await api.get('/user/requests');
      set({ 
        pendingRequests: data.requests.pending, 
        sentRequests: data.requests.sent 
      });
    } catch (error) {
      console.error('Failed to fetch requests');
    }
  },

  handleRequest: async (requestId, status) => {
    try {
      await api.post('/user/request/handle', { requestId, status });
      // Refresh requests after handling
      const { data: reqData } = await api.get('/user/requests');
      set({ 
        pendingRequests: reqData.requests.pending, 
        sentRequests: reqData.requests.sent 
      });

      // If accepted, refresh friends in both stores
      if (status === 'ACCEPTED') {
        useChatStore.getState().fetchFriends();
      }
    } catch (error) {
      console.error('Failed to handle request');
    }
  },
  
  unfriend: async (friendId) => {
    try {
      await api.delete(`/user/friend/${friendId}`);
      // Refresh friends list in ChatStore
      useChatStore.getState().fetchFriends();
      return true;
    } catch (error) {
      console.error('Failed to unfriend');
      throw error;
    }
  }
}));

export default useUserStore;
