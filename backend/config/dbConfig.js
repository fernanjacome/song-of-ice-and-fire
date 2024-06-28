const dbConfig = {
    user: 'admin',
    password: '12345',
    server: 'localhost',
    database: 'test',
    options: {
        trustedConnection: false,
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    port: 1433,
};

export default dbConfig;
