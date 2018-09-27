const constants = require('./_constants')

module.exports = {
  COMMAND_NOT_RECOGNIZED:
    `I don't understand that request. I'm ever so sorry. Try "@${constants.HANDLE} help" to see what I can do.`,
  HELP:
    `How to use Tudubot: @${constants.HANDLE} + "add go shopping", "check off shopping", "delete shopping", or "view my list".`,
  ITEM_NOT_FOUND: `Oh no! I couldn't find that to-do item. Try "@${constants.HANDLE} view my list" and check your spelling.`,
  ITEM_TOO_LONG: `Oh no! A to-do item can't be more than ${constants.MAX_TODO_LENGTH} characters long. Please shorten it and try again.`,
  PLZ_FOLLOW: `This bot only responds to followers! Please follow @${constants.HANDLE} and try again.`,
  TOO_MANY_ITEMS: `Oh no! Only ${constants.MAX_TODO_NUMBER} to-do items are allowed per user. Please delete an item and try again.`
}
