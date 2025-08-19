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
                
                <li class="blog-post-item relative group flex" v-for="item in sortedPosts" v-bind:key="item.uuid">
                    <div class="flex">
                        <a :href="'#/admin/view?' + 'month=' + item.postDate.toISOString().slice(0, 7) + '&id=' + item.uuid">
                            <figure class="blog-banner-box" v-if="item.img.length > 0">
                                <img :src="item.imgUrl" alt="Design conferences in 2022" loading="lazy">
                            </figure>
                            <div class="blog-content">

                                <div class="blog-meta">
                                    <!-- <p class="blog-category">{{ item.category.name }}</p> -->
                                    <time>{{ item.postDate.toLocaleDateString() }}</time>
                                    <div class="blog-category">
                                        <ul class="flex">
                                            <li v-for="tag in item.tags" :key="tag.name" class="flex items-center gap-1 m-1">
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
                    </div>
                    <div class="flex item-center justify-end gap-2 absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100 ">

                        <button class="m-5 p-2 hover:scale-125 duration-300" style="background-color: var(--jet);"
                        @click="deletePost(item.uuid)">
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
import { BlogPostTag, BlogPostTagRegister, BlogPostItem, BlogPostItemRegister } from "@/utils/Blog/BlogPostItem";
import { onMounted, computed,nextTick } from "vue";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const sortedPosts = computed(() => {
    return Array.from(BlogPostItemRegister.getInstance().items.value.values())
        .sort((a, b) => b.postDate.getTime() - a.postDate.getTime());
});

async function deletePost(uuid:string){
    const confirmed = window.confirm(`Are you sure you want to delete the post?\n
        Title: ${BlogPostItemRegister.getInstance().items.value.get(uuid)?.title}\n
        Date: ${BlogPostItemRegister.getInstance().items.value.get(uuid)?.postDate.toLocaleDateString()}\n
        Tags: ${Array.from(BlogPostItemRegister.getInstance().items.value.get(uuid)?.tags || []).map(tag => tag.name).join(", ")}\n
        Description: ${BlogPostItemRegister.getInstance().items.value.get(uuid)?.description}`
    );
    if (!confirmed) return;

    BlogPostItemRegister.getInstance().removeItem(uuid);
    const response = await fetch(`http://localhost:3030/api/blog/${uuid}`, {
        method: "DELETE"
    });
    console.log(response);
}

onMounted(async() => {
    await nextTick();
    document.title = "";
    await nextTick();
    document.title = "Admin | ben99933.github.io";
    
});



</script>