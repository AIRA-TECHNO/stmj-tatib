const { Migration } = require('sutando');

module.exports = class extends Migration {
  /**
    * Run the migrations.
    */
  async up(schema) {
    await schema.createTable('users', (table) => {
      table.increments()
      table.string('name')
      table.string('email')
      table.string('password')
      table.timestamps(true, true)
    });
  }

  /**
    * Reverse the migrations.
    */
  async down(schema) {
    await schema.dropTableIfExists('users')
  }
};