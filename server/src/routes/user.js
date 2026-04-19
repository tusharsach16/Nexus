import express from 'express';
import userController from '../controllers/UserController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

import { 
  validate, 
  updateProfileSchema, 
  friendRequestSchema, 
  handleRequestSchema 
} from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.get('/profile', userController.getProfile.bind(userController));
router.patch('/profile', upload.single('avatar'), validate(updateProfileSchema), userController.updateProfile.bind(userController));

router.get('/friends', userController.getFriends.bind(userController));
router.get('/requests', userController.getFriendRequests.bind(userController));
router.post('/request', validate(friendRequestSchema), userController.sendFriendRequest.bind(userController));
router.post('/request/handle', validate(handleRequestSchema), userController.handleFriendRequest.bind(userController));
router.delete('/request/:receiverId', userController.cancelFriendRequest.bind(userController));
router.delete('/friend/:friendId', userController.removeFriend.bind(userController));

router.get('/search', userController.searchUsers.bind(userController));

export default router;
