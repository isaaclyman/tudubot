const commands = require('./_commands')
const messages = require('./_messages')
const Item = require('./item')

module.exports = function (knex, T) {
  const { addItem, completeItem, deleteItem, getItems } = require('./actions')(knex, T, reply)
  const { reply } = require('./replier')(T)
  const trim = require('./trimmer')()
  const isValid = require('./validator')(knex, T, reply)

  // uses { id_str, text, user.screen_name, user.id_str }
  return async function consume (tweet) {
    const valid = await isValid(tweet)
    if (!valid) {
      // Don't reply here; trust the validator to do that. Otherwise an endless tweet loop may ensue.
      return
    }

    let text = trim(tweet.text)

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
          text = text.slice(text.indexOf(word) + word.length).trim()
          return true
        }
        return false
      })
    })

    const tweetId = tweet.id_str, atHandle = tweet.user.screen_name, userId = tweet.user.id_str

    if (command === null) {
      await reply(tweetId, atHandle, messages.COMMAND_NOT_RECOGNIZED)
      return
    }

    let items = []
    switch (command) {
      case 'ADD':
        await addItem(text, userId, msg => reply(tweetId, atHandle, msg))
        items = await getItems(userId)
        break
      case 'COMPLETE':
        await completeItem(text, userId, msg => reply(tweetId, atHandle, msg))
        items = await getItems(userId)
        break
      case 'DELETE':
        await deleteItem(text, userId, msg => reply(tweetId, atHandle, msg))
        items = await getItems(userId)
        break
      case 'HELP':
        await reply(tweetId, atHandle, messages.HELP)
        return
      case 'VIEW':
        items = await getItems(userId)
        break
    }

    const prefix = `@${atHandle}\n`
    await reply(tweetId, atHandle, prefix + items.map(item => {
      return `${item.complete ? '☑️' : '⬜'} ${item.content}`
    }).join('\n'))
  }
}
