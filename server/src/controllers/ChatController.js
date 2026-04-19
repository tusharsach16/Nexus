import chatService from '../services/ChatService.js';
import storageService from '../services/StorageService.js';
import fs from 'fs';

class ChatController {
  async getConversations(req, res, next) {
    try {
      const conversations = await chatService.getConversations(req.user.id);
      res.status(200).json({ success: true, conversations });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { conversationId } = req.params;
      const { skip, take } = req.query;
      const messages = await chatService.getMessages(
        conversationId, 
        skip ? parseInt(skip) : 0, 
        take ? parseInt(take) : 50
      );
      res.status(200).json({ success: true, messages });
    } catch (error) {
      next(error);
    }
  }

  async createDirectConversation(req, res, next) {
    try {
      const { participantId } = req.body;
      const conversation = await chatService.getOrCreateDirectConversation(req.user.id, participantId);
      res.status(200).json({ success: true, conversation });
    } catch (error) {
      next(error);
    }
  }

  async createGroup(req, res, next) {
    try {
      const { name, members } = req.body; // members is array of userIds
      const conversation = await chatService.createGroup(name, req.user.id, members);
      res.status(201).json({ success: true, conversation });
    } catch (error) {
      next(error);
    }
  }

  async markAsSeen(req, res, next) {
    try {
      const { conversationId } = req.params;
      await chatService.markAsSeen(conversationId, req.user.id);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        throw { statusCode: 400, message: 'No file uploaded' };
      }

      const fileDetails = await storageService.uploadFile(req.file);
      
      // Clean up temp file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(200).json({ 
        success: true, 
        file: fileDetails 
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
