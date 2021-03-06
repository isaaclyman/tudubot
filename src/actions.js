const constants = require('./_constants')
const messages = require('./_messages')

// Thanks to James Westgate for this highly optimized Levenshtein distance finder
var levDist=function(r,a){var t=[],f=r.length,n=a.length;if(0==f)return n;if(0==n)return f;for(var v=f;v>=0;v--)t[v]=[];for(var v=f;v>=0;v--)t[v][0]=v;for(var e=n;e>=0;e--)t[0][e]=e;for(var v=1;f>=v;v++)for(var h=r.charAt(v-1),e=1;n>=e;e++){if(v==e&&t[v][e]>4)return f;var i=a.charAt(e-1),o=h==i?0:1,c=t[v-1][e]+1,u=t[v][e-1]+1,A=t[v-1][e-1]+o;c>u&&(c=u),c>A&&(c=A),t[v][e]=c,v>1&&e>1&&h==a.charAt(e-2)&&r.charAt(v-2)==i&&(t[v][e]=Math.min(t[v][e],t[v-2][e-2]+o))}return t[f][n]};

module.exports = function (knex) {
  function findTodoIndex (todos, text) {
    const matchable = text.trim().toLowerCase()
    if (!matchable) {
      return -1
    }

    const matchableTodos = todos.map(todo => todo.content.toLowerCase())

    const exactMatch = matchableTodos.findIndex(content => content === matchable)
    if (exactMatch > -1) {
      return exactMatch
    }

    const includeMatch = matchableTodos.findIndex(content => content.includes(matchable))
    if (includeMatch > -1) {
      return includeMatch
    }

    const fuzzyMatch = matchableTodos.findIndex(content => levDist(content, matchable) <= Math.floor(matchable.length / 4))
    if (fuzzyMatch > -1) {
      return fuzzyMatch
    }

    return -1
  }
  
  async function getItems(userId) {
    let todos = await knex('todos').where({ userId }).first('todos').then(row => row && row.todos)
    if (!todos) {
      todos = []
    }

    return todos
  }

  return {
    addItem: async function (text, userId, onMessage) {
      if (text.length > constants.MAX_TODO_LENGTH) {
        await onMessage(messages.ITEM_TOO_LONG)
        return false
      }

      const userExists = await knex('todos').where({ userId }).first('id').then(row => row && row.id >= 0)
      const todos = userExists ? await getItems(userId) : []

      if (todos.length >= constants.MAX_TODO_NUMBER) {
        await onMessage(messages.TOO_MANY_ITEMS)
        return false
      }

      todos.push({ content: text, complete: false })

      if (userExists) {
        await knex('todos').where({ userId }).update({
          todos: JSON.stringify(todos),
          updated_at: knex.raw('current_timestamp')
        })
      } else {
        await knex('todos').insert({
          userId,
          todos: JSON.stringify(todos),
          created_at: knex.raw('current_timestamp'),
          updated_at: knex.raw('current_timestamp')
        })
      }
      return true
    },
    completeItem: async function (text, userId, onMessage) {
      const todos = await getItems(userId)
      const todoIndex = findTodoIndex(todos, text)

      if (todoIndex === -1) {
        await onMessage(messages.ITEM_NOT_FOUND)
        return false
      }

      todos[todoIndex].complete = true
      await knex('todos').where({ userId }).update({
        todos: JSON.stringify(todos),
        updated_at: knex.raw('current_timestamp')
      })
      return true
    },
    deleteItem: async function (text, userId, onMessage) {
      const todos = await getItems(userId)
      const todoIndex = findTodoIndex(todos, text)

      if (todoIndex === -1) {
        await onMessage(messages.ITEM_NOT_FOUND)
        return false
      }

      todos.splice(todoIndex, 1)
      await knex('todos').where({ userId }).update({
        todos: JSON.stringify(todos),
        updated_at: knex.raw('current_timestamp')
      })
      return true
    },
    findTodoIndex: findTodoIndex,
    getItems: getItems
  }
}
