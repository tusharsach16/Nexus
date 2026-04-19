import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserMinus, Check, Clock, UserCheck, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../store/useUserStore';
import useChatStore from '../store/useChatStore';
import UserProfileModal from '../components/UserProfileModal';
import toast from 'react-hot-toast';

const FindFriends = () => {
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    searchResults, 
    searchUsers, 
    sendRequest, 
    cancelRequest,
    pendingRequests, 
    sentRequests,
    fetchRequests, 
    handleRequest,
    selectedUser,
    setSelectedUser,
    loading
  } = useUserStore();
  const onlineUsers = useChatStore((state) => state.onlineUsers);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchUsers]);

  const onSendRequest = async (userId) => {
    try {
      await sendRequest(userId);
      toast.success('Friend request sent!');
      fetchRequests(); // Refresh requests state
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const onCancelRequest = async (userId) => {
    try {
      await cancelRequest(userId);
      toast.success('Request cancelled');
      fetchRequests(); // Refresh requests state
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  const handleOpenProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 bg-[#0f0f0f] overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto p-6 sm:p-10">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Discover People</h1>
          <p className="text-neutral-500 font-medium">Connect with friends and expand your network on NexusChat.</p>
        </div>

        {/* Search Section */}
        <div className="relative group mb-16">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or username..."
            className="w-full bg-[#1a1a1a] border border-dark-border rounded-[20px] pl-14 pr-6 py-5 text-lg text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-xl shadow-black/20"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Search Results */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Search Results</h2>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => {
                  const isSent = sentRequests.some(r => r.receiverId === user.id);
                  return (
                    <div 
                      key={user.id} 
                      onClick={() => handleOpenProfile(user)}
                      className="p-4 rounded-2xl bg-[#1a1a1a]/50 border border-dark-border flex items-center justify-between group hover:bg-[#1a1a1a] hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={user.profile.avatarUrl || `https://ui-avatars.com/api/?name=${user.profile?.name || 'User'}`} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-dark-border" />
                          {onlineUsers?.includes(user.id) && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-[3px] border-[#1a1a1a] rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base">{user.profile.name}</h4>
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-0.5">@{user.profile.username}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          isSent ? onCancelRequest(user.id) : onSendRequest(user.id);
                        }}
                        className={`p-3 border rounded-xl transition-all shadow-lg active:scale-95 ${
                          isSent 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' 
                            : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white'
                        }`}
                      >
                        {isSent ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-12 bg-[#1a1a1a]/30 border border-dark-border border-dashed rounded-3xl">
                  <p className="text-neutral-600 font-medium">Use the search bar to find new connections</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Requests */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <Shield className="w-4 h-4 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Pending Requests</h2>
            </div>
            
            <div className="space-y-4">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <div key={req.id} className="p-5 rounded-3xl bg-[#1a1a1a] border border-dark-border shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <img src={req.sender.profile.avatarUrl || `https://ui-avatars.com/api/?name=${req.sender.profile?.name || 'User'}`} className="w-12 h-12 rounded-2xl object-cover border border-dark-border" />
                        <div>
                          <h4 className="font-bold text-white">{req.sender.profile.name}</h4>
                          <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">@{req.sender.profile.username}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleRequest(req.id, 'ACCEPTED')}
                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRequest(req.id, 'REJECTED')}
                        className="flex-1 py-3 bg-[#2a2a2a] text-neutral-400 font-bold rounded-xl hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/20 transition-all active:scale-95"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12 bg-[#1a1a1a]/30 border border-dark-border border-dashed rounded-3xl">
                  <p className="text-neutral-600 font-medium">No incoming requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <UserProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
      />
    </div>
  );
};

export default FindFriends;
