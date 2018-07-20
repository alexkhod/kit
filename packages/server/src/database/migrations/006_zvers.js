exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('zvers', table => {
        table.increments();
        table.string('inv');
        table.boolean('isWork');
        table.timestamps(false, true);
      })
      .createTable('blocks', table => {
        table.increments();
        table
          .integer('zver_id')
          .unsigned()
          .references('id')
          .inTable('zvers')
          .onDelete('CASCADE');
        table.string('inv');
        table.boolean('isWork');
        table.timestamps(false, true);
      })
      .createTable('modules', table => {
        table.increments();
        table
          .integer('block_id')
          .unsigned()
          .references('id')
          .inTable('blocks')
          .onDelete('CASCADE');
        table.string('inv');
        table.boolean('isWork');
        table.timestamps(false, true);
      })
      .createTable('comments', table => {
        table.increments();
        table
          .integer('zver_id')
          .unsigned()
          .references('id')
          .inTable('zvers')
          .onDelete('CASCADE');
        table
          .integer('block_id')
          .unsigned()
          .references('id')
          .inTable('blocks')
          .onDelete('CASCADE');
        table
          .integer('module_id')
          .unsigned()
          .references('id')
          .inTable('modules')
          .onDelete('CASCADE');
        table.string('content');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('zvers'),
    knex.schema.dropTable('blocks'),
    knex.schema.dropTable('modules'),
    knex.schema.dropTable('comments')
  ]);
};
