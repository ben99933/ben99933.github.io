<template>
  <article class="blog active" data-page="blog">
    <header>
      <h2 class="h2 article-title">Archives</h2>
    </header>

    <section class="timeline" v-for="timeline in timeLines" :key="timeline.title">
      <div class="title-wrapper">
        <div class="icon-box">
          <font-awesome-icon :icon="timeline.icon" size="xl" style="color: #FFD43B;" />
        </div>
        <h3 class="h3">{{ timeline.title }}</h3>
      </div>
      <ol class="timeline-list">
        <li class="timeline-item" v-for="item in timeline.items" :key="item.title">
          <a :href="item.link" class="flex ">

            <span class=" mr-2">{{ item.time }}</span>
            <h3 class="h2 timeline-item-title !text-lg hover:text-yellow-500">{{ item.title }}</h3>
          </a>


          <!-- <p class="timeline-text whitespace-pre">{{item.description}}</p> -->
        </li>
      </ol>
    </section>

  </article>


</template>

<script setup lang="ts">

import { BlogPostTag, BlogPostTagRegister, BlogPostItem, BlogPostItemRegister } from "@/utils/Blog/BlogPostItem";
import { onMounted, computed } from "vue";



const timeLines = computed(() => {
  const map = new Map<string, BlogPostItem[]>(); // key: '2025-04'
  const allPosts = Array.from(BlogPostItemRegister.getInstance().items.value.values());

  for (const post of allPosts) {
    const key = post.postDate.toISOString().slice(0, 7); // '2025-04'
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(post);
  }

  // 轉為陣列並排序（新到舊）
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, items]) => ({
      title: `${month}`,
      icon: ['fas', 'folder'], // 或你想要的 icon
      items: items.map(post => ({
        title: post.title,
        time: post.postDate.toLocaleDateString(), // ex: 2025/3/30
        description: post.description || '',       // 可加上 description 支援
        link: `#/blog/view?id=${post.uuid}&month=${month}` // 給 router-link 用
      }))
    }));
});
</script>