import test from 'ava'
import knex from 'knex'
import fakeKnex from 'mock-knex'

const db = knex({ client: 'pg' })
let tracker

test.before('mock db', () => {
  fakeKnex.mock(db)
  tracker = fakeKnex.getTracker()
})

test.beforeEach('install query tracker', () => {
  tracker.install()
})

test.afterEach('uninstall query tracker', () => {
  tracker.uninstall()
})

test.after('unmock db', () => {
  fakeKnex.unmock(db)
})

import actionsBase from '../src/actions'

const actions = actionsBase(db)
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

function stubGetItems(items = []) {
  tracker.on('query', query => {
    if (query.method === 'first' && !query.sql.includes('id')) {
      query.response({
        todos: items
      })
    } else if (query.method === 'first') {
      query.response({ id: 1 })
    } else {
      console.error('Unplanned query', query)
      t.fail()
      query.response()
    }
  })
}

test('add valid item to new list', async t => {
  t.plan(1)
  tracker.on('query', query => {
    if (query.method === 'first') {
      query.response(null)
      return
    } else if (query.method === 'insert') {
      query.response()
      t.pass()
    } else {
      console.error('Unplanned query', query)
      t.fail()
      query.response()
    }
  })
  await actions.addItem('go running', '123', () => t.fail)
})

test('add valid item to existing list', async t => {
  t.plan(1)
  tracker.on('query', query => {
    if (query.method === 'first' && !query.sql.includes('id')) {
      query.response({
        todos: []
      })
    } else if (query.method === 'first' && query.sql.includes('id')) {
      query.response({ id: 123 })
    } else if (query.method === 'update') {
      query.response()
      t.pass()
    } else {
      console.error('Unplanned query', query)
      t.fail()
      query.response()
    }
  })
  await actions.addItem('go running', '123', () => t.fail)
})

test('cannot add item that is too long', async t => {
  t.plan(1)
  stubGetItems()
  await actions.addItem('a'.repeat(55), '123', () => t.pass())
})

test('cannot add more than 5 items', async t => {
  t.plan(1)
  stubGetItems([todo('1'), todo('2'), todo('3'), todo('4'), todo('5')])
  await actions.addItem('go running', '123', () => t.pass())
})
