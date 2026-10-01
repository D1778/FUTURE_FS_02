const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Hosted (e.g. Render Postgres) connection string
  const isPostgres = /^postgres/i.test(process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: isPostgres ? 'postgres' : 'mysql',
    logging: false,
    dialectOptions: isPostgres
      ? { ssl: { require: true, rejectUnauthorized: false }, connectTimeout: 15000 }
      : { connectTimeout: 15000 }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        connectTimeout: 15000
      }
    }
  );
}

module.exports = sequelize;
