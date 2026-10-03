<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="learning-page home-page">
    <header class="page-intro home-intro">
      <h1>做好准备，参与服务。</h1>
      <p class="page-lead">查阅志愿服务基础、急救科普与无障碍服务资料。</p>
    </header>

    <div class="training-entries">
      <section class="entry-card general-entry">
        <h2>通用培训</h2>
        <p>了解志愿服务基础，学习沟通礼仪、团队协作和服务前的通用准备。</p>
        <a class="site-button" :href="withBase('/general/')">浏览通用培训</a>
      </section>
      <section class="entry-card specialized-entry">
        <h2>特化培训</h2>
        <p>学习急救科普、手语与听障沟通、盲人指引，以及专项志愿服务准备。</p>
        <a class="site-button" :href="withBase('/specialized/')">浏览专题培训</a>
      </section>
    </div>

    <section class="home-readings" aria-labelledby="reading-heading">
      <div class="section-heading">
        <h2 id="reading-heading">从一篇文章开始</h2>
        <a class="text-link" :href="withBase('/general/')">查看基础内容</a>
      </div>
      <div class="reading-list">
        <a class="reading-row" :href="withBase('/general/prepare')">
          <span><strong>第一次参加志愿活动，如何准备？</strong><span class="reading-note">通用培训 · 活动前的准备</span></span>
          <span class="reading-action">阅读</span>
        </a>
        <a class="reading-row" :href="withBase('/specialized/vision-support')">
          <span><strong>提供盲人指引前，先询问对方需要什么</strong><span class="reading-note">特化培训 · 残障人士服务</span></span>
          <span class="reading-action">阅读</span>
        </a>
      </div>
    </section>

    <section class="resource-strip">
      <div><h2>从实践资料中学习</h2><p>查阅第 29 届活动与培训文件，下载报账参考模板。</p></div>
      <a class="text-link" :href="withBase('/resources')">查看下载资源</a>
    </section>
  </div>
</template>
