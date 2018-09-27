const constants = require('./_constants')
const messages = require('./_messages')

module.exports = function (knex, T, reply) {
  // Uses { id_str, in_reply_to_screen_name, text, user.id_str, user.screen_name }
  return async function isValid (tweet) {
    // Make sure we have enough data to work with
    if (!tweet || !tweet.text || !tweet.text.trim() || !tweet.user || !tweet.user.id_str || !tweet.user.screen_name) {
      return false
    }

    // Don't respond to the bot's own tweets
    if (tweet.user.screen_name === `${constants.HANDLE}`) {
      return false
    }

    let doesAtMe = false  
    if (tweet.in_reply_to_screen_name === constants.HANDLE) {
      doesAtMe = true
    } else if (tweet.text && tweet.text.includes(`@${constants.HANDLE}`)) {
      doesAtMe = true
    }

    if (!doesAtMe) {
      return false
    }

    const isRecognized = await knex('todos').where({ userId: tweet.user.id_str }).first('id').then(id => {
      if (id) {
        return true
      }
      return false
    })

    if (isRecognized) {
      return true
    }

    const followsMe = await T.get(constants.FRIENDSHIPS_LOOKUP, { user_id: tweet.user.id_str }).then(users => {
      if (!users || !users.length) {
        return false
      }

      const requestedUser = users[0]
      if (!requestedUser.connections || !requestedUser.connections.length) {
        return false
      }

      return requestedUser.connections.includes(constants.FOLLOWS_ME)
    })

    if (!followsMe) {
      await reply(tweet.id_str, tweet.user.screen_name, messages.PLZ_FOLLOW)
      return false
    }

    return true
  }
}
