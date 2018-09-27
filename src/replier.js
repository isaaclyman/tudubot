module.exports = function (T) {
  return async function reply(tweetId, atHandle, message) {
    if (!atHandle) {
      return
    }

    await T.post('statuses/update', { status: `@${atHandle} ${message}`, in_reply_to_status_id: tweetId })
  }
}
