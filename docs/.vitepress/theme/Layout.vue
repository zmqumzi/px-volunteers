<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import ContentFeedback from './components/ContentFeedback.vue'
import BrandLogo from './components/BrandLogo.vue'

const { frontmatter } = useData()
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-title-after>
      <BrandLogo />
    </template>
    <template #doc-before>
      <div v-if="frontmatter.category" class="article-category">
        <span>{{ frontmatter.category }}</span>
        <span v-if="frontmatter.updated">更新于 {{ frontmatter.updated }}</span>
      </div>
    </template>
    <template #doc-after>
      <ContentFeedback v-if="frontmatter.feedback" :key="frontmatter.title" />
    </template>
  </DefaultTheme.Layout>
</template>
