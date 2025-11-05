import { computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import type { BlogPost } from '@/types/blog/blog.types'

/**
 * 處理部落格列表和搜尋的 Composable
 */
export function useBlogList() {
  const blogStore = useBlogStore()

  // 所有文章
  const posts = computed(() => blogStore.allPosts)
  
  // 載入狀態
  const isLoading = computed(() => blogStore.isLoading)
  const isInitialized = computed(() => blogStore.isInitialized)
  const error = computed(() => blogStore.error)

  // 所有標籤
  const tags = computed(() => blogStore.allTags)

  // 按日期排序的文章（最新的在前）
  const sortedPosts = computed(() => 
    [...posts.value].sort((a, b) => b.date.getTime() - a.date.getTime())
  )

  // 按標籤篩選文章
  function getPostsByTag(tagName: string): BlogPost[] {
    return blogStore.getPostsByTag(tagName)
  }

  // 搜尋文章（標題或描述）
  function searchPosts(query: string): BlogPost[] {
    if (!query.trim()) return sortedPosts.value

    const lowerQuery = query.toLowerCase()
    return sortedPosts.value.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      (post.description && post.description.toLowerCase().includes(lowerQuery)) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // 按月份分組文章
  const postsByMonth = computed(() => {
    const grouped = new Map<string, BlogPost[]>()
    
    for (const post of sortedPosts.value) {
      const monthKey = `${post.date.getFullYear()}-${String(post.date.getMonth() + 1).padStart(2, '0')}`
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, [])
      }
      grouped.get(monthKey)!.push(post)
    }
    
    return grouped
  })

  // 獲取最近的文章
  function getRecentPosts(limit: number = 5): BlogPost[] {
    return sortedPosts.value.slice(0, limit)
  }

  // 載入所有文章
  async function loadAllPosts() {
    await blogStore.loadAllPosts()
  }

  // 清除錯誤
  function clearError() {
    blogStore.clearError()
  }

  return {
    posts,
    sortedPosts,
    isLoading,
    isInitialized,
    error,
    tags,
    postsByMonth,
    getPostsByTag,
    searchPosts,
    getRecentPosts,
    loadAllPosts,
    clearError
  }
}