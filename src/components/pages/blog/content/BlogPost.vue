<template>

    
<article class="blog active" data-page="blog">

  
  <header class="">
    <button @click="goBack">
      <ul class="flex">
        <li class="flex items-center gap-1 mr-4">
          <font-awesome-icon :icon="['fas', 'backward']" size="xl" style="color: #FFD43B;"/>
        </li>
        
        <li>
          <h3 class="h3 flex items-center hover:text-yellow-500">Back</h3>
        </li> 
      </ul>
      
    </button>
    <div class="separator-line"></div>
    <h2 class="h2 article-title">{{ postItem?.title || 'Article Not Found' }}</h2>
  </header>
  <section class="blog-posts">
    <MarkdownRenderer :content="markdownContent" />
  </section>
  


</article>
</template>


<script setup lang="ts">
import { useRoute, useRouter} from 'vue-router'
import {ref, onMounted, type Ref, watch, computed, watchEffect,nextTick} from 'vue'
import { BlogPostItem, BlogPostItemRegister, BlogPostFactory } from '@/utils/Blog/BlogPostItem'
import MarkdownRenderer from './MarkdownRenderer.vue'
import { loadMarkdown, loadMetadata } from '@/utils/Blog/BlogPostItemService'

const route = useRoute()
const router = useRouter();
const postId: Ref<string> = ref('')
const month: Ref<string> = ref('')
const postItem: Ref<BlogPostItem | null> = ref(null);
const markdownContent = ref("");

function goBack() {
  const referrer = document.referrer;
  const sameOrigin = referrer && new URL(referrer).origin === window.location.origin;
    
  if (window.history.length > 1 && sameOrigin) {
    router.back(); // 如果有上一頁，返回
  } else {
    router.push('/blog/home'); // 沒有就導向 blog 列表頁
  }
}
async function updateSEO(metadata:BlogPostItem) {
  if(metadata){
    await nextTick();
    document.title = "";
    await nextTick();
    
    document.title = `${metadata.title} | ben99933.github.io`;
    const description = metadata.description || metadata.title || "ben99933.github.io";

    description
    let meta = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    meta.content = description;
    
    
  }
}

onMounted(async () => {
  // console.log("mounted");
  postId.value = route.query.id as string;
  month.value = route.query.month as string;

  postItem.value = await loadMetadata(postId.value,month.value);
  let text = await loadMarkdown(month.value,postId.value);
  markdownContent.value = text;
  await updateSEO(postItem.value as BlogPostItem);
});

</script>


<style>


</style>