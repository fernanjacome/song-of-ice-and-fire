import express from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controllers/booksController.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
