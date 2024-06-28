import sql from 'mssql';
import dbConfig from '../../config/dbConfig.js';

const poolPromise = sql.connect(dbConfig);

export const getAllBooks = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM dbo.books');
    return result.recordset;
};

export const addBook = async ({ title, descr, cover, price }) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('title', sql.NVarChar(255), title)
        .input('descr', sql.NVarChar(255), descr)
        .input('cover', sql.NVarChar(sql.MAX), cover)
        .input('price', sql.Int, price)
        .query('INSERT INTO dbo.books (title, descr, cover, price) OUTPUT INSERTED.id VALUES (@title, @descr, @cover, @price)');
    return { id: result.recordset[0].id, title, descr, cover, price };
};

export const editBook = async (id, { title, descr, cover, price }) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.NVarChar(255), title)
        .input('descr', sql.NVarChar(255), descr)
        .input('cover', sql.NVarChar(sql.MAX), cover)
        .input('price', sql.Int, price)
        .query('UPDATE dbo.books SET title = @title, descr = @descr, cover = @cover, price = @price WHERE id = @id');
    return result.rowsAffected[0] === 1;
};

export const removeBook = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM dbo.books WHERE id = @id');
    return result.rowsAffected[0] === 1;
};
