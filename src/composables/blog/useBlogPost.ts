import { ref, computed, readonly } from 'vue'
import { useBlogStore } from '@/stores/blog'
import type { BlogPost, BlogPostWithContent } from '@/types/blog/blog.types'

/**
 * 處理單篇部落格文章的 Composable
 */
export function useBlogPost(id: string, month: string) {
  const blogStore = useBlogStore()
  
  const post = ref<BlogPost | null>(null)
  const content = ref<string>('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 從 store 中嘗試獲取文章
  const cachedPost = computed(() => blogStore.getPostById(id))

  async function loadPost() {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      // 先檢查 store 中是否已有資料
      if (cachedPost.value) {
        post.value = cachedPost.value
      } else {
        // 從服務載入
        const repository = blogStore.getRepository()
        post.value = await repository.getPostSafe(id, month)
      }

      if (!post.value) {
        error.value = 'Post not found'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load post'
      console.error('Failed to load post:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadContent() {
    if (!post.value || content.value) return

    try {
      const repository = blogStore.getRepository()
      const contentResult = await repository.getPostContentSafe(id, month)
      
      if (contentResult !== null) {
        content.value = contentResult
      } else {
        error.value = 'Content not found'
        console.warn(`Content not found for post: ${id} in ${month}`)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load content'
      console.error('Failed to load content:', err)
    }
  }

  async function loadPostWithContent(): Promise<BlogPostWithContent | null> {
    // 先載入文章基本資訊
    await loadPost()
    
    // 如果文章載入失敗，直接返回 null
    if (!post.value) {
      return null
    }

    // 嘗試載入內容，即使失敗也返回文章（只是沒有內容）
    await loadContent()

    return {
      ...post.value,
      content: content.value || ''  // 如果內容載入失敗，使用空字串
    }
  }

  const imageUrl = computed(() => {
    return post.value?.imageFileName 
      ? blogStore.getBlogImageUrl(post.value.imageFileName)
      : undefined
  })

  function clearError() {
    error.value = null
  }

  return {
    post: readonly(post),
    content: readonly(content),
    isLoading: readonly(isLoading),
    error: readonly(error),
    imageUrl,
    loadPost,
    loadContent,
    loadPostWithContent,
    clearError
  }
}