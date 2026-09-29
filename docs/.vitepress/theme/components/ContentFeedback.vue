<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const rating = ref('')
const message = ref('')
const selectedTopics = ref([])
const choices = ['有帮助', '部分有帮助', '需要改进']
const topics = ['表达更清楚', '补充服务场景', '增加图文示范', '修正内容或来源', '改进下载资料']
</script>

<template>
  <section class="content-feedback" aria-labelledby="feedback-heading">
    <h2 id="feedback-heading">这篇内容对你有帮助吗？</h2>
    <p>评价资料的实用性，也欢迎指出需要补充的地方。</p>
    <template v-if="theme.feedbackUrl">
      <a class="site-button" :href="theme.feedbackUrl" target="_blank" rel="noopener noreferrer">填写内容评价<span class="visually-hidden">（在新标签页打开）</span></a>
    </template>
    <template v-else>
      <div class="feedback-options" role="group" aria-label="内容评价">
        <button v-for="choice in choices" :key="choice" type="button" :aria-pressed="rating === choice" @click="rating = choice">{{ choice }}</button>
      </div>
      <div v-if="rating" class="feedback-extra">
        <fieldset class="feedback-topics">
          <legend>哪些地方需要补充或改进？（选填）</legend>
          <div class="feedback-topic-options">
            <label v-for="topic in topics" :key="topic">
              <input v-model="selectedTopics" type="checkbox" :value="topic" />
              <span>{{ topic }}</span>
            </label>
          </div>
        </fieldset>
        <label for="feedback-message">你希望补充或改进什么？（选填）</label>
        <textarea id="feedback-message" v-model="message" placeholder="例如：希望补充某个服务场景的图文示范" maxlength="2000" rows="3"></textarea>
      </div>
      <p class="feedback-status" role="status">评价问题预览，暂不提交或收集填写内容。</p>
    </template>
  </section>
</template>
