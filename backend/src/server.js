import app from './app.js';

const port = 8000;

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
