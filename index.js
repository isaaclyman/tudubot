// TUDUBOT
const path = require('path')
const Twit = require('twit')

if (!process.env.DATABASE_URL) {
  var env = require('node-env-file')
  env(path.join(__dirname, '.env'))
}

const knex = require('./db')

knex.migrate.latest().then(() => {
  const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_API,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
  })
  
  return T.post('statuses/update', { status: 'hello world!' })
}).then(data => {
  console.log(data)
  process.exit()
})
