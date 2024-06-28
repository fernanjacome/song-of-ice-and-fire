import express from 'express';
import cors from 'cors';
import booksRoutes from './routes/booksRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import authMiddleware from './middlewares/authMiddleware.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/books', authMiddleware, booksRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
