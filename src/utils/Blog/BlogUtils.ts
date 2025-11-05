import type { BlogPost, BlogPostMetadata } from '@/types/blog/blog.types'

/**
 * 部落格相關的工具函數
 */

/**
 * 部落格文章工廠函數 - 用簡單函數替代複雜的 Factory 類別
 */
export function createBlogPost(metadata: BlogPostMetadata): BlogPost {
  return {
    id: metadata.UUID,
    title: metadata.title,
    date: new Date(metadata.date),
    description: metadata.description,
    imageFileName: metadata.img,
    tags: metadata.tags || []
  }
}

/**
 * 驗證部落格文章參數
 */
export function validateBlogPostParams(id: string, month: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/

  return (
    typeof id === 'string' && 
    uuidRegex.test(id) && 
    typeof month === 'string' && 
    monthRegex.test(month)
  )
}

/**
 * 格式化部落格文章日期
 */
export function formatBlogDate(date: Date): string {
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 獲取文章摘要（截取描述的前 N 個字）
 */
export function getPostExcerpt(post: BlogPost, maxLength: number = 150): string {
  if (!post.description) return ''
  
  if (post.description.length <= maxLength) {
    return post.description
  }
  
  return post.description.substring(0, maxLength) + '...'
}