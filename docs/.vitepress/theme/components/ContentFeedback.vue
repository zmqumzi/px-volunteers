<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const vote = ref('')
const counts = ref(null)
const busy = ref(false)
const ready = ref(false)
const error = ref('')
const status = ref('')
const article = computed(() => page.value.relativePath)
const api = 'https://px-feedback-api.px-feedback-api.workers.dev/v1/feedback'
const identityKey = 'px.feedback.visitor.v2'
let visitor = ''
let controller
let generation = 0
const choices = [{ id: 'useful', label: '有用' }, { id: 'unhelpful', label: '没帮助' }]

async function requestVote(next) {
  if (!visitor) return
  controller?.abort()
  controller = new AbortController()
  const active = controller
  const current = ++generation
  busy.value = true
  const timeout = setTimeout(() => active.abort(), 10000)
  try {
    const headers = { 'X-PX-Visitor': visitor }
    const options = { headers, signal: active.signal, cache: 'no-store' }
    let url = `${api}?article=${encodeURIComponent(article.value)}`
    if (next !== undefined) {
      options.method = 'POST'
      headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ article: article.value, vote: next })
      url = api
    }
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(response.status === 429 ? 'rate-limit' : 'unavailable')
    const data = await response.json()
    if (current !== generation) return
    if (data.article !== article.value || !Number.isSafeInteger(data.counts?.useful) || !Number.isSafeInteger(data.counts?.unhelpful)
      || data.counts.useful < 0 || data.counts.unhelpful < 0 || ![null, 'useful', 'unhelpful'].includes(data.vote)) throw new Error('invalid-response')
    counts.value = data.counts
    vote.value = data.vote || ''
    error.value = ''
    if (next !== undefined) {
      status.value = next ? '已记录你的选择。' : '已取消评价。'
      // Notify other tabs without treating local storage as the source of counts.
      try { localStorage.setItem('px.feedback.changed.v2', `${Date.now()}:${crypto.randomUUID()}`) } catch { /* Optional tab sync. */ }
    }
  } catch (problem) {
    if (current === generation) error.value = problem.message === 'rate-limit'
      ? '操作较频繁，请稍后再试。' : '评价服务暂时不可用，请稍后重试。'
  } finally {
    clearTimeout(timeout)
    if (current === generation) busy.value = false
  }
}

function castVote(id) {
  if (!busy.value) requestVote(vote.value === id ? null : id)
}

function refresh() { if (ready.value && !busy.value) requestVote() }
function syncVote(event) {
  if (event.key === 'px.feedback.changed.v2') refresh()
  if (event.key === identityKey || event.key === null) initialize()
}
function initialize() {
  ++generation
  controller?.abort()
  vote.value = ''
  counts.value = null
  ready.value = false
  busy.value = false
  try {
    visitor = localStorage.getItem(identityKey) || ''
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitor)) {
      visitor = crypto.randomUUID()
      localStorage.setItem(identityKey, visitor)
    }
    ready.value = true
    requestVote()
  } catch { error.value = '无法保存匿名评价标识，请允许浏览器使用本地存储。' }
}
onMounted(() => {
  initialize()
  window.addEventListener('storage', syncVote)
  window.addEventListener('focus', refresh)
})
onUnmounted(() => {
  ++generation
  controller?.abort()
  window.removeEventListener('storage', syncVote)
  window.removeEventListener('focus', refresh)
})
watch(article, () => {
  if (ready.value) { counts.value = null; vote.value = ''; status.value = ''; requestVote() }
})
</script>

<template>
  <section class="content-feedback" aria-labelledby="feedback-heading">
    <h2 id="feedback-heading" class="ignore-header">这篇内容对你有帮助吗？</h2>
    <div class="feedback-options" role="group" aria-label="内容评价">
      <button v-for="choice in choices" :key="choice.id" type="button" :disabled="!ready || busy" :title="choice.label" :aria-label="`${choice.label}，${counts ? counts[choice.id] + ' 票' : '数量暂未获取'}`" :aria-pressed="vote === choice.id" @click="castVote(choice.id)">
        <svg v-if="choice.id === 'useful'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M7 10H3v11h4M7 10l5-7c.6-.8 2-.3 2 1v5h5.4a2 2 0 0 1 2 2.4l-1.4 7a3 3 0 0 1-3 2.6H7V10Z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" /><path d="M8 16c2-2.2 6-2.2 8 0M8.5 8.5h.01M15.5 8.5h.01" stroke-width="2" />
        </svg>
        <span class="feedback-count" aria-hidden="true">{{ counts ? counts[choice.id] : '—' }}</span>
      </button>
    </div>
    <p v-if="error" class="feedback-status" role="alert">{{ error }}</p>
    <span class="visually-hidden" role="status">{{ status }}</span>
  </section>
</template>
