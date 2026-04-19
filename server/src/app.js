import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

// Base Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    if (statusCode === 500) {
        console.error('SERVER ERROR [500]:', {
          message: err.message,
          stack: err.stack,
          url: req.originalUrl,
          method: req.method,
          body: req.body,
          user: req.user?.id
        });
    } else {
        console.warn(`Auth/Validation Warning (${statusCode}):`, message);
    }

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'An internal server error occurred' : message,
        errors: err.errors || []
    });
});

export default app;
