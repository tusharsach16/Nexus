import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Info, Smile, Paperclip, MoreVertical, LayoutGrid, Check, CheckCheck, FileText, Download, Play, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import api from '../services/api';
import { format } from 'date-fns';
import UserProfileModal from './UserProfileModal';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const user = useAuthStore((state) => state.user);
  const { currentConversation, messages, onlineUsers } = useChatStore();
  const [content, setContent] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mark conversation as seen when messages change and window is active
  useEffect(() => {
    if (currentConversation && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.senderId !== user?.id && !lastMessage.seenAt) {
        import('../services/socket').then(({ markMessageSeen }) => {
          markMessageSeen({
            conversationId: currentConversation.id,
            messageId: lastMessage.id,
            userId: user?.id
          });
        });
      }
    }
  }, [messages, currentConversation, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!content.trim() || !currentConversation) return;

    const otherMember = currentConversation.members?.find(p => p.user.id !== user?.id);
    
    const messageData = {
      senderId: user?.id,
      conversationId: currentConversation?.id,
      content: content.trim(),
      type: 'TEXT',
      receiverId: otherMember?.user?.id,
      isGroup: currentConversation?.type === 'GROUP'
    };

    // --- Optimistic Update for Zero Latency ---
    const optimisticMsg = {
      ...messageData,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    useChatStore.getState().addMessage(optimisticMsg);
    // ------------------------------------------

    import('../services/socket').then(({ sendMessage }) => {
      sendMessage(messageData);
    });
    setContent('');
    import('../services/socket').then(({ stopTyping }) => {
      stopTyping({ conversationId: currentConversation?.id, userId: user?.id });
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size limit check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post('/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      setUploadProgress(100);

      // Determine message type
      let messageType = 'FILE';
      if (file.type.startsWith('image/')) messageType = 'IMAGE';
      else if (file.type.startsWith('video/')) messageType = 'VIDEO';

      const otherMember = currentConversation.members?.find(p => p.user.id !== user?.id);
      
      const messageData = {
        senderId: user?.id,
        conversationId: currentConversation?.id,
        content: `Sent a ${messageType.toLowerCase()}`,
        type: messageType,
        fileUrl: data.file.url,
        filePublicId: data.file.publicId,
        fileName: data.file.fileName,
        fileSize: data.file.fileSize,
        receiverId: otherMember?.user?.id,
        isGroup: currentConversation?.type === 'GROUP'
      };

      import('../services/socket').then(({ sendMessage }) => {
        sendMessage(messageData);
      });

      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case 'IMAGE':
        return (
          <div className="rounded-2xl overflow-hidden mb-1 group/img relative cursor-pointer">
            <img 
              src={msg.fileUrl} 
              alt="Sent" 
              className="max-w-full max-h-[300px] object-cover hover:scale-[1.02] transition-transform duration-500" 
              onClick={() => window.open(msg.fileUrl, '_blank')}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <ImageIcon className="text-white w-8 h-8 drop-shadow-lg" />
            </div>
          </div>
        );
      case 'VIDEO':
        return (
          <div className="rounded-2xl overflow-hidden mb-1 bg-black/20">
            <video 
              src={msg.fileUrl} 
              controls 
              className="max-w-full max-h-[300px]"
              poster={msg.fileUrl.replace(/\.[^/.]+$/, ".jpg")} // Try to get thumbnail if cloudinary
            />
          </div>
        );
      case 'FILE':
        return (
          <a 
            href={msg.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all mb-1 group/file"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary group-hover/file:bg-primary group-hover/file:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{msg.fileName || 'Document'}</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                {(msg.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
            <Download className="w-4 h-4 text-neutral-500 group-hover/file:text-white" />
          </a>
        );
      default:
        return <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>;
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 bg-[#0f0f0f] relative overflow-hidden">
        {/* Animated Background Decor */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full animate-pulse delay-700"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center z-10"
        >
          <div className="w-24 h-24 bg-[#1a1a1a] border border-dark-border rounded-[32px] flex items-center justify-center mb-8 shadow-2xl">
            <LayoutGrid className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Select a conversation</h2>
          <p className="max-w-xs text-center mt-3 text-neutral-500 leading-relaxed font-medium">
            Choose a friend or group from the sidebar to start messaging.
          </p>
        </motion.div>
      </div>
    );
  }

  const otherUser = currentConversation.members?.find(p => p.user.id !== user?.id)?.user;
  const isOnline = onlineUsers.includes(otherUser?.id);
  const lastSeenStr = otherUser?.profile?.lastSeen 
    ? `Last seen ${format(new Date(otherUser.profile.lastSeen), 'MMM d, HH:mm')}`
    : 'Offline';

  return (
    <div className="flex-1 flex flex-col bg-[#0f0f0f] relative h-full">
      {/* Header */}
      <div className="p-4 px-6 border-b border-dark-border flex items-center justify-between bg-[#0f0f0f]/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => setIsProfileOpen(true)}>
            <img 
              src={otherUser?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${otherUser?.profile?.name}`} 
              alt="User" 
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300"
            />
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-[3px] border-[#1a1a1a] rounded-full shadow-lg"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              {currentConversation.type === 'GROUP' ? currentConversation.name : otherUser?.profile?.name}
              {isOnline && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
            </h3>
            <p className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${isOnline ? 'text-green-500' : 'text-neutral-500'}`}>
              {isOnline ? 'Active Now' : lastSeenStr}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 hover:bg-white/5 rounded-xl text-neutral-400 transition-all active:scale-95 hidden sm:flex border border-transparent hover:border-white/5">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar relative z-10 scroll-smooth bg-[#0f0f0f]">
        <div className="absolute inset-0 bg-grid-white/[0.015] bg-[length:32px_32px] -z-10" />

        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === user?.id;
            const isSeen = msg.seenAt != null;
            const prevMsg = messages[idx - 1];
            const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;

            return (
              <motion.div 
                key={msg.id || idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`flex w-full group ${isMe ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-8' : 'mt-1.5'}`}
              >
                {!isMe && isFirstInGroup && (
                  <img 
                    src={otherUser?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${otherUser?.profile?.name}`} 
                    className="w-8 h-8 rounded-xl mr-3 mt-auto shadow-md"
                    alt="Avatar"
                  />
                )}
                <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} ${!isMe && !isFirstInGroup ? 'ml-11' : ''}`}>
                  <div className={`relative transition-all duration-300 shadow-sm ${
                    msg.type === 'TEXT' ? 'px-5 py-3' : 'p-1'
                  } ${
                    isMe 
                      ? 'bg-primary text-white rounded-[22px] rounded-br-[4px] shadow-lg shadow-primary/10' 
                      : 'bg-[#1a1a1a] border border-dark-border text-[#f5f5f5] rounded-[22px] rounded-bl-[4px] hover:bg-[#222222]'
                  }`}>
                    {renderMessageContent(msg)}
                    
                    <div className={`absolute bottom-[-18px] ${isMe ? 'right-1' : 'left-1'} flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-bold text-neutral-500 uppercase tracking-tighter`}>
                      {format(new Date(msg.createdAt), 'HH:mm')}
                      {isMe && (
                        isSeen 
                          ? <CheckCheck className="w-3.5 h-3.5 text-primary" /> 
                          : <Check className="w-3.5 h-3.5 text-neutral-600" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-8 bg-[#0f0f0f]/80 backdrop-blur-xl border-t border-dark-border z-20">
        <form onSubmit={handleSend} className="flex flex-col gap-4 max-w-5xl mx-auto">
          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex gap-1.5">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-3.5 text-neutral-500 hover:text-white bg-[#1a1a1a] border border-dark-border rounded-2xl transition-all active:scale-95 group disabled:opacity-30"
              >
                <Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button type="button" className="p-3.5 text-neutral-500 hover:text-white bg-[#1a1a1a] border border-dark-border rounded-2xl transition-all active:scale-95 group hidden sm:flex">
                <Smile className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            
            <div className="flex-1 relative group">
              <input 
                type="text" 
                placeholder="Type your message..."
                disabled={isUploading}
                className="w-full bg-[#1a1a1a] border border-dark-border rounded-2xl px-6 py-4 text-white text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-neutral-600 outline-none shadow-inner"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => import('../services/socket').then(({ startTyping }) => startTyping({ conversationId: currentConversation?.id, userId: user?.id }))}
                onBlur={() => import('../services/socket').then(({ stopTyping }) => stopTyping({ conversationId: currentConversation?.id, userId: user?.id }))}
              />
            </div>

            <button 
              type="submit" 
              disabled={!content.trim() || isUploading}
              className="p-4 bg-primary hover:bg-primary-dark rounded-2xl text-white transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={otherUser} 
      />
    </div>
  );
};

export default ChatWindow;
