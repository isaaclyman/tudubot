const constants = require('./_constants')

module.exports = function () {
  // Removes everything up to and including the first instance of @_tudubot
  return function trim (text) {
    if (!text.includes(`@${constants.HANDLE}`)) {
      return text.trim()
    }

    const startSlice = text.indexOf(`@${constants.HANDLE}`) + `@${constants.HANDLE}`.length
    return text.slice(startSlice).trim()
  }
}
