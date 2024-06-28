import sql from 'mssql';
import dbConfig from '../../config/dbConfig.js';

const poolPromise = sql.connect(dbConfig);

export const getUserByUsername = async (username) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('username', sql.NVarChar(255), username)
        .query('SELECT * FROM dbo.users WHERE username = @username');
    return result.recordset[0];
};

export const createUser = async (username, hashedPassword) => {
    const pool = await poolPromise;
    try {
        const result = await pool.request()
            .input('username', sql.NVarChar(255), username)
            .input('password', sql.NVarChar(255), hashedPassword)
            .query('INSERT INTO dbo.users (username, password) VALUES (@username, @password)');
        
        // Verificar que la inserción fue exitosa
        if (result.rowsAffected && result.rowsAffected[0] === 1) {
            console.log(`Usuario '${username}' insertado correctamente`);
            return { message: `Usuario '${username}' registrado correctamente` };
        } else {
            throw new Error('No se pudo insertar el usuario');
        }
    } catch (err) {
        throw new Error(err.message);
    }
};
