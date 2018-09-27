export default function (returns) {
  return {
    get: function () {
      return Promise.resolve({ data: returns })
    },
    post: function () {
      return Promise.resolve({ data: returns })
    }
  }
}