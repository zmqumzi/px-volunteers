<script setup>
import { withBase } from 'vitepress'
</script>

<template>
  <div class="learning-page">
    <header class="page-intro">
      <h1>关于我们</h1>
    </header>
    <div class="about-layout">
      <div class="about-copy">
        <section>
          <h2>学习与服务</h2>
          <p>参考培训部的资料与经验，整理通用培训、急救科普、残障人士服务和专项服务准备内容，供学习与查阅。</p>
        </section>
        <section>
          <h2>资料与实践基础</h2>
          <p>深圳大学志愿者联合会培训部的过往资料记录了志愿服务知识学习、活动实践和部门带教。我们将从中整理适合公开分享的内容，为校内志愿者提供学习参考。</p>
          <p>新干事见面大会、总结暨聘书颁发大会等实践，也为资料整理和经验传承提供了基础。</p>
        </section>
        <section>
          <h2>一起完善资料</h2>
          <p>我们以图文和可下载的资源分享经验，免费开放，供大家自主阅读与使用。文章末尾保留内容评价入口，欢迎帮助我们补充资料、发现问题。</p>
        </section>
      </div>
      <figure class="about-logo">
        <img :src="withBase('/images/volunteer-federation.jpg')" alt="深圳大学志愿者联合会标识" width="640" height="640" loading="lazy">
        <figcaption>深圳大学志愿者联合会<br>培训部资料与实践参考</figcaption>
      </figure>
    </div>
  </div>
</template>
