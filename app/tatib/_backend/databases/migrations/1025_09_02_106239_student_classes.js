const { Migration } = require('sutando');

module.exports = class extends Migration {
  tableName = 'student_classes';
  
  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.raw(`
        CREATE FOREIGN TABLE ${this.tableName} (
          id int8,
          student_x_user_id int8,
          class_id int8,
          created_at int4,
          updated_at int4,
          rapor_note_semester_1 text,
          rapor_note_semester_2 text,
          status varchar(255),
          drop_out_at int8
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