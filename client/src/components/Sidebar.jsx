import React, { useState, useEffect } from 'react';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import { Search, MessageSquare, Users, Edit3, MoreVertical, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { 
    conversations, 
    friends, 
    fetchConversations, 
    fetchFriends, 
    fetchMessages, 
    startConversation,
    onlineUsers,
    currentConversation 
  } = useChatStore();
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'friends'

  useEffect(() => {
    fetchConversations();
    fetchFriends();
  }, [fetchConversations, fetchFriends]);

  const handleStartChat = async (friendId) => {
    await startConversation(friendId);
    setActiveTab('chats');
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherMember = conv.members?.find((p) => p.user.id !== user?.id);
    return otherMember?.user.profile.name.toLowerCase().includes(search.toLowerCase());
  });

  const filteredFriends = friends.filter((friend) => 
    friend.profile.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-96 flex flex-col border-r border-dark-border bg-[#0f0f0f]/60 backdrop-blur-xl">
      {/* Sidebar Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/10 border border-white/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Nexus
            </h1>
            <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">Pro</div>
          </div>
          <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-neutral-400 hover:text-white border border-transparent hover:border-white/10">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search conversations..."
            className="input pl-11 py-3 bg-[#1a1a1a]/50 border-dark-border text-sm placeholder:text-neutral-600 focus:bg-[#1a1a1a]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-[#1a1a1a]/50 border border-dark-border rounded-2xl mb-2">
          <button 
            onClick={() => setActiveTab('chats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'chats' ? 'bg-[#1a1a1a] text-primary shadow-xl border border-dark-border' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <MessageSquare className="w-4 h-4" /> Chats
          </button>
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'friends' ? 'bg-[#1a1a1a] text-primary shadow-xl border border-dark-border' : 'text-neutral-500 hover:text-neutral-300'}`}
          >
            <Users className="w-4 h-4" /> Friends
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 md:pb-6 space-y-1 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'chats' ? (
            <motion.div
              key="chats"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5"
            >
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => {
                  const otherMember = conv.members?.find((p) => p.user.id !== user?.id);
                  const isSelected = currentConversation?.id === conv.id;
                  const isOnline = otherMember ? onlineUsers.includes(otherMember.user?.id) : false;
                  
                  return (
                    <button
                      key={conv.id}
                      onClick={() => fetchMessages(conv.id)}
                      className={`w-full p-3.5 rounded-2xl flex items-center gap-4 transition-all group ${isSelected ? 'bg-primary/5 border border-primary/20 shadow-lg' : 'hover:bg-neutral-800/50 border border-transparent hover:border-dark-border'}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img 
                          src={otherMember.user.profile.avatarUrl || `https://ui-avatars.com/api/?name=${otherMember.user.profile.name}`} 
                          className="w-12 h-12 rounded-2xl object-cover shadow-md" 
                        />
                        {isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-[3px] border-[#0f0f0f] rounded-full shadow-lg"></div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className={`truncate text-[14px] ${isSelected ? 'text-primary font-bold' : (conv.unreadCount > 0 ? 'text-white font-black' : 'text-[#f5f5f5] font-bold')}`}>
                            {otherMember?.user.profile.name || 'Unknown'}
                          </h4>
                          <span className={`text-[10px] ${conv.unreadCount > 0 ? 'text-primary font-bold' : 'text-neutral-500 font-bold'}`}>
                            {conv.messages?.[0] ? new Date(conv.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <p className={`text-xs truncate flex-1 ${isSelected ? 'text-primary/70 font-medium' : (conv.unreadCount > 0 ? 'text-neutral-200 font-bold' : 'text-neutral-500 font-medium')}`}>
                            {conv.messages?.[0] ? conv.messages[0].content : 'No messages yet...'}
                          </p>
                          {conv.unreadCount > 0 && (
                            <div className="min-w-[18px] h-[18px] bg-primary rounded-full flex items-center justify-center px-1 animate-in zoom-in duration-300">
                              <span className="text-[10px] font-black text-white">{conv.unreadCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center pt-20 text-center px-6">
                  <div className="w-16 h-16 rounded-3xl bg-neutral-900 flex items-center justify-center mb-4 text-neutral-600 border border-dark-border">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <p className="text-neutral-500 text-sm font-medium">No active chats yet</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-1.5"
            >
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend) => {
                  const isOnline = onlineUsers.includes(friend.id);
                  return (
                    <div
                      key={friend.id}
                      className="w-full p-3.5 rounded-2xl flex items-center justify-between transition-all border border-transparent hover:bg-neutral-800/50 hover:border-dark-border group"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="relative">
                          <img 
                            src={friend.profile.avatarUrl || `https://ui-avatars.com/api/?name=${friend.profile.name}`} 
                            className="w-12 h-12 rounded-2xl object-cover shadow-md" 
                          />
                          {isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-[3px] border-[#0f0f0f] rounded-full shadow-lg"></div>
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-[#f5f5f5] text-[14px] truncate">{friend.profile.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-neutral-600'}`}></span>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleStartChat(friend.id)}
                        className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white shadow-lg shadow-primary/10"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center pt-20 text-center px-6">
                  <div className="w-16 h-16 rounded-3xl bg-neutral-900 flex items-center justify-center mb-4 text-neutral-600 border border-dark-border">
                    <Users className="w-8 h-8" />
                  </div>
                  <p className="text-neutral-500 text-sm font-medium">Your friend list is empty</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;
