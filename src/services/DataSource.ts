import type { IDataSource } from '@/interfaces/blog.interfaces'
import { DataSourceError } from '@/errors/blog.errors'

/**
 * 基於 fetch API 的資料來源實作
 */
export class FetchDataSource implements IDataSource {
  constructor(private baseUrl: string = '') {}

  async get<T>(path: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`)
      
      if (!response.ok) {
        throw new DataSourceError(
          `Failed to fetch ${path}`, 
          response.status
        )
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error
      }
      throw new DataSourceError(`Network error when fetching ${path}`, undefined, error as Error)
    }
  }

  async getText(path: string): Promise<string> {
    try {
      const fullUrl = `${this.baseUrl}${path}`
      
      const response = await fetch(fullUrl)
      
      if (!response.ok) {
        throw new DataSourceError(
          `Failed to fetch text from ${path} (HTTP ${response.status}: ${response.statusText})`, 
          response.status
        )
      }
      
      return await response.text()
    } catch (error) {
      if (error instanceof DataSourceError) {
        throw error
      }
      throw new DataSourceError(`Network error when fetching text from ${path}`, undefined, error as Error)
    }
  }
}