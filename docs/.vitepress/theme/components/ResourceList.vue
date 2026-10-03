<script setup>
import { withBase } from 'vitepress'
import { resources } from '../catalog.js'
</script>

<template>
  <div class="learning-page">
    <header class="page-intro">
      <p class="eyebrow">部门资料 · 报账模板 · 填写指南</p>
      <h1>资源下载</h1>
      <p class="page-lead">下载公开脱敏的历史资料，阅读活动报账填写指南。涉及本次活动的流程和表格，请向负责人核对后使用。</p>
    </header>
    <div class="resource-list">
      <section v-for="resource in resources" :key="resource.link" class="resource-row">
        <div>
          <h2>{{ resource.title }}</h2>
          <p class="resource-meta">{{ resource.format }} · {{ resource.category }}</p>
          <p class="resource-description">{{ resource.description }}</p>
          <p class="resource-source">{{ resource.note }}</p>
        </div>
        <a v-if="resource.filename" class="site-button" :href="withBase(resource.link)" :download="resource.filename">下载资料</a>
        <a v-else-if="resource.action" class="text-link" :href="withBase(resource.link)">{{ resource.action }}</a>
        <a v-else class="text-link external-resource" :href="resource.link" target="_blank" rel="noopener noreferrer">查看来源<span class="visually-hidden">（在新标签页打开）</span></a>
      </section>
    </div>
  </div>
</template>
