const { Migration } = require('sutando');

module.exports = class extends Migration {
  tableName = 'school_years';

  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.raw(`
        CREATE FOREIGN TABLE ${this.tableName} (
          id int8,
          year int4,
          is_active bool,
          start_date_semester_1 int4,
          end_date_semester_1 int4,
          start_date_semester_2 int4,
          end_date_semester_2 int4,
          created_at int4,
          updated_at int4,
          date_rapor_signed_semester_1 int4,
          date_rapor_signed_semester_2 int4
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