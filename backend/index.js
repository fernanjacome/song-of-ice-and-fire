import express from 'express';
import sql from 'mssql';
import cors from 'cors';

const app = express();
const port = 8000;

// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from this origin
    credentials: true  // Enable credentials (cookies, authorization headers) across domains
}));

app.use(express.json()); // Middleware para manejar JSON



// Configuración de la base de datos
const dbConfig = {
    user: 'admin',
    password: '12345',
    server: 'localhost',
    database: 'test',
    options: {
        trustedConnection: false, // Usar conexión de confianza (autenticación de Windows)
        encrypt: false, // Habilitar la encriptación si es necesaria
        trustServerCertificate: true, // Solo si confías en el certificado del servidor
        enableArithAbort: true, // Habilitar arithabort (recomendado para evitar problemas de rendimiento)
    },
    port: 1433, // Puerto configurado para SQL Server
};

// Función para conectar a la base de datos
async function connectToDatabase() {
    try {
        await sql.connect(dbConfig);
        console.log('Conectado a la base de datos');
    } catch (err) {
        console.error('Error conectando a la base de datos:', err);
    }
}

// Conectar a la base de datos
connectToDatabase();


// Ruta para obtener libros
app.get('/books', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM dbo.books');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/books', async (req, res) => {
    const { title, descr, cover, price } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('title', sql.NVarChar(255), title)
            .input('descr', sql.NVarChar(255), descr)
            .input('cover', sql.NVarChar(sql.MAX), cover)
            .input('price', sql.Int, price)
            .query(`
                INSERT INTO dbo.books (title, descr, cover, price)
                OUTPUT INSERTED.id
                VALUES (@title, @descr, @cover, @price)
            `);
        
        const insertedId = result.recordset[0].id; // Usar OUTPUT INSERTED.id
        res.status(201).json({ id: insertedId, title, descr, cover, message: 'Libro agregado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete("/books/:id", async (req, res) => {
    const bookId = req.params.id;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, bookId)
            .query('DELETE FROM dbo.books WHERE id = @id');

        if (result.rowsAffected[0] === 1) {
            res.json({ message: 'Libro eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/books/:id", async (req, res) => {
    const bookId = req.params.id;
    const { title, descr, cover, price } = req.body;

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, bookId)
            .input('title', sql.NVarChar(255), title)
            .input('descr', sql.NVarChar(255), descr)
            .input('cover', sql.NVarChar(sql.MAX), cover)
            .input('price', sql.Int, price)
            .query('UPDATE dbo.books SET title = @title, descr = @descr, cover = @cover, price = @price WHERE id = @id');

        if (result.rowsAffected[0] === 1) {
            res.json({ message: 'Libro actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
