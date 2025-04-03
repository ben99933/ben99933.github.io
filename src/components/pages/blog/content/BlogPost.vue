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
    <h2 class="h2 article-title">{{ metadata?.title || 'Article Not Found' }}</h2>
  </header>
  <section class="blog-posts">
    <MarkdownRenderer :content="markdownContent" />
  </section>
  


</article>
</template>


<script setup lang="ts">
import { useRoute, useRouter} from 'vue-router'
import {ref, onMounted, type Ref, watch, computed} from 'vue'
import { BlogPostItem, BlogPostItemRegister, BlogPostFactory } from '@/utils/Blog/BlogPostItem'
import MarkdownRenderer from './MarkdownRenderer.vue'

const route = useRoute()
const router = useRouter();
const postId: Ref<string> = ref('')
const month: Ref<string> = ref('')
const metadata: Ref<BlogPostItem | null> = ref(null);
const markdownContent = ref("");

async function loadMetadata(){
  try{
    const queryId= route.query.id as string;
    const queryMonth = route.query.month as string;
    // console.log(`quertId=${queryId}, queryMonth=${queryMonth}`);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
    postId.value = queryId;
    month.value = queryMonth;
    if (typeof queryId === "string" && uuidRegex.test(queryId) && typeof queryMonth === "string" && monthRegex.test(queryMonth)){
      const metaRes = await fetch(`/blogDB/metadata/${month.value}/${postId.value}.json`);
      // console.losg(`metaRes=${metaRes}`);
      const meta = await metaRes.json();
      
      metadata.value = BlogPostFactory.createFromMetadata(meta);
    }else{
      console.warn("worng id or month");
    }
  }catch(e){
    console.warn(e)
  }
  
}
async function loadMarkdown(){
  try{
    const res = await fetch(`/blogDB/post/${month.value}/${postId.value}.md`)
    const text = await res.text();
    markdownContent.value = text;
  }catch(e){
    console.error(e);
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back(); // 如果有上一頁，返回
  } else {
    router.push('/blog/home'); // 沒有就導向 blog 列表頁
  }
}


onMounted(async () => {
  await loadMetadata();
  await loadMarkdown();
  if(metadata.value) document.title = `${metadata.value?.title}|ben99933.github.io` || "ben99933.github.io";
  const description = metadata.value?.description || metadata.value?.title || "ben99933.github.io";
  const meta = document.querySelector("meta[name='description']")
  if (meta) {
    meta.setAttribute("content", description)
  } else {
    const m = document.createElement("meta")
    m.name = "description"
    m.content = description
    document.head.appendChild(m)
  }
});

</script>


<style>


</style>