require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER,           // ✅ from your .env
        password: process.env.DB_PASSWORD,       // ✅ from your .env
        database: process.env.DB_NAME,           // ✅ from your .env
        host: process.env.DB_HOST,               // ✅ from your .env
        port: process.env.DB_PORT,               // ✅ in case it's needed
        dialect: 'postgres',
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
