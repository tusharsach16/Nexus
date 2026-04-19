import userService from '../services/UserService.js';
import storageService from '../services/StorageService.js';
import fs from 'fs';

class UserController {
  async getProfile(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.id);
      res.status(200).json({ success: true, profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      // Whitelist only allowed fields to prevent Prisma crashes from extra data
      const allowedFields = ['name', 'username', 'bio'];
      const profileData = {};
      
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          profileData[field] = req.body[field];
        }
      });
      
      if (req.file) {
        try {
          // Handle avatar upload
          const userWithProfile = await userService.getProfile(req.user.id);
          const oldPublicId = userWithProfile.profile?.avatarPublicId;
          
          const { url, publicId } = await storageService.uploadFile(req.file, 'chat-app/avatars');
          profileData.avatarUrl = url;
          profileData.avatarPublicId = publicId;
          
          // Delete old image if it exists
          if (oldPublicId) {
            await storageService.deleteFile(oldPublicId).catch(err => 
              console.warn('Failed to delete old avatar:', err.message)
            );
          }
        } finally {
          // Robust temp file removal
          if (fs.existsSync(req.file.path)) {
            try {
              fs.unlinkSync(req.file.path);
            } catch (fsErr) {
              console.warn('Could not remove temp file:', fsErr.message);
            }
          }
        }
      }

      const updatedProfile = await userService.updateProfile(req.user.id, profileData);
      res.status(200).json({ success: true, profile: updatedProfile });
    } catch (error) {
      next(error);
    }
  }

  async sendFriendRequest(req, res, next) {
    try {
      const { receiverId } = req.body;
      const request = await userService.sendFriendRequest(req.user.id, receiverId);
      res.status(201).json({ success: true, request });
    } catch (error) {
      next(error);
    }
  }

  async handleFriendRequest(req, res, next) {
    try {
      const { requestId, status } = req.body; // status: 'ACCEPTED' or 'REJECTED'
      const result = await userService.handleFriendRequest(requestId, req.user.id, status);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getFriends(req, res, next) {
    try {
      const friends = await userService.getFriends(req.user.id);
      res.status(200).json({ success: true, friends });
    } catch (error) {
      next(error);
    }
  }

  async getFriendRequests(req, res, next) {
    try {
      const requests = await userService.getFriendRequests(req.user.id);
      res.status(200).json({ success: true, requests });
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req, res, next) {
    try {
      const { friendId } = req.params;
      await userService.removeFriend(req.user.id, friendId);
      res.status(200).json({ success: true, message: 'Friend removed successfully' });
    } catch (error) {
      next(error);
    }
  }

  async cancelFriendRequest(req, res, next) {
    try {
      const { receiverId } = req.params;
      await userService.cancelFriendRequest(req.user.id, receiverId);
      res.status(200).json({ success: true, message: 'Friend request cancelled' });
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req, res, next) {
    try {
      const { q } = req.query;
      const users = await userService.searchUsers(q, req.user.id);
      res.status(200).json({ success: true, users });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
