<template>
    <article class="blog active" data-page="blog">

        <header>
            <h2 class="h2 article-title">Admin</h2>
        </header>

        <section class="blog-posts">

            <div class="flex justify-end mb-4">
                <a
                    :href="'#/admin/view?month=' + new Date().toISOString().slice(0, 7) + '&id=+'"
                    class="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition-colors duration-300">
                    <font-awesome-icon :icon="['fas', 'plus']" />
                    Add Blog Post
                </a>
            </div>

            <ul class="blog-posts-list mx-5" style="grid-template-columns: 1fr !important">

                <li class="blog-post-item rounded-xl shadow-(--shadow-4) border-l-2 border-t-2 relative group flex border-gray-600" v-for="item in sortedPosts" v-bind:key="item.id">
                    <div class="">
                        <a :href="'#/admin/view?' + 'month=' + item.date.toISOString().slice(0, 7) + '&id=' + item.id">
                            <figure class="blog-banner-box" v-if="item.imageFileName && item.imageFileName.length > 0">
                                <img :src="`/blogDB/images/${item.date.toISOString().slice(0, 7)}/${item.id}/${item.imageFileName}`" alt="Blog post image" loading="lazy">
                            </figure>
                            <div class="blog-content">

                                <div class="blog-meta">
                                    <!-- <p class="blog-category">{{ item.category.name }}</p> -->
                                    <time>{{ item.date.toLocaleDateString() }}</time>
                                    <div class="blog-category">
                                        <ul class="flex">
                                            <li v-for="tag in item.tags" :key="tag" class="flex items-center gap-1 m-1">
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
                    </div>
                    <div class="flex item-center justify-end gap-2 absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ">

                        <button class="m-5 p-2 hover:scale-125 duration-300" style="background-color: var(--jet);"
                        @click="deletePost(item.id)">
                            <font-awesome-icon :icon="['fas', 'trash']" style="color: #ff0000;" :size="'lg'"/>
                        </button>
                    </div>
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
import { onMounted, computed, nextTick } from "vue";
import { useBlogList } from '@/composables/useBlogList'
import type { BlogPost } from '@/types/blog.types'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const { posts, loadAllPosts } = useBlogList()

const sortedPosts = computed(() => {
    return [...posts.value]
        .sort((a: BlogPost, b: BlogPost) => b.date.getTime() - a.date.getTime());
});

async function deletePost(uuid: string) {
    const post = posts.value.find((p: BlogPost) => p.id === uuid)
    if (!post) return
    
    const confirmed = window.confirm(`Are you sure you want to delete the post?\n
        Title: ${post.title}\n
        Date: ${post.date.toLocaleDateString()}\n
        Tags: ${post.tags.join(", ")}\n
        Description: ${post.description}`
    );
    if (!confirmed) return;

    // TODO: 實現刪除功能 - 需要與後端 API 整合
    const response = await fetch(`http://localhost:3030/api/blog/${uuid}`, {
        method: "DELETE"
    });
    console.log(response);
    
    // 重新載入文章列表
    await loadAllPosts()
}

onMounted(async() => {
    await nextTick();
    document.title = "";
    await nextTick();
    document.title = "Admin | ben99933.github.io";
    
    // 非同步載入文章列表 - 不阻塞頁面顯示
    loadAllPosts().catch(console.error)
});



</script>