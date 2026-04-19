import prisma from '../config/db.js';

class ConversationRepository {
  async findDirectConversation(user1Id, user2Id) {
    return await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { members: { some: { userId: user1Id } } },
          { members: { some: { userId: user2Id } } }
        ]
      },
      include: {
        members: {
          include: {
            user: {
              include: { profile: true }
            }
          }
        },
        messages: {
           orderBy: { createdAt: 'desc' },
           take: 1
        }
      }
    });
  }

  async createDirectConversation(user1Id, user2Id) {
    return await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        members: {
          create: [
            { userId: user1Id },
            { userId: user2Id }
          ]
        }
      },
      include: {
        members: {
          include: {
            user: { include: { profile: true } }
          }
        }
      }
    });
  }

  async findUserConversations(userId) {
    const conversations = await prisma.conversation.findMany({
      where: {
        members: { some: { userId } }
      },
      include: {
        members: {
          include: {
            user: { include: { profile: true } }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Compute unread counts separately due to Prisma _count relation filtering limitations in some environments
    const conversationsWithUnread = await Promise.all(conversations.map(async (conv) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          seenAt: null
        }
      });
      return { ...conv, unreadCount };
    }));

    return conversationsWithUnread;
  }

  async createGroupConversation(name, creatorId, members) {
    return await prisma.conversation.create({
      data: {
        name,
        type: 'GROUP',
        members: {
          create: [
            { userId: creatorId, role: 'ADMIN' },
            ...members.map(userId => ({ userId, role: 'MEMBER' }))
          ]
        }
      },
      include: {
        members: {
          include: {
            user: { include: { profile: true } }
          }
        }
      }
    });
  }

  async updateLastMessage(id, messageId) {
    return await prisma.conversation.update({
      where: { id },
      data: { lastMessageId: messageId }
    });
  }
}

export default new ConversationRepository();
