require("dotenv").config();

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  connections: {
    mysql: {
      client: 'mysql2',
      connection: {
        host: 'localhost',
        database: 'another_database',
        user: 'root',
        password: 'password'
      }
    }
  },
  migrations: {
    table: 'migrations',
    path: './app/tatib/_backend/databases/migrations'
  },
  models: {
    path: './app/tatib/_backend/models',
  }
};