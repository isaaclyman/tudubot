const commands = require('./_commands')
const messages = require('./_messages')

module.exports = function (knex, T) {
  const reply = require('./replier')(T)
  const trim = require('./trimmer')()
  const isValid = require('./validator')(knex, T)

  // uses { id_str, text, user }
  return async function consume (tweet) {
    const valid = await isValid(tweet)
    if (!valid) {
      // Don't reply here; trust the validator to do that. Otherwise an endless tweet loop may ensue.
      return
    }

    const text = trim(tweet.text)

    if (!text) {
      return
    }

    let command = null
    Object.keys(commands).some(key => {
      if (!commands.hasOwnProperty(key)) {
        return false
      }

      const words = commands[key]
      return words.some(word => {
        if (text.startsWith(word)) {
          command = key
          return true
        }
        return false
      })
    })

    if (command === null) {
      await reply(tweet.id_str, tweet.user.screen_name, messages.COMMAND_NOT_RECOGNIZED)
      return
    }

    switch (command) {
      case 'ADD':
        return
      case 'COMPLETE':
        return
      case 'DELETE':
        return
      case 'HELP':
        await reply(tweet_id_str, tweet.user.screen_name, messages.HELP)
        return
      case 'VIEW':
        return
    }
  }
}