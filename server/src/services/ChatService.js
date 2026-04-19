import conversationRepository from '../repositories/ConversationRepository.js';
import messageRepository from '../repositories/MessageRepository.js';

class ChatService {
  async getConversations(userId) {
    return await conversationRepository.findUserConversations(userId);
  }

  async getMessages(conversationId, skip = 0, take = 50) {
    return await messageRepository.findByConversationId(conversationId, skip, take);
  }

  async sendMessage(senderId, conversationId, content, type = 'TEXT', fileData = {}) {
    // 1. Check if conversation exists (optional, could be done via prisma)
    // 2. Create message
    const message = await messageRepository.create({
      senderId,
      conversationId,
      content,
      type,
      ...fileData
    });

    // 3. Update conversation's last message and updatedAt
    await conversationRepository.updateLastMessage(conversationId, message.id);

    return message;
  }

  async getOrCreateDirectConversation(user1Id, user2Id) {
    let conversation = await conversationRepository.findDirectConversation(user1Id, user2Id);
    
    if (!conversation) {
      conversation = await conversationRepository.createDirectConversation(user1Id, user2Id);
    }

    return conversation;
  }

  async createGroup(name, creatorId, members) {
    return await conversationRepository.createGroupConversation(name, creatorId, members);
  }

  async markAsSeen(conversationId, userId) {
    return await messageRepository.markConversationAsSeen(conversationId, userId);
  }
}

export default new ChatService();
