import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import { initiateSocketConnection, disconnectSocket, subscribeToMessages } from '../services/socket';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { fetchConversations, addMessage, setCurrentConversation, clearMessages } = useChatStore();
  
  // Notification Sound
  const playNotificationSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    audio.play().catch(e => console.log('Autoplay blocked or audio failed'));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setCurrentConversation(null);
        clearMessages();
      }
    };
    window.addEventListener('keydown', handleEsc);

    // Request Notification Permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => window.removeEventListener('keydown', handleEsc);
  }, [setCurrentConversation, clearMessages]);

  useEffect(() => {
    if (user) {
      initiateSocketConnection(user.id);
      fetchConversations();

      subscribeToMessages((err, message) => {
        if (err) return;
        
        const state = useChatStore.getState();
        const isFromMe = message.senderId === user.id;

        // Play sound and show notification only for messages FROM OTHERS
        if (!isFromMe) {
          playNotificationSound();

          // Show browser notification if tab is hidden OR it's not the current active chat
          const shouldNotify = document.hidden || state.currentConversation?.id !== message.conversationId;
          
          if (shouldNotify && Notification.permission === 'granted') {
            const senderName = message.sender?.profile?.name || 'New Message';
            new Notification(senderName, {
              body: message.type === 'TEXT' ? message.content : `Sent a ${message.type.toLowerCase()}`,
              icon: message.sender?.profile?.avatarUrl || '/logo192.png'
            });
          }
        }

        if (state.currentConversation?.id === message.conversationId) {
          addMessage(message);
        }
        fetchConversations(); // Update sidebar preview
      });

      subscribeToStatus((data) => {
        const { setOnlineUsers } = useChatStore.getState();
        const currentOnlineUsers = useChatStore.getState().onlineUsers;

        if (data.type === 'online_users') {
          setOnlineUsers(data.users);
        } else if (data.type === 'user_online') {
          if (!currentOnlineUsers.includes(data.userId)) {
            setOnlineUsers([...currentOnlineUsers, data.userId]);
          }
        } else if (data.type === 'user_offline') {
          setOnlineUsers(currentOnlineUsers.filter(id => id !== data.userId));
        }
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [user, fetchConversations, addMessage]);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Sidebar - fixed width on desktop */}
      <Sidebar />

      {/* Main Chat Area */}
      <ChatWindow />
    </div>
  );
};

export default Dashboard;
