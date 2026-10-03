// Article IDs match VitePress page.relativePath, independent of the hosting base URL.
export const ARTICLES = new Set([
  'general/basics.md', 'general/communication.md', 'general/prepare.md',
  'general/teamwork.md', 'specialized/first-aid.md', 'specialized/sign-language.md',
  'specialized/vision-support.md', 'specialized/service-preparation.md',
  'resources/reimbursement.md',
])
const ORIGINS = new Set([
  'https://zmqumzi.github.io',
  'http://127.0.0.1:4173', 'http://127.0.0.1:5173',
  'http://localhost:4173', 'http://localhost:5173',
])
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function reply(data, status, origin, extra = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Vary': 'Origin', ...extra,
  }
  if (ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin
  return new Response(status === 204 ? null : JSON.stringify(data), { status, headers })
}

async function handle(request, env) {
  const url = new URL(request.url)
  const origin = request.headers.get('Origin') || ''
  if (url.pathname === '/health' && request.method === 'GET') {
    await env.DB.prepare('SELECT article FROM feedback_totals LIMIT 1').all()
    return reply({ ok: true, service: 'px-feedback-api', version: 1 }, 200, origin)
  }
  if (url.pathname !== '/v1/feedback') return reply({ error: 'not_found' }, 404, origin)
  if (origin && !ORIGINS.has(origin)) return reply({ error: 'origin_not_allowed' }, 403, origin)
  if (request.method === 'OPTIONS') {
    if (!ORIGINS.has(origin)) return reply({ error: 'origin_required' }, 403, origin)
    return reply(null, 204, origin, {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-PX-Visitor',
      'Access-Control-Max-Age': '600',
    })
  }
  if (!['GET', 'POST'].includes(request.method)) {
    return reply({ error: 'method_not_allowed' }, 405, origin, { Allow: 'GET, POST, OPTIONS' })
  }
  let article = url.searchParams.get('article')
  const visitor = request.headers.get('X-PX-Visitor') || ''
  let vote
  if (visitor && !UUID.test(visitor)) return reply({ error: 'invalid_visitor' }, 400, origin)
  if (request.method === 'POST') {
    if (!ORIGINS.has(origin)) return reply({ error: 'origin_required' }, 403, origin)
    if (!visitor) return reply({ error: 'visitor_required' }, 400, origin)
    if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
      return reply({ error: 'json_required' }, 415, origin)
    }
    // Bound streamed input even when Content-Length is absent or incorrect.
    const reader = request.body?.getReader()
    if (!reader) return reply({ error: 'invalid_body' }, 400, origin)
    const chunks = []
    let size = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 1024) { await reader.cancel(); return reply({ error: 'body_too_large' }, 413, origin) }
      chunks.push(value)
    }
    const bytes = new Uint8Array(size)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength }
    let body
    try { body = JSON.parse(new TextDecoder().decode(bytes)) }
    catch { return reply({ error: 'invalid_json' }, 400, origin) }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ error: 'invalid_body' }, 400, origin)
    article = body.article
    vote = body.vote
    if (!['useful', 'unhelpful', null].includes(vote)) return reply({ error: 'invalid_vote' }, 400, origin)
  }
  if (!ARTICLES.has(article)) return reply({ error: 'unknown_article' }, 400, origin)
  if (request.method === 'POST') {
    if (!env.VOTE_LIMITER) return reply({ error: 'service_unavailable' }, 503, origin)
    // IP is only used transiently in the edge rate limiter, never stored in D1.
    const key = 'px-vote:' + (request.headers.get('CF-Connecting-IP') || visitor)
    const { success } = await env.VOTE_LIMITER.limit({ key })
    if (!success) return reply({ error: 'too_many_requests' }, 429, origin, { 'Retry-After': '60' })
  }
  const statements = []
  if (request.method === 'POST') {
    statements.push(vote === null
      ? env.DB.prepare('DELETE FROM feedback_votes WHERE article = ? AND visitor = ?').bind(article, visitor)
      : env.DB.prepare(`INSERT INTO feedback_votes (article, visitor, vote) VALUES (?, ?, ?)
          ON CONFLICT(article, visitor) DO UPDATE SET vote = excluded.vote
          WHERE feedback_votes.vote <> excluded.vote`).bind(article, visitor, vote))
  }
  statements.push(env.DB.prepare('SELECT useful, unhelpful FROM feedback_totals WHERE article = ?').bind(article))
  if (visitor) statements.push(env.DB.prepare('SELECT vote FROM feedback_votes WHERE article = ? AND visitor = ?').bind(article, visitor))
  // Mutations, trigger-updated totals and visitor choice share one D1 transaction.
  const results = await env.DB.batch(statements)
  const index = request.method === 'POST' ? 1 : 0
  const counts = results[index].results[0] || { useful: 0, unhelpful: 0 }
  return reply({ article, counts, vote: visitor ? results[index + 1].results[0]?.vote || null : null }, 200, origin)
}

export default {
  async fetch(request, env) {
    try { return await handle(request, env) }
    catch { return reply({ error: 'service_unavailable' }, 503, request.headers.get('Origin') || '') }
  },
}
