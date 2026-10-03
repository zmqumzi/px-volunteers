<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { resourceGroups } from '../catalog.js'

const selectedGroup = ref('all')
const visibleGroups = computed(() => resourceGroups.filter(group => selectedGroup.value === 'all' || group.id === selectedGroup.value))
</script>

<template>
  <div class="learning-page">
    <header class="page-intro">
      <p class="eyebrow">按工作查找资料</p>
      <h1>资源下载</h1>
      <p class="page-lead">培训、筹备、执行与日常工作，按需下载原版文件。</p>
    </header>
    <div class="resource-filters" role="group" aria-label="按工作筛选资料">
      <button type="button" :aria-pressed="selectedGroup === 'all'" @click="selectedGroup = 'all'">全部</button>
      <button v-for="group in resourceGroups" :key="group.id" type="button" :aria-pressed="selectedGroup === group.id" @click="selectedGroup = group.id">{{ group.title }}<span>{{ group.items.length }}</span></button>
    </div>
    <section v-for="group in visibleGroups" :key="group.id" class="resource-group" :aria-labelledby="`group-${group.id}`">
      <div class="resource-group-heading">
        <div>
          <h2 :id="`group-${group.id}`">{{ group.title }}</h2>
          <p>{{ group.description }}</p>
        </div>
        <a v-if="group.id === 'reimbursement'" class="text-link" :href="withBase('/resources/reimbursement')">阅读报账指南 →</a>
      </div>
      <div class="resource-list">
        <div v-for="resource in group.items" :key="resource.link" class="resource-row">
          <div>
            <h3 class="resource-title">{{ resource.title }}</h3>
            <p class="resource-meta">{{ resource.year }} · {{ resource.format }}</p>
            <p class="resource-description">{{ resource.description }}</p>
          </div>
          <a class="text-link resource-download" :href="withBase(resource.link)" :download="resource.filename" :aria-label="`下载${resource.title}`">下载 ↓</a>
        </div>
      </div>
    </section>
  </div>
</template>
