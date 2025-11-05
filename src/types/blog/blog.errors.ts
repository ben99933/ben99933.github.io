/**
 * 部落格相關的錯誤處理類別
 */

export class BlogError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message)
    this.name = 'BlogError'
  }
}

export class DataSourceError extends BlogError {
  constructor(message: string, public statusCode?: number, cause?: Error) {
    super(message, cause)
    this.name = 'DataSourceError'
  }
}

export class ValidationError extends BlogError {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class PostNotFoundError extends BlogError {
  constructor(id: string, month: string) {
    super(`Post not found: ${id} in ${month}`)
    this.name = 'PostNotFoundError'
  }
}