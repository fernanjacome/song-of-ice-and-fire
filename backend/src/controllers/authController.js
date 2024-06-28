import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByUsername, createUser } from '../services/userService.js';

const secretKey = 'your_secret_key'; // Cambia esto por una clave secreta segura

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        // Llama a una función para crear un nuevo usuario en tu base de datos
        await createUser(username, hashedPassword);
        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
