// TUDUBOT
const path = require('path')
const Twit = require('twit')

if (!process.env.DATABASE_URL) {
  var env = require('node-env-file')
  env(path.join(__dirname, '.env'))
}

const knex = require('./db')
const constants = require ('./src/_constants')

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_API,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
})
const consume = require('./src/processor')(knex, T)

knex.migrate.latest().then(() => {
  const ats = T.stream(constants.FILTERED_STATUSES, { track: [`@${constants.HANDLE}`] })
  ats.on('tweet', tweet => consume(tweet))
})
