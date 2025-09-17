const { Migration } = require('sutando');

module.exports = class extends Migration {
  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.createTable('student_violations', (table) => {
      table.increments()
      table.integer('student_x_user_id')
      table.integer('author_x_user_id')
      table.integer('rule_school_id').unsigned().index().references('id').inTable('rule_schools').onDelete('SET NULL')
      table.string('rule')
      table.integer('point')
      table.text('note')
      table.timestamp('date')

      table.timestamps(true, true)
    });
  }

  /**
    * Reverse the migrations.
    */
  async down(schema) {
    await schema.dropTableIfExists('student_violations');
  }
};