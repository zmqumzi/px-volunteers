import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { readFileSync, readdirSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import worker, { ARTICLES } from '../src/index.js'

const schema = readFileSync(new URL('../schema.sql', import.meta.url), 'utf8')
const article = 'general/basics.md'
const origin = 'https://zmqumzi.github.io'
// Exercise the actual handler and SQLite schema, including trigger transactions.
function setup() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(schema)
  const env = {
    DB: {
      prepare(sql) {
        const statement = {
          sql, args: [],
          bind(...args) { return { ...statement, args } },
          async all() { return { results: sqlite.prepare(sql).all() } },
        }
        return statement
      },
      async batch(statements) {
        sqlite.exec('BEGIN')
        try {
          const results = statements.map(s => {
            const stmt = sqlite.prepare(s.sql)
            if (s.sql.trim().startsWith('SELECT')) return { results: stmt.all(...s.args) }
            stmt.run(...s.args)
            return { results: [] }
          })
          sqlite.exec('COMMIT')
          return results
        } catch (error) { sqlite.exec('ROLLBACK'); throw error }
      },
    },
    VOTE_LIMITER: { async limit() { return { success: true } } },
  }
  async function call(method = 'GET', visitor = '', vote, options = {}) {
    const headers = { Origin: origin, ...options.headers }
    if (visitor) headers['X-PX-Visitor'] = visitor
    const init = { method, headers }
    if (method === 'POST') {
      headers['Content-Type'] ??= 'application/json'
      init.body = options.raw ?? JSON.stringify({ article: options.article ?? article, vote })
    }
    const path = options.path ?? `/v1/feedback?article=${encodeURIComponent(options.article ?? article)}`
    const response = await worker.fetch(new Request(`https://api.example${path}`, init), env)
    return { response, data: response.status === 204 ? null : await response.json() }
  }
  return { call, env, sqlite }
}

test('two visitors share totals; duplicate submissions, switching and cancellation are idempotent', async () => {
  const { call } = setup()
  const a = randomUUID(), b = randomUUID()
  assert.deepEqual((await call()).data.counts, { useful: 0, unhelpful: 0 })
  for (let i = 0; i < 3; i++) assert.deepEqual((await call('POST', a, 'useful')).data.counts, { useful: 1, unhelpful: 0 })
  assert.deepEqual((await call('POST', b, 'useful')).data.counts, { useful: 2, unhelpful: 0 })
  assert.equal((await call('GET', a)).data.vote, 'useful')
  assert.deepEqual((await call('POST', a, 'unhelpful')).data.counts, { useful: 1, unhelpful: 1 })
  for (let i = 0; i < 2; i++) assert.deepEqual((await call('POST', a, null)).data.counts, { useful: 1, unhelpful: 0 })
  assert.equal((await call('GET', a)).data.vote, null)
  assert.equal((await call('GET', b)).data.vote, 'useful')
  assert.deepEqual((await call('GET', b, undefined, { article: 'general/prepare.md' })).data.counts, { useful: 0, unhelpful: 0 })
})

test('parallel requests from 80 visitors have exact totals, including repeated submissions', async () => {
  const { call } = setup()
  const visitors = Array.from({ length: 80 }, () => randomUUID())
  await Promise.all(visitors.flatMap(id => [call('POST', id, 'useful'), call('POST', id, 'useful')]))
  assert.deepEqual((await call()).data.counts, { useful: 80, unhelpful: 0 })
  await Promise.all(visitors.slice(0, 40).map(id => call('POST', id, 'unhelpful')))
  await Promise.all(visitors.slice(40).map(id => call('POST', id, null)))
  assert.deepEqual((await call()).data.counts, { useful: 0, unhelpful: 40 })
})

test('validation, CORS, method restriction and bounded payloads', async () => {
  const { call } = setup(), id = randomUUID()
  assert.equal((await call('POST', id, 'useful', { headers: { Origin: 'https://bad.example' } })).response.status, 403)
  assert.equal((await call('POST', id, 'useful', { headers: { Origin: '' } })).response.status, 403)
  assert.equal((await call('POST', '', 'useful')).response.status, 400)
  assert.equal((await call('POST', 'invalid', 'useful')).response.status, 400)
  assert.equal((await call('POST', id, 'wrong')).response.status, 400)
  assert.equal((await call('POST', id, 'useful', { article: "';DROP TABLE feedback_votes;--" })).response.status, 400)
  for (const raw of ['{', 'null', '[]']) assert.equal((await call('POST', id, 'useful', { raw })).response.status, 400)
  assert.equal((await call('POST', id, 'useful', { raw: 'x'.repeat(1025) })).response.status, 413)
  assert.equal((await call('POST', id, 'useful', { headers: { 'Content-Type': 'text/plain' } })).response.status, 415)
  assert.equal((await call('DELETE')).response.status, 405)
  const preflight = (await call('OPTIONS')).response
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), origin)
  assert.match(preflight.headers.get('Access-Control-Allow-Headers'), /X-PX-Visitor/)
  assert.equal((await call()).response.headers.get('Cache-Control'), 'no-store')
  assert.deepEqual((await call()).data.counts, { useful: 0, unhelpful: 0 })
})

test('rate limiting and database failures do not claim a successful vote', async () => {
  const { call, env } = setup()
  env.VOTE_LIMITER.limit = async () => ({ success: false })
  const result = await call('POST', randomUUID(), 'useful')
  assert.equal(result.response.status, 429)
  assert.equal(result.response.headers.get('Retry-After'), '60')
  assert.deepEqual((await call()).data.counts, { useful: 0, unhelpful: 0 })
  delete env.VOTE_LIMITER
  assert.equal((await call('POST', randomUUID(), 'useful')).response.status, 503)
  env.DB.batch = async () => { throw new Error('private database error') }
  assert.deepEqual((await call()).data, { error: 'service_unavailable' })
})

test('allowlist covers all current articles with feedback enabled', () => {
  const docs = new URL('../../docs/', import.meta.url)
  const paths = readdirSync(docs, { recursive: true }).filter(p => p.endsWith('.md') && !p.startsWith('.vitepress'))
  const enabled = paths.filter(p => /^feedback:\s*true\s*$/m.test(readFileSync(new URL(p.replaceAll('\\', '/'), docs), 'utf8')))
    .map(p => p.replaceAll('\\', '/'))
  assert.deepEqual([...ARTICLES].sort(), enabled.sort())
})
