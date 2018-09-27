const constants = require('./_constants')

module.exports = function () {
  // Removes everything up to and including the first instance of @_tudubot
  return function trim (text) {
    return text.slice(trimmable.indexOf(`@${constants.HANDLE}`) + `@${constants.HANDLE}`.length).trim()
  }
}
