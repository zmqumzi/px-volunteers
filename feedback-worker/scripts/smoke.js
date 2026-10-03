import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const base = process.argv[2] || 'http://127.0.0.1:8787'
const article = 'general/basics.md'
const a = randomUUID(), b = randomUUID()
// Diagnostic-only DNS override, preserving URL, SNI and certificate verification.
// This does not change system DNS or website configuration.
async function http(url, options = {}) {
  if (!process.env.PX_API_CONNECT_IP) return fetch(url, options)
  const hostname = new URL(url).hostname
  const args = ['--silent', '--show-error', '--include', '--suppress-connect-headers', '--max-time', '20',
    '--connect-to', `${hostname}:443:${process.env.PX_API_CONNECT_IP}:443`, '-X', options.method || 'GET']
  for (const [name, value] of Object.entries(options.headers || {})) args.push('-H', `${name}: ${value}`)
  if (options.body) args.push('--data-binary', options.body)
  args.push(url)
  const raw = execFileSync('curl.exe', args, { encoding: 'utf8' })
  const split = raw.indexOf('\r\n\r\n')
  assert.ok(split >= 0, 'Missing response headers')
  const lines = raw.slice(0, split).split('\r\n')
  const status = Number(lines.shift().split(' ')[1])
  const headers = new Headers()
  for (const line of lines) {
    const colon = line.indexOf(':')
    if (colon > 0) headers.append(line.slice(0, colon), line.slice(colon + 1).trim())
  }
  return new Response(status === 204 ? null : raw.slice(split + 4), { status, headers })
}
async function call(visitor = '', vote = undefined) {
  const headers = { Origin: 'https://zmqumzi.github.io' }
  if (visitor) headers['X-PX-Visitor'] = visitor
  const options = { headers, signal: AbortSignal.timeout(15000) }
  if (vote !== undefined) {
    options.method = 'POST'
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify({ article, vote })
  }
  const response = await http(`${base}/v1/feedback?article=${encodeURIComponent(article)}`, options)
  assert.equal(response.status, 200, `Unexpected HTTP ${response.status}`)
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), headers.Origin)
  return response.json()
}
const health = await http(`${base}/health`, { signal: AbortSignal.timeout(15000) })
assert.equal(health.status, 200)
const baseline = (await call()).counts
try {
  const first = await call(a, 'useful')
  assert.deepEqual(first.counts, { useful: baseline.useful + 1, unhelpful: baseline.unhelpful })
  assert.deepEqual((await call(a, 'useful')).counts, first.counts)
  assert.deepEqual((await call(b)).counts, first.counts)
  assert.equal((await call(b)).vote, null)
  const two = await call(b, 'unhelpful')
  assert.deepEqual(two.counts, { useful: baseline.useful + 1, unhelpful: baseline.unhelpful + 1 })
  assert.equal((await call(a)).vote, 'useful')
  assert.deepEqual((await call(a, 'unhelpful')).counts, { useful: baseline.useful, unhelpful: baseline.unhelpful + 2 })
  assert.deepEqual((await call(a, null)).counts, { useful: baseline.useful, unhelpful: baseline.unhelpful + 1 })
  assert.equal((await call(a)).vote, null)
  const preflight = await http(`${base}/v1/feedback`, {
    method: 'OPTIONS', headers: { Origin: 'https://zmqumzi.github.io', 'Access-Control-Request-Method': 'POST' },
    signal: AbortSignal.timeout(15000),
  })
  assert.equal(preflight.status, 204)
} finally {
  await call(a, null)
  await call(b, null)
}
assert.deepEqual((await call()).counts, baseline)
console.log('PASS: shared counts, repeat submission, independent choices, switch, cancel, CORS and cleanup')
