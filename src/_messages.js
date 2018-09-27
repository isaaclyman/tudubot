const constants = require('./_constants')

module.exports = {
  COMMAND_NOT_RECOGNIZED: `I don't understand that request. I'm ever so sorry. Try "@${constants.HANDLE} help" to see what I can do.`,
  HELP: `How to use Tudubot: @${constants.HANDLE} + "add", "check off", "delete", or "view".`,
  PLZ_FOLLOW: `This bot only responds to followers! Please follow @${constants.HANDLE} and try again.`
}
