import BaseRepository from './BaseRepository.js';
import prisma from '../config/db.js';

class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
  }

  async findByUsername(username) {
    return await prisma.user.findFirst({
      where: {
        profile: {
          username
        }
      },
      include: { profile: true }
    });
  }

  async createWithProfile(userData, profileData) {
    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: profileData
        }
      },
      include: { profile: true }
    });
  }

  async updateProfile(userId, profileData) {
    return await prisma.profile.update({
      where: { userId },
      data: profileData
    });
  }

  async saveRefreshToken(userId, token, expiresAt) {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });
  }

  async findRefreshToken(token) {
    return await prisma.refreshToken.findUnique({
      where: { token }
    });
  }

  async deleteRefreshToken(token) {
    return await prisma.refreshToken.delete({
      where: { token }
    });
  }
}

export default new UserRepository();
