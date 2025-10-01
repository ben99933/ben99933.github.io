import { nextTick } from 'vue'
import type { BlogPost } from '@/types/blog.types'

/**
 * 處理 SEO 相關功能的 Composable
 */
export function useSEO() {
  
  async function updateSEO(post: BlogPost) {
    if (!post) return

    await nextTick()
    
    // 更新頁面標題
    document.title = `${post.title} | ben99933.github.io`
    
    // 更新描述 meta tag
    const description = post.description || post.title || "ben99933.github.io"
    updateMetaTag('description', description)
    
    // 更新 keywords meta tag（基於標籤）
    if (post.tags.length > 0) {
      updateMetaTag('keywords', post.tags.join(', '))
    }
    
    // 更新 author meta tag
    updateMetaTag('author', 'ben99933')
    
    // 如果有圖片，可以加入 og:image
    // if (post.imageFileName) {
    //   updateMetaProperty('og:image', getBlogImageUrl(post.imageFileName))
    // }
  }

  function updateMetaTag(name: string, content: string) {
    let meta = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null
    
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = name
      document.head.appendChild(meta)
    }
    
    meta.content = content
  }

  function updateMetaProperty(property: string, content: string) {
    let meta = document.querySelector(`meta[property='${property}']`) as HTMLMetaElement | null
    
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    
    meta.content = content
  }

  function resetSEO() {
    document.title = 'ben99933.github.io'
    updateMetaTag('description', 'ben99933.github.io')
    updateMetaTag('keywords', '')
  }

  return {
    updateSEO,
    resetSEO
  }
}