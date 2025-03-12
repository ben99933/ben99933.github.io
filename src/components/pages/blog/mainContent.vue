<template>
<div class="main-content">
    <!--- #NAVBAR-->
    <nav class="navbar">
        <commonNavbar/>
    </nav>


    <!--- #CONTENT-->
    <article class="blog active" data-page="blog">

        <header>
            <h2 class="h2 article-title">Blog</h2>
        </header>

        <section class="blog-posts">
            <ul class="blog-posts-list">
                <li class="blog-post-item" v-for="item in BlogPostItemRegister.getInstance().items">
                    <a :href="item.link">
                        <figure class="blog-banner-box">
                            <img :src="item.img" alt="Design conferences in 2022" loading="lazy">
                        </figure>
                        <div class="blog-content">

                            <div class="blog-meta">
                                <!-- <p class="blog-category">{{ item.category.name }}</p> -->
                                <div class="blog-category">
                                    <ul>
                                        <li v-for="category in item.categories">{{ category.name }}</li>
                                    </ul>
                                </div>
                                <span class="dot"></span>

                                <time>{{ new Date().toLocaleDateString() }}</time>
                            </div>

                            <h3 class="h3 blog-item-title">{{ item.title }}</h3>

                            <p class="blog-text">
                            Veritatis et quasi architecto beatae vitae dicta sunt, explicabo.
                            </p>

                        </div>
                    </a>
                </li>

                
                <li class="blog-post-item">
                    <a href="#">

                    <figure class="blog-banner-box">
                        <img src="../../../assets/images/logo.ico" alt="Design conferences in 2022" loading="lazy">
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
                </li>
               

            </ul>

        </section>
    </article>
    
</div>
</template>

<script setup lang="ts">
import commonNavbar from '@/components/commonNavbar.vue';
import { BlogPostCategory, BlogPostCategoryRegister, BlogPostItem, BlogPostItemRegister } from "@/utils/BlogPostItem";

</script>