import test from 'ava'
import actionsBase from '../src/actions'

const actions = actionsBase({})
const todo = content => ({ content, completed: false })

test('find todo by exact match', t => {
  const index = actions.findTodoIndex([
    todo('item alpha'), todo('item beta'), todo('item gamma')
  ], 'item beta')
  t.is(index, 1)
})

test('find todo by includes', t => {
  const index = actions.findTodoIndex([
    todo('item alpha'), todo('item beta'), todo('item gamma')
  ], 'beta')
  t.is(index, 1)
})

test('find todo by fuzzy match', t => {
  const index = actions.findTodoIndex([
    todo('item alpha'), todo('item beta'), todo('item gamma')
  ], 'item brta')
  t.is(index, 1)

  const index2 = actions.findTodoIndex([
    todo('item alpha'), todo('item beta'), todo('item gamma')
  ], 'itrm brta')
  t.is(index2, 1)
})

test('cannot find todo', t => {
  const index = actions.findTodoIndex([
    todo('item alpha'), todo('item beta'), todo('item gamma')
  ], 'artem barta')
  t.is(index, -1)
})
