<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()
const vote = ref('')
const ready = ref(false)
const error = ref('')
const status = ref('')
const storageKey = computed(() => `px.feedback.v1.${page.value.relativePath}`)
const choices = [{ id: 'useful', label: '有用' }, { id: 'unhelpful', label: '没帮助' }]

function loadVote() {
  vote.value = ''
  error.value = ''
  status.value = ''
  try {
    const stored = localStorage.getItem(storageKey.value)
    if (choices.some(choice => choice.id === stored)) vote.value = stored
  } catch { /* Storage may be unavailable; a failed save is reported on click. */ }
}

function castVote(id) {
  const next = vote.value === id ? '' : id
  try {
    if (next) localStorage.setItem(storageKey.value, next)
    else localStorage.removeItem(storageKey.value)
    vote.value = next
    error.value = ''
    status.value = next ? '已记录你的选择。' : '已取消评价。'
  } catch {
    error.value = '暂时无法保存评价，请重试。'
  }
}

function syncVote(event) {
  if (event.key === storageKey.value || event.key === null) loadVote()
}

onMounted(() => {
  loadVote()
  ready.value = true
  window.addEventListener('storage', syncVote)
})
onUnmounted(() => window.removeEventListener('storage', syncVote))
watch(storageKey, () => { if (ready.value) loadVote() })
</script>

<template>
  <section class="content-feedback" aria-labelledby="feedback-heading">
    <h2 id="feedback-heading" class="ignore-header">这篇内容对你有帮助吗？</h2>
    <div class="feedback-options" role="group" aria-label="内容评价">
      <button v-for="choice in choices" :key="choice.id" type="button" :disabled="!ready" :title="choice.label" :aria-label="`${choice.label}，${vote === choice.id ? 1 : 0} 票`" :aria-pressed="vote === choice.id" @click="castVote(choice.id)">
        <svg v-if="choice.id === 'useful'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M7 10H3v11h4M7 10l5-7c.6-.8 2-.3 2 1v5h5.4a2 2 0 0 1 2 2.4l-1.4 7a3 3 0 0 1-3 2.6H7V10Z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" /><path d="M8 16c2-2.2 6-2.2 8 0M8.5 8.5h.01M15.5 8.5h.01" stroke-width="2" />
        </svg>
        <span class="feedback-count" aria-hidden="true">{{ vote === choice.id ? 1 : 0 }}</span>
      </button>
    </div>
    <p v-if="error" class="feedback-status" role="alert">{{ error }}</p>
    <span class="visually-hidden" role="status">{{ status }}</span>
  </section>
</template>
