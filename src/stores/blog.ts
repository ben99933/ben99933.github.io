import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type { BlogPost } from '@/types/blog/blog.types'
import { FetchDataSource } from '@/services/core/DataSource'
import { UrlService } from '@/services/core/UrlService'
import { BlogRepository } from '@/services/blog/BlogRepository'

/**
 * 部落格相關的全域狀態管理
 */
export const useBlogStore = defineStore('blog', () => {
  // 狀態
  const posts = ref<Map<string, BlogPost>>(new Map())
  const tags = ref<Set<string>>(new Set())
  const isLoading = ref(false)
  const isInitialized = ref(false)
  const error = ref<string | null>(null)

  // 服務實例（單例模式，但通過依賴注入實現）
  const dataSource = new FetchDataSource()
  const urlService = new UrlService()
  const repository = new BlogRepository(dataSource, urlService)

  // Getters
  const allPosts = computed(() => Array.from(posts.value.values()))
  const postCount = computed(() => posts.value.size)
  const allTags = computed(() => Array.from(tags.value))
  
  const getPostById = computed(() => (id: string) => posts.value.get(id))
  
  const getPostsByTag = computed(() => (tagName: string) =>
    allPosts.value.filter(post => post.tags.includes(tagName))
  )

  // Actions
  async function loadAllPosts() {
    if (isLoading.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      const loadedPosts = await repository.getAllPosts()
      
      // 清空並重新填充
      posts.value.clear()
      tags.value.clear()
      
      for (const post of loadedPosts) {
        posts.value.set(post.id, post)
        
        // 收集標籤
        for (const tag of post.tags) {
          tags.value.add(tag)
        }
      }
      
      isInitialized.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load posts'
      console.error('Failed to load all posts:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function loadPost(id: string, month: string): Promise<BlogPost | null> {
    try {
      const post = await repository.getPost(id, month)
      posts.value.set(post.id, post)
      
      // 收集標籤
      for (const tag of post.tags) {
        tags.value.add(tag)
      }
      
      return post
    } catch (err) {
      console.error(`Failed to load post ${id}:`, err)
      return null
    }
  }

  function addPost(post: BlogPost) {
    posts.value.set(post.id, post)
    
    // 收集標籤
    for (const tag of post.tags) {
      tags.value.add(tag)
    }
  }

  function removePost(id: string) {
    const removed = posts.value.delete(id)
    
    if (removed) {
      // 重新計算標籤
      tags.value.clear()
      for (const post of posts.value.values()) {
        for (const tag of post.tags) {
          tags.value.add(tag)
        }
      }
    }
    
    return removed
  }

  function clearError() {
    error.value = null
  }

  // 提供 repository 給需要直接使用的場合
  function getRepository() {
    return repository
  }

  function getBlogImageUrl(filename?: string): string | undefined {
    return filename ? urlService.getBlogImageUrl(filename) : undefined
  }

  return {
    // 狀態
    posts: readonly(posts),
    tags: readonly(tags),
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    error: readonly(error),
    
    // Getters
    allPosts,
    postCount,
    allTags,
    getPostById,
    getPostsByTag,
    
    // Actions
    loadAllPosts,
    loadPost,
    addPost,
    removePost,
    clearError,
    getRepository,
    getBlogImageUrl
  }
})