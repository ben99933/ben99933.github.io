<template>
    <article class="blog active" data-page="blog">

        <header>
            <h2 class="h2 article-title">Blog</h2>
        </header>

        <section class="blog-posts">
            <!-- 載入狀態 -->
            <div v-if="isLoading && sortedPosts.length === 0" class="flex justify-center items-center p-8">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p class="text-gray-400">載入文章中...</p>
                </div>
            </div>
            
            <!-- 無文章狀態 -->
            <div v-else-if="!isLoading && sortedPosts.length === 0" class="flex justify-center items-center p-8">
                <p class="text-gray-400">目前沒有文章</p>
            </div>
            
            <!-- 文章列表 -->
            <ul v-else class="blog-posts-list mx-5" style="grid-template-columns: 1fr !important">
                <li class="blog-post-item" v-for="item in sortedPosts" v-bind:key="item.id">
                    <a :href="'#/blog/view?' + 'month=' + item.date.toISOString().slice(0, 7) + '&id=' + item.id">
                        <figure class="blog-banner-box" v-if="item.imageFileName && item.imageFileName.length > 0">
                            <img :src="blogStore.getBlogImageUrl(item.imageFileName)" alt="Design conferences in 2022" loading="lazy">
                        </figure>
                        <div class="blog-content">

                            <div class="blog-meta">
                                <!-- <p class="blog-category">{{ item.category.name }}</p> -->
                                <time>{{ item.date.toLocaleDateString() }}</time>
                                <div class="blog-category">
                                    <ul class="flex">
                                        <li v-for="tag in item.tags" class="flex items-center gap-1 m-1" :key="tag">
                                            <span class="dot"></span>
                                            <span class="">{{ tag }}</span>

                                        </li>

                                    </ul>
                                </div>



                            </div>

                            <h3 class="h3 blog-item-title">{{ item.title }}</h3>

                            <p class="blog-text">
                                {{ item.description }}
                            </p>

                        </div>
                    </a>
                </li>


                <!-- <li class="blog-post-item">
                <a href="#">

                <figure class="blog-banner-box">
                    <img src="@/assets/images/blog/logo.svg" alt="Design conferences in 2022" loading="lazy">
                </figure>

                <div class="blog-content">

                    <div class="blog-meta">
                        <p class="blog-category">Design</p>

                        <span class="dot"></span>

                        <time>{{ new Date().toLocaleDateString() }}</time>
                    </div>

                    <h3 class="h3 blog-item-title">Design conferences in 2022</h3>

                    <p class="blog-text">
                        Veritatis et quasi architecto beatae vitae dicta sunt, explicabo.
                    </p>

                </div>

                </a>
            </li> -->


            </ul>

        </section>
    </article>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useBlogList } from "@/composables/blog/useBlogList";

import { useBlogStore } from "@/stores/blog";

const { sortedPosts, loadAllPosts, isLoading } = useBlogList();
const blogStore = useBlogStore();

onMounted(async() => {
    document.title = "Blog | ben99933.github.io";
    
    // 非同步載入文章列表
    loadAllPosts().catch(console.error)
});

</script>