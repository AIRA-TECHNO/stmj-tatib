const { Migration } = require('sutando');

module.exports = class extends Migration {
  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.createTable('achievements', (table) => {
      table.increments()
      table.string('achievement')
      table.string('point')
      table.timestamps(true, true)
    });
  }

  /**
    * Reverse the migrations.
    */
  async down(schema) {
    await schema.dropTableIfExists('achievements');
  }
};