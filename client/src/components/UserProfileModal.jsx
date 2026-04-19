import React, { useState } from 'react';
import { X, UserPlus, MessageCircle, UserCheck, Mail, AlertCircle, Clock, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../store/useUserStore';
import useChatStore from '../store/useChatStore';
import toast from 'react-hot-toast';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  const { sendRequest, unfriend, cancelRequest, sentRequests, fetchRequests } = useUserStore();
  const { onlineUsers, friends } = useChatStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const isOnline = onlineUsers.includes(user.id);
  const isFriend = friends.some(f => f.id === user.id);
  const isRequested = sentRequests.some(r => r.receiverId === user.id);

  const handleSendRequest = async () => {
    try {
      setIsProcessing(true);
      await sendRequest(user.id);
      toast.success('Friend request sent!');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setIsProcessing(true);
      await cancelRequest(user.id);
      toast.success('Request retracted');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to retract request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnfriend = async () => {
    try {
      setIsRemoving(true);
      await unfriend(user.id);
      toast.success('Connection removed');
      setShowConfirm(false);
    } catch (error) {
      toast.error('Failed to remove connection');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#1a1a1a] shadow-2xl rounded-[32px] overflow-hidden border border-white/10"
          >
            {/* Header / Banner Wrap */}
            <div className="h-40 bg-gradient-to-br from-indigo-600/20 via-indigo-600/5 to-transparent relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-xl backdrop-blur-md transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="px-8 pb-10 -mt-20 relative z-10">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-[40px] opacity-100" />
                  <img 
                    src={user.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${user.profile?.name || 'User'}`} 
                    className="w-40 h-40 rounded-[44px] object-cover ring-8 ring-[#1a1a1a] shadow-2xl relative z-10"
                    alt={user.profile?.name}
                  />
                </div>

                <div className="mt-6 text-center">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{user.profile?.name}</h2>
                  <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-1.5">@{user.profile?.username}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                  <div className="p-4 bg-[#0f0f0f] rounded-2xl border border-white/5 text-center group hover:bg-[#1a1a1a] transition-all">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Joined</div>
                    <div className="text-sm font-bold text-white">
                      {new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-4 bg-[#0f0f0f] rounded-2xl border border-white/5 text-center group hover:bg-[#1a1a1a] transition-all">
                    <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Status</div>
                    <div className="flex items-center justify-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
                       <span className="text-sm font-bold text-white">
                         {isFriend ? 'Connected' : isRequested ? 'Requested' : 'Verified'}
                       </span>
                    </div>
                  </div>
                </div>

                {user.profile?.bio && (
                  <div className="w-full mt-8 p-6 bg-[#0f0f0f] rounded-3xl border border-white/5 relative">
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-[#1a1a1a] border border-white/5 rounded-full text-[10px] font-bold text-neutral-500 uppercase tracking-widest">About</div>
                    <p className="text-sm text-neutral-400 text-center leading-relaxed font-medium pt-2">
                      "{user.profile.bio}"
                    </p>
                  </div>
                )}

                <div className="w-full mt-10 flex flex-col gap-3">
                  <AnimatePresence mode="wait">
                    {!showConfirm ? (
                      <motion.div 
                        key="actions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex gap-3 w-full"
                      >
                        {isFriend ? (
                          <button 
                            onClick={() => setShowConfirm(true)}
                            className="flex-1 py-4.5 bg-[#2a2a2a] text-neutral-300 font-bold rounded-2xl hover:bg-neutral-800 border border-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                          >
                            <UserCheck className="w-5 h-5 text-indigo-400" /> Friends
                          </button>
                        ) : isRequested ? (
                          <button 
                            onClick={handleCancelRequest}
                            disabled={isProcessing}
                            className="flex-1 py-4.5 bg-red-500/10 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white border border-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                          >
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Clock className="w-5 h-5 group-hover:hidden" />
                                <UserMinus className="w-5 h-5 hidden group-hover:block" />
                                <span>{isProcessing ? 'Wait...' : 'Cancel req'}</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={handleSendRequest}
                            disabled={isProcessing}
                            className="flex-1 py-4.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                          >
                            {isProcessing ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <UserPlus className="w-5 h-5" />
                                <span>Connect</span>
                              </>
                            )}
                          </button>
                        )}
                        <button className="p-4.5 bg-[#1a1a1a] text-neutral-400 hover:text-white rounded-2xl border border-white/5 transition-all active:scale-[0.98]">
                          <Mail className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="confirm"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-4"
                      >
                        <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                          <AlertCircle className="w-5 h-5" />
                          Remove connection?
                        </div>
                        <div className="flex gap-3 w-full">
                          <button 
                            onClick={handleUnfriend}
                            disabled={isRemoving}
                            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center justify-center"
                          >
                            {isRemoving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Yes, Remove'}
                          </button>
                          <button 
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-3 bg-neutral-800 text-neutral-300 font-bold rounded-xl hover:bg-neutral-700 transition-all"
                          >
                            No, Keep
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;
