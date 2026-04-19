import express from 'express';
import chatController from '../controllers/ChatController.js';
import { protect } from '../middleware/auth.js';

import { validate, startConversationSchema } from '../middleware/validation.js';
import { singleFile } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', chatController.getConversations.bind(chatController));
router.get('/messages/:conversationId', chatController.getMessages.bind(chatController));
router.post('/conversation', validate(startConversationSchema), chatController.createDirectConversation.bind(chatController));
router.post('/conversation/group', chatController.createGroup.bind(chatController));
router.post('/messages/:conversationId/seen', chatController.markAsSeen.bind(chatController));
router.post('/upload', singleFile('file'), chatController.uploadFile.bind(chatController));

export default router;
