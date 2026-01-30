import type { IUrlService } from '@/types/blog/blog.interfaces'

/**
 * URL 服務實作 - 處理部落格相關的 URL 生成
 */
export class UrlService implements IUrlService {
  getBlogImageUrl(filepath: string): string {
    // return new URL(`../assets/images/blog/${filename}`, import.meta.url).href
    return `/blogDB/images/${filepath}`
  }

  getPostMetadataUrl(month: string, id: string): string {
    return `/blogDB/metadata/${month}/${id}.json`
  }

  getPostContentUrl(month: string, id: string): string {
    return `/blogDB/post/${month}/${id}.md`
  }
}
