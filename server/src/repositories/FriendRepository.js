import prisma from '../config/db.js';

class FriendRepository {
  async findRequestById(id) {
    return await prisma.friendRequest.findUnique({
      where: { id }
    });
  }

  async findRequest(senderId, receiverId) {
    return await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId }
      }
    });
  }

  async createRequest(senderId, receiverId) {
    return await prisma.friendRequest.create({
      data: { senderId, receiverId }
    });
  }

  async updateRequestStatus(id, status) {
    return await prisma.friendRequest.update({
      where: { id },
      data: { status }
    });
  }

  async deleteRequest(id) {
    return await prisma.friendRequest.delete({
      where: { id }
    });
  }

  async createFriendship(user1Id, user2Id) {
    // Normalize IDs to ensure user1Id < user2Id
    const [id1, id2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    return await prisma.friendship.create({
      data: { user1Id: id1, user2Id: id2 }
    });
  }

  async deleteFriendship(user1Id, user2Id) {
    const [id1, id2] = user1Id < user2Id ? [user1Id, user2Id] : [user2Id, user1Id];
    
    return await prisma.friendship.deleteMany({
      where: { user1Id: id1, user2Id: id2 }
    });
  }

  async deleteRequestByUsers(user1Id, user2Id) {
    return await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      }
    });
  }

  async getFriends(userId) {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }]
      }
    });

    const friendIds = friendships.map(f => f.user1Id === userId ? f.user2Id : f.user1Id);

    return await prisma.user.findMany({
      where: { id: { in: friendIds } },
      include: { profile: true }
    });
  }

  async getPendingRequests(userId) {
    return await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: { sender: { include: { profile: true } } }
    });
  }

  async getSentRequests(userId) {
    return await prisma.friendRequest.findMany({
      where: { senderId: userId, status: 'PENDING' },
      include: { receiver: { include: { profile: true } } }
    });
  }
}

export default new FriendRepository();
