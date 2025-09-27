if (!process.env.NEXT_PUBLIC_PRIMARY_APP_MODULE) require("dotenv").config();

const connections = {
  datainduk: {
    client: 'pg',
    connection: {
      host: process.env.DATAINDUK_DB_HOST,
      port: Number(process.env.DATAINDUK_DB_PORT),
      user: process.env.DATAINDUK_DB_USERNAME,
      password: process.env.DATAINDUK_DB_PASSWORD,
      database: process.env.DATAINDUK_DB_DATABASE,
    },
  },
  tatib: {
    client: 'pg',
    connection: {
      host: process.env.TATIB_DB_HOST,
      port: Number(process.env.TATIB_DB_PORT),
      user: process.env.TATIB_DB_USERNAME,
      password: process.env.TATIB_DB_PASSWORD,
      database: process.env.TATIB_DB_DATABASE,
    },
  },
  absensi: {
    client: 'pg',
    connection: {
      host: process.env.ABSENSI_DB_HOST,
      port: Number(process.env.ABSENSI_DB_PORT),
      user: process.env.ABSENSI_DB_USERNAME,
      password: process.env.ABSENSI_DB_PASSWORD,
      database: process.env.ABSENSI_DB_DATABASE,
    },
  },
};

module.exports = {
  ...connections[process.env.NEXT_PUBLIC_PRIMARY_APP_MODULE ?? 'datainduk'], // <-- for CLI migration & seeder
  connections, // <-- for app multiple connection
  migrations: {
    table: 'migrations',
    path: `./app/${process.env.NEXT_PUBLIC_PRIMARY_APP_MODULE ?? 'datainduk'}/_backend/databases/migrations`
  },
  models: {
    path: `./app/${process.env.NEXT_PUBLIC_PRIMARY_APP_MODULE ?? 'datainduk'}/_backend/models`,
  }
};