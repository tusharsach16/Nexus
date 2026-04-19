import userRepository from '../repositories/UserRepository.js';
import friendRepository from '../repositories/FriendRepository.js';

class UserService {
  async updateLastSeen(userId) {
    if (!userId) return;
    try {
      await userRepository.updateProfile(userId, { 
        lastSeen: new Date(),
        isOnline: false 
      });
    } catch (error) {
      console.warn(`Could not update lastSeen for user ${userId}:`, error.message);
    }
  }

  async getProfile(userId) {
    if (!userId) {
      const err = new Error('User ID is required');
      err.statusCode = 400;
      throw err;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    
    // Fetch user with profile included
    const userWithProfile = await userRepository.findByEmail(user.email);
    if (!userWithProfile) {
      const err = new Error('Profile not found');
      err.statusCode = 404;
      throw err;
    }

    return userWithProfile;
  }

  async updateProfile(userId, profileData) {
    try {
      return await userRepository.updateProfile(userId, profileData);
    } catch (error) {
      if (error.code === 'P2002') {
        const err = new Error('Username is already taken');
        err.statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  async sendFriendRequest(senderId, receiverId) {
    if (senderId === receiverId) {
      throw { statusCode: 400, message: 'You cannot send a request to yourself' };
    }

    const existingRequest = await friendRepository.findRequest(senderId, receiverId);
    if (existingRequest) {
      throw { statusCode: 400, message: 'Request already sent' };
    }

    // Check if they are already friends (reverse check not needed if normalized)
    const friends = await friendRepository.getFriends(senderId);
    if (friends.some(f => f.id === receiverId)) {
      throw { statusCode: 400, message: 'You are already friends' };
    }

    return await friendRepository.createRequest(senderId, receiverId);
  }

  async handleFriendRequest(requestId, userId, status) {
    const request = await friendRepository.findRequestById(requestId);
    if (!request || request.receiverId !== userId) {
      throw { statusCode: 404, message: 'Request not found' };
    }

    if (status === 'ACCEPTED') {
      await friendRepository.updateRequestStatus(requestId, 'ACCEPTED');
      await friendRepository.createFriendship(request.senderId, request.receiverId);
    } else {
      await friendRepository.updateRequestStatus(requestId, 'REJECTED');
    }

    return { success: true };
  }

  async getFriends(userId) {
    return await friendRepository.getFriends(userId);
  }

  async getFriendRequests(userId) {
    const pending = await friendRepository.getPendingRequests(userId);
    const sent = await friendRepository.getSentRequests(userId);
    return { pending, sent };
  }

  async removeFriend(userId, friendId) {
    await friendRepository.deleteFriendship(userId, friendId);
    await friendRepository.deleteRequestByUsers(userId, friendId);
    return { success: true };
  }

  async cancelFriendRequest(senderId, receiverId) {
    const request = await friendRepository.findRequest(senderId, receiverId);
    if (!request) {
      throw { statusCode: 404, message: 'Friend request not found' };
    }
    await friendRepository.deleteRequest(request.id);
    return { success: true };
  }

  async searchUsers(query, currentUserId) {
    // Basic search by username or name
    return await userRepository.findAll({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            profile: {
              OR: [
                { username: { contains: query, mode: 'insensitive' } },
                { name: { contains: query, mode: 'insensitive' } }
              ]
            }
          }
        ]
      },
      include: { profile: true }
    });
  }
}

export default new UserService();
