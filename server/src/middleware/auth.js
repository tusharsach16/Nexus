import { verifyAccessToken } from '../utils/jwt.js';
import userRepository from '../repositories/UserRepository.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw { statusCode: 401, message: 'Not authorized, no token' };
    }

    const decoded = verifyAccessToken(token);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw { statusCode: 401, message: 'Not authorized, user not found' };
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};
