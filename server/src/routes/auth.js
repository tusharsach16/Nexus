import express from 'express';
import authController from '../controllers/AuthController.js';

import { validate, registerSchema, loginSchema } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register.bind(authController));
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;
