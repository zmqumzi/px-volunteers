<script setup>
import { withBase } from 'vitepress'
import { resources } from '../catalog.js'
</script>

<template>
  <div class="learning-page">
    <header class="page-intro">
      <p class="eyebrow">准备清单 · 专题资料 · 学习入口</p>
      <h1>资源下载</h1>
      <p class="page-lead">每份资料附上用途、格式与来源。下载的清单可以按实际项目修改，外部资料可前往来源网站查阅。</p>
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
        <a v-else class="text-link external-resource" :href="resource.link" target="_blank" rel="noopener noreferrer">查看来源<span class="visually-hidden">（在新标签页打开）</span></a>
      </section>
    </div>
  </div>
</template>
