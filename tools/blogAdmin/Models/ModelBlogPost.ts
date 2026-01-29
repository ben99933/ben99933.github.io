import type {BlogPostMetadata} from '@/types/blog/blog.types';

export interface ModelBlogPostData{
  metadata: BlogPostMetadata;
  content: string;
}
