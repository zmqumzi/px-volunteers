<script setup>
import { withBase } from 'vitepress'
defineProps({ href: { type: String, required: true }, filename: { type: String, required: true }, plain: { type: Boolean, default: false } })
</script>

<template>
  <a :class="plain ? 'inline-download' : 'site-button article-download'" :href="withBase(href)" :download="filename"><slot /></a>
</template>
