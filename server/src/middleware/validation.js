import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    });
  }
};

// --- Schemas ---

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  })
});

export const friendRequestSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid('Invalid user ID'),
  })
});

export const handleRequestSchema = z.object({
  body: z.object({
    requestId: z.string().uuid('Invalid request ID'),
    status: z.enum(['ACCEPTED', 'REJECTED']),
  })
});

export const startConversationSchema = z.object({
  body: z.object({
    participantId: z.string().uuid('Invalid participant ID'),
  })
});
