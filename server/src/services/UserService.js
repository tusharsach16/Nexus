import userRepository from '../repositories/UserRepository.js';
import friendRepository from '../repositories/FriendRepository.js';

class UserService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    
    // Fetch profile separately as findById in base repo doesn't include it
    return await userRepository.findByEmail(user.email);
  }

  async updateProfile(userId, profileData) {
    return await userRepository.updateProfile(userId, profileData);
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
