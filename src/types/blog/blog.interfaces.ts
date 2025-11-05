import type { BlogPost, BlogPostWithContent } from '@/types/blog/blog.types'

/**
 * 資料來源抽象層 - 負責從各種來源載入資料
 */
export interface IDataSource {
  get<T>(path: string): Promise<T>
  getText(path: string): Promise<string>
}

/**
 * 部落格儲存庫介面 - 負責部落格相關的資料操作
 */
export interface IBlogRepository {
  /**
   * 載入所有部落格文章的摘要資訊
   */
  getAllPosts(): Promise<BlogPost[]>
  
  /**
   * 根據 ID 和月份載入特定文章
   */
  getPost(id: string, month: string): Promise<BlogPost>
  
  /**
   * 安全地載入文章，找不到時返回 null 而不拋出錯誤
   */
  getPostSafe(id: string, month: string): Promise<BlogPost | null>
  
  /**
   * 載入文章的 Markdown 內容
   */
  getPostContent(id: string, month: string): Promise<string>
  
  /**
   * 安全地載入文章內容，找不到時返回 null 而不拋出錯誤
   */
  getPostContentSafe(id: string, month: string): Promise<string | null>
  
  /**
   * 載入文章及其內容
   */
  getPostWithContent(id: string, month: string): Promise<BlogPostWithContent>
  
  /**
   * 驗證文章 ID 和月份格式是否正確
   */
  validatePostParams(id: string, month: string): boolean
}

/**
 * URL 服務介面 - 處理各種 URL 相關操作
 */
export interface IUrlService {
  getBlogImageUrl(filename: string): string
  getPostMetadataUrl(month: string, id: string): string
  getPostContentUrl(month: string, id: string): string
}