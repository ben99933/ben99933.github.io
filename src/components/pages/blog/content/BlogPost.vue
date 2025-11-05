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
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, watch, ref } from 'vue'
import MarkdownRenderer from './MarkdownRenderer.vue'
import { useBlogPost } from '@/composables/blog/useBlogPost'
import { useSEO } from '@/composables/common/useSEO'
import type { BlogPostWithContent } from '@/types/blog/blog.types'

const route = useRoute()
const router = useRouter()

const postId = computed(() => route.query.id as string)
const month = computed(() => route.query.month as string)

// 組件內部狀態
const postItem = ref<BlogPostWithContent | null>(null)
const markdownContent = computed(() => postItem.value?.content || '')

async function loadPostWithContent() {
  const id = postId.value
  const monthValue = month.value
  
  if (!id || !monthValue) {
    postItem.value = null
    return
  }

  // 使用 composable 載入資料
  const composable = useBlogPost(id, monthValue)
  const result = await composable.loadPostWithContent()
  postItem.value = result
}

// 當路由參數變化時，重新載入文章
watch([postId, month], async () => {
  await loadPostWithContent()
}, { immediate: false })

const { updateSEO } = useSEO()

function goBack() {
  const referrer = document.referrer;
  const sameOrigin = referrer && new URL(referrer).origin === window.location.origin;
    
  if (window.history.length > 1 && sameOrigin) {
    router.back(); // 如果有上一頁，返回
  } else {
    router.push('/blog/home'); // 沒有就導向 blog 列表頁
  }
}

onMounted(async () => {
  await loadPostWithContent()
  
  if (postItem.value) {
    await updateSEO(postItem.value)
  }
});

</script>


<style>


</style>