import test from 'ava'
import knex from 'knex'
import fakeKnex from 'mock-knex'
import fakeTwit from './helpers/twit.fake'
import fakeReply from './helpers/replier.fake'
import constants from '../src/_constants'

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

test('a valid tweet object by a recognized user is validated', async t => {
  t.plan(1)

  tracker.on('query', query => {
    query.response({ id: 1 })
  })

  const validator = require('../src/validator')(db, fakeTwit([]), fakeReply())

  const validTweet = {
    id_str: '12345',
    in_reply_to_screen_name: '_tudubot',
    text: '@_tudubot add go running',
    user: {
      id_str: '23456',
      screen_name: 'testbob'
    }
  }

  const isValid = await validator(validTweet)
  t.is(isValid, true)
})

test('a valid tweet by someone who follows me is validated', async t => {
  t.plan(1)

  tracker.on('query', query => {
    query.response(null)
  })

  const validator = require('../src/validator')(db, fakeTwit([{
    connections: [constants.FOLLOWS_ME]
  }]), fakeReply())

  const validTweet = {
    id_str: '12345',
    in_reply_to_screen_name: '_tudubot',
    text: '@_tudubot add go running',
    user: {
      id_str: '23456',
      screen_name: 'testbob'
    }
  }

  const isValid = await validator(validTweet)
  t.is(isValid, true)
})

test('a tweet intended for someone else is not validated', async t => {
  t.plan(1)

  const validator = require('../src/validator')(db, fakeTwit([]), fakeReply())

  const invalidTweet = {
    id_str: '12345',
    in_reply_to_screen_name: 'testsally',
    text: '@testsally add go running',
    user: {
      id_str: '23456',
      screen_name: 'testbob'
    }
  }

  const isValid = await validator(invalidTweet)
  t.is(isValid, false)
})

test('a tweet by an unrecognized user who does not follow me is not validated', async t => {
  t.plan(1)

  tracker.on('query', query => {
    query.response(null)
  })

  const validator = require('../src/validator')(db, fakeTwit([{
    connections: ['not_a_real_connection']
  }]), fakeReply())

  const invalidTweet = {
    id_str: '12345',
    in_reply_to_screen_name: '_tudubot',
    text: '@_tudubot add go running',
    user: {
      id_str: '23456',
      screen_name: 'testbob'
    }
  }

  const isValid = await validator(invalidTweet)
  t.is(isValid, false)
})
