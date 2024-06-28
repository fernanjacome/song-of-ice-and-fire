import { getAllBooks, addBook, editBook, removeBook } from '../services/dbService.js';

export const getBooks = async (req, res) => {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createBook = async (req, res) => {
    const { title, descr, cover, price } = req.body;
    try {
        const newBook = await addBook({ title, descr, cover, price });
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateBook = async (req, res) => {
    const bookId = req.params.id;
    const { title, descr, cover, price } = req.body;
    try {
        const updatedBook = await editBook(bookId, { title, descr, cover, price });
        if (updatedBook) {
            res.json(updatedBook);
        } else {
            res.status(404).json({ error: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        const deleted = await removeBook(bookId);
        if (deleted) {
            res.json({ message: 'Libro eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
