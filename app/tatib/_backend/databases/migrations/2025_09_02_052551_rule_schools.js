const { Migration } = require('sutando');

module.exports = class extends Migration {
  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.createTable('rule_schools', (table) => {
      table.increments()
      table.string('rule')
      table.string('point')
      table.timestamps(true, true)
    });
  }

  /**
    * Reverse the migrations.
    */
  async down(schema) {
    await schema.dropTableIfExists('rule_schools');
  }
};