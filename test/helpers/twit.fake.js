export default function (returns) {
  return {
    get: function () {
      return Promise.resolve(returns)
    },
    post: function () {
      return Promise.resolve(returns)
    }
  }
}