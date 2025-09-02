const { Migration } = require('sutando');

module.exports = class extends Migration {
  serverName = 'datainduk_remote_server';
  schemaName = 'datainduk_remote_schema';

  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.raw(`
      CREATE EXTENSION IF NOT EXISTS postgres_fdw;

      DROP SERVER IF EXISTS ${this.serverName} CASCADE;
      CREATE SERVER IF NOT EXISTS ${this.serverName}
      FOREIGN DATA WRAPPER postgres_fdw
      OPTIONS (host '${process.env.DATAINDUK_DB_HOST ?? '127.0.0.1'}', port '${process.env.DATAINDUK_DB_PORT ?? '5432'}', dbname '${process.env.DATAINDUK_DB_DATABASE ?? 'datainduk'}');

      DROP USER MAPPING IF EXISTS FOR ${process.env.DATAINDUK_DB_USERNAME ?? 'postgres'} SERVER ${this.serverName};
      CREATE USER MAPPING IF NOT EXISTS FOR ${process.env.DATAINDUK_DB_USERNAME ?? 'postgres'}
      SERVER ${this.serverName}
      OPTIONS (user '${process.env.DATAINDUK_DB_USERNAME ?? 'postgres'}', password '${process.env.DATAINDUK_DB_PASSWORD ?? ''}');

      DROP SCHEMA IF EXISTS ${this.schemaName} CASCADE;
      CREATE SCHEMA IF NOT EXISTS ${this.schemaName};

      IMPORT FOREIGN SCHEMA public
      FROM SERVER ${this.serverName}
      INTO ${this.schemaName};      
    `)
  }

  /**
    * Reverse the migrations.
    */
  async down(schema) {
    schema.raw(`
      DROP SCHEMA IF EXISTS ${this.schemaName} CASCADE;

      DROP USER MAPPING IF EXISTS FOR postgres SERVER ${this.serverName};

      DROP SERVER IF EXISTS ${this.serverName} CASCADE;      
    `)
  }
};