import type { 
  IBlogRepository, 
  IDataSource, 
  IUrlService 
} from '@/interfaces/blog.interfaces'
import type { 
  BlogPost, 
  BlogPostMetadata, 
  BlogPostWithContent 
} from '@/types/blog.types'
import { 
  BlogError, 
  ValidationError, 
  PostNotFoundError 
} from '@/errors/blog.errors'

/**
 * 部落格儲存庫實作
 */
export class BlogRepository implements IBlogRepository {
  constructor(
    private dataSource: IDataSource,
    private urlService: IUrlService
  ) {}

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const filenames: string[] = await this.dataSource.get('/blogDB/index.json')
      
      const posts = await Promise.allSettled(
        filenames.map(filename => this.loadPostFromFilename(filename))
      )
      
      return posts
        .filter((result): result is PromiseFulfilledResult<BlogPost> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value)
    } catch (error) {
      throw new BlogError('Failed to load all posts', error as Error)
    }
  }

  async getPost(id: string, month: string): Promise<BlogPost> {
    if (!this.validatePostParams(id, month)) {
      throw new ValidationError('Invalid post ID or month format')
    }

    try {
      const metadataUrl = this.urlService.getPostMetadataUrl(month, id)
      const metadata: BlogPostMetadata = await this.dataSource.get(metadataUrl)
      return this.mapToBlogPost(metadata)
    } catch (error) {
      throw new PostNotFoundError(id, month)
    }
  }

  async getPostSafe(id: string, month: string): Promise<BlogPost | null> {
    try {
      return await this.getPost(id, month)
    } catch (error) {
      console.warn(`Post not found: ${id} in ${month}`, error)
      return null
    }
  }

  async getPostContent(id: string, month: string): Promise<string> {
    if (!this.validatePostParams(id, month)) {
      throw new ValidationError('Invalid post ID or month format')
    }

    try {
      const contentUrl = this.urlService.getPostContentUrl(month, id)
      return await this.dataSource.getText(contentUrl)
    } catch (error) {
      throw new BlogError(`Failed to load content for post ${id}`, error as Error)
    }
  }

  async getPostContentSafe(id: string, month: string): Promise<string | null> {
    try {
      return await this.getPostContent(id, month)
    } catch (error) {
      console.warn(`Content not found for post: ${id} in ${month}`, error)
      return null
    }
  }

  async getPostWithContent(id: string, month: string): Promise<BlogPostWithContent> {
    const [post, content] = await Promise.all([
      this.getPost(id, month),
      this.getPostContent(id, month)
    ])

    return {
      ...post,
      content
    }
  }

  validatePostParams(id: string, month: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/

    return (
      typeof id === 'string' && 
      uuidRegex.test(id) && 
      typeof month === 'string' && 
      monthRegex.test(month)
    )
  }

  private async loadPostFromFilename(filename: string): Promise<BlogPost | null> {
    try {
      const metadata: BlogPostMetadata = await this.dataSource.get(`/blogDB/metadata/${filename}`)
      return this.mapToBlogPost(metadata)
    } catch (error) {
      console.warn(`Failed to load metadata from ${filename}:`, error)
      return null
    }
  }

  private mapToBlogPost(metadata: BlogPostMetadata): BlogPost {
    return {
      id: metadata.UUID,
      title: metadata.title,
      date: new Date(metadata.date),
      description: metadata.description,
      imageFileName: metadata.img,
      tags: metadata.tags || []
    }
  }
}