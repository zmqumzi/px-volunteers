<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { training } from '../catalog.js'

const props = defineProps({ kind: { type: String, required: true } })
const group = computed(() => training[props.kind])
</script>

<template>
  <div v-if="group" class="learning-page">
    <header class="page-intro">
      <p class="eyebrow">{{ group.kicker }}</p>
      <h1>{{ group.title }}</h1>
      <p class="page-lead">{{ group.description }}</p>
    </header>
    <div class="course-grid">
      <section v-for="item in group.items" :key="item.link" class="course-card">
        <p class="course-topic">{{ item.topic }}</p>
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <a class="text-link" :href="withBase(item.link)">{{ item.action }}</a>
      </section>
    </div>
  </div>
</template>
