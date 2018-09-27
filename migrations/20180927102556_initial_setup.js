// Create initial tables

const TODOS_TABLE = 'todos'

exports.up = function(knex, Promise) {
  return todosTable(knex)
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(TODOS_TABLE)
}

function todosTable(knex) {
  return knex.schema.createTable(TODOS_TABLE, t => {
    t.increments('id').primary()
    t.string('userId').unique().notNullable()
    t.json('todo')
    t.timestamps()
  })
}
