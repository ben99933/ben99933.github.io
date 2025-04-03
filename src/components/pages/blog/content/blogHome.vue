<template>
<article class="blog active" data-page="blog">

    <header>
        <h2 class="h2 article-title">Blog</h2>
    </header>

    <section class="blog-posts">
        <ul class="blog-posts-list mx-5" style="grid-template-columns: 1fr !important">
            <li class="blog-post-item" v-for="item in sortedPosts " >
                <a :href=" '/blog/view?' + 'month=' + item.postDate.toISOString().slice(0,7)+ '&id=' + item.uuid">
                    <figure class="blog-banner-box" v-if="item.img.length >0">
                        <img :src="item.imgUrl" alt="Design conferences in 2022" loading="lazy">
                    </figure>
                    <div class="blog-content">

                        <div class="blog-meta">
                            <!-- <p class="blog-category">{{ item.category.name }}</p> -->
                            <time>{{ item.postDate.toLocaleDateString() }}</time>
                            <div class="blog-category">
                                <ul class="flex">
                                    <li v-for="tag in item.tags" class="flex items-center gap-1 m-1">
                                        <span class="dot"></span>
                                        <span class="">{{ tag.name }}</span>
                                        
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
import { BlogPostTag, BlogPostTagRegister, BlogPostItem, BlogPostItemRegister } from "@/utils/Blog/BlogPostItem";
import { onMounted,computed } from "vue";
import dayjs from "dayjs";

const sortedPosts = computed(() => {
  return Array.from(BlogPostItemRegister.getInstance().items.value.values())
    .sort((a, b) => b.postDate.getTime() - a.postDate.getTime());
});

</script>