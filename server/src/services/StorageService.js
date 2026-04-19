import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const isCloudinaryConfigured = () => (
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET)
);

class StorageService {
  async uploadFile(file, folder = 'chat-app/attachments') {
    if (!isCloudinaryConfigured()) {
      throw { statusCode: 503, message: 'Upload service is not configured on the server' };
    }

    if (!file?.path || !fs.existsSync(file.path)) {
      throw { statusCode: 400, message: 'Uploaded file was not saved correctly. Please try again.' };
    }

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
      const statusCode = Number(error?.http_code) || 500;
      const message = error?.message || 'Failed to upload file to cloud';
      throw { statusCode, message };
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
