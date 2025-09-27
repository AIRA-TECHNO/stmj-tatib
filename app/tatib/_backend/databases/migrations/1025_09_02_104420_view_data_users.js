const { Migration } = require('sutando');

module.exports = class extends Migration {
  tableName = 'view_data_users'

  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.raw(`
        CREATE FOREIGN TABLE ${this.tableName} (
          id int8,
          username varchar(255),
          password text,
          profile_type varchar(255),
          created_at int4,
          updated_at int4,
          name varchar(255),
          relation_id int8,
          uuid varchar(255)
        )
        SERVER datainduk_remote_server
        OPTIONS (table_name '${this.tableName}');      
    `)
  }

  /**
    * Reverse the migrations.
    */
  async down(schema) {
    //
  }
};