import cloudinary from '../config/cloudinary.js';

class StorageService {
  async uploadFile(file, folder = 'chat-app/attachments') {
    try {
      const isImage = file.mimetype.startsWith('image/');
      const options = {
        folder,
        resource_type: 'auto', // Cloudinary will auto-detect if it's image, video or raw file
      };

      // Only add transformations if it's an image
      if (isImage) {
        options.transformation = [{ width: 1200, height: 1200, crop: 'limit' }];
      }

      const result = await cloudinary.uploader.upload(file.path, options);

      return {
        url: result.secure_url,
        publicId: result.public_id,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw { statusCode: 500, message: 'Failed to upload file to cloud' };
    }
  }

  async deleteFile(publicId, resourceType = 'auto') {
    try {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }
  }
}

export default new StorageService();
