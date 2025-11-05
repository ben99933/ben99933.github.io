/**
 * 部落格相關的核心型別定義
 */

// 基本的部落格文章介面
export interface BlogPost {
  readonly id: string
  readonly title: string
  readonly date: Date
  readonly description?: string
  readonly imageFileName?: string
  readonly tags: readonly string[]
}

// 部落格標籤介面
export interface BlogTag {
  readonly name: string
}

// 從 API 或檔案載入的原始 metadata 格式
export interface BlogPostMetadata {
  readonly title: string
  readonly date: string
  readonly UUID: string
  readonly description?: string
  readonly img?: string
  readonly tags?: string[]
}

// 載入狀態
export interface LoadingState {
  readonly isLoading: boolean
  readonly error: string | null
}

// 部落格文章的完整資料（包含內容）
export interface BlogPostWithContent extends BlogPost {
  readonly content: string
}