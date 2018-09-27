if (process.env.NO_SSL_DB !== 'true') {
  var pg = require('pg');
  pg.defaults.ssl = true;
}

const knexConfig = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  debug: process.env.DEBUG_DB === 'true',
  pool: {
    afterCreate: function (conn, done) {
      done(null, conn)
    }
  },
  acquireConnectionTimeout: 15000
}

const knex = require('knex')(knexConfig)

module.exports = knex