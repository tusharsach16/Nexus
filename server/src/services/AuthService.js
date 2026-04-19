import bcrypt from 'bcryptjs';
import userRepository from '../repositories/UserRepository.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

class AuthService {
  async register(userData) {
    const { email, password, name, username } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw { statusCode: 400, message: 'Email already registered' };
    }

    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw { statusCode: 400, message: 'Username already taken' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile
    const user = await userRepository.createWithProfile(
      { email, password: hashedPassword },
      { name, username }
    );

    return this.generateAuthResponse(user);
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    return this.generateAuthResponse(user);
  }

  async refresh(refreshToken) {
    const tokenDoc = await userRepository.findRefreshToken(refreshToken);
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw { statusCode: 401, message: 'Invalid or expired refresh token' };
    }

    const user = await userRepository.findById(tokenDoc.userId);
    if (!user) {
      throw { statusCode: 401, message: 'User not found' };
    }

    // Generate new access token
    const accessToken = generateAccessToken({ id: user.id, email: user.email });

    return { accessToken };
  }

  async logout(refreshToken) {
    await userRepository.deleteRefreshToken(refreshToken);
  }

  async generateAuthResponse(user) {
    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await userRepository.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile
      },
      accessToken,
      refreshToken
    };
  }
}

export default new AuthService();
