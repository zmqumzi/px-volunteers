<script setup>
import { withBase } from 'vitepress'
defineProps({ href: { type: String, required: true }, filename: { type: String, required: true } })
</script>

<template>
  <a class="site-button article-download" :href="withBase(href)" :download="filename"><slot /></a>
</template>
