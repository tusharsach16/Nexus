import { create } from 'zustand';
import api from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  friends: [],
  currentConversation: null,
  messages: [],
  onlineUsers: [],
  loading: false,

  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  fetchConversations: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get('/chat/conversations');
      set({ conversations: data.conversations, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  fetchFriends: async () => {
    try {
      const { data } = await api.get('/user/friends');
      set({ friends: data.friends });
    } catch (error) {
      console.error('Failed to fetch friends');
    }
  },

  startConversation: async (friendId) => {
    try {
      set({ loading: true });
      const { data } = await api.post('/chat/conversation', { participantId: friendId });
      
      // Refresh conversations list to include new one if created
      const convData = await api.get('/chat/conversations');
      set({ conversations: convData.data.conversations });
      
      // Set the newly created/found conversation as current
      const conversation = convData.data.conversations.find(c => c.id === data.conversation.id);
      set({ currentConversation: conversation, loading: false });
      
      return data.conversation.id;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const { data } = await api.get(`/chat/messages/${conversationId}`);
      set({ messages: data.messages.reverse() }); 
      
      const conv = get().conversations.find(c => c.id === conversationId);
      set({ currentConversation: conv });

      // If there were unread messages, mark them as seen
      if (conv && conv.unreadCount > 0) {
        await api.post(`/chat/messages/${conversationId}/seen`);
        set((state) => ({
          conversations: state.conversations.map(c => 
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          )
        }));
      }
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  },

  addMessage: (message) => {
    set((state) => {
      // 1. Update the messages buffer if this is the active conversation
      let newMessages = [...state.messages];
      const isCurrentChat = state.currentConversation?.id === message.conversationId;
      
      if (isCurrentChat) {
        // Check for optimistic message replacement
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg?.id?.startsWith('temp-') && lastMsg.content === message.content) {
          newMessages[newMessages.length - 1] = message;
        } else if (!newMessages.some(m => m.id === message.id)) {
          newMessages.push(message);
          // If we're looking at the chat, mark as seen immediately (API call)
          api.post(`/chat/messages/${message.conversationId}/seen`);
        }
      }

      // 2. Update the conversations list for sorting and unread counts
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === message.conversationId) {
          const isNewUnread = !isCurrentChat;
          return {
            ...conv,
            messages: [message], // Update sidebar preview
            unreadCount: isNewUnread ? (conv.unreadCount || 0) + 1 : 0,
            updatedAt: message.createdAt
          };
        }
        return conv;
      });

      // 3. Sort conversations so latest active one is at the top (WhatsApp style)
      updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return { 
        messages: isCurrentChat ? newMessages : state.messages,
        conversations: updatedConversations
      };
    });
  },

  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),

  clearMessages: () => set({ messages: [] })
}));

export default useChatStore;
