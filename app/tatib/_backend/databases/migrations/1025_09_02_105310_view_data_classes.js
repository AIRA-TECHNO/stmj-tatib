const { Migration } = require('sutando');

module.exports = class extends Migration {
  tableName = 'view_data_classes';

  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.raw(`
        CREATE FOREIGN TABLE ${this.tableName} (
          school_year int4,
          faculty_id int8,
          faculty_name varchar(255),
          faculty_full_name text,
          prody_id int8,
          prody_name varchar(255),
          prody_full_name text,
          expertise_id int8,
          expertise_name varchar(255),
          expertise_short_name varchar(255),
          expertise_long_year_study int4,
          expertise_full_name text,
          class_id int8,
          teacher_x_user_id int8,
          class_level int4,
          class_roman_level varchar(255),
          class_alphabet varchar(255),
          class_full_name text
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