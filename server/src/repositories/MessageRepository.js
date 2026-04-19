import prisma from '../config/db.js';

class MessageRepository {
  async create(data) {
    return await prisma.message.create({
      data,
      include: {
        sender: {
          include: { profile: true }
        }
      }
    });
  }

  async findByConversationId(conversationId, skip = 0, take = 50) {
    return await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });
  }

  async markAsSeen(messageId) {
    return await prisma.message.update({
      where: { id: messageId },
      data: { seenAt: new Date() }
    });
  }

  async markConversationAsSeen(conversationId, userId) {
    // Mark all messages in conversation as seen by others except sender
    return await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        seenAt: null
      },
      data: { seenAt: new Date() }
    });
  }
}

export default new MessageRepository();
