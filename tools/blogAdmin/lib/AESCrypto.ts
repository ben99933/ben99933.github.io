/**
 * AES 加解密工具 (Node.js 後台端)
 * 使用 Node.js crypto 模組實作 AES-GCM 加解密
 */

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12  // GCM 推薦 12 bytes
const AUTH_TAG_LENGTH = 16

/**
 * 從密鑰字串生成 32 bytes 的 key
 */
function deriveKey(keyString: string): Buffer {
  return crypto.createHash('sha256').update(keyString).digest()
}

/**
 * AES-GCM 加密
 * @param plaintext 明文
 * @param keyString 密鑰字串
 * @returns 加密後的 Base64 字串 (格式: iv:ciphertext)
 */
export function aesEncrypt(plaintext: string, keyString: string): string {
  if (!keyString) {
    throw new Error('AES key is required for encryption')
  }

  const key = deriveKey(keyString)
  const iv = crypto.randomBytes(IV_LENGTH)
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH
  })
  
  let encrypted = cipher.update(plaintext, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])
  
  const authTag = cipher.getAuthTag()
  
  // 將密文和 authTag 組合（authTag 放在末尾，與 Web Crypto API 一致）
  const combined = Buffer.concat([encrypted, authTag])
  
  const ivBase64 = iv.toString('base64')
  const ciphertextBase64 = combined.toString('base64')
  
  return `${ivBase64}:${ciphertextBase64}`
}

/**
 * AES-GCM 解密
 * @param encryptedData 加密的 Base64 字串 (格式: iv:ciphertext)
 * @param keyString 密鑰字串
 * @returns 解密後的明文
 */
export function aesDecrypt(encryptedData: string, keyString: string): string {
  if (!keyString) {
    throw new Error('AES key is required for decryption')
  }

  const [ivBase64, ciphertextBase64] = encryptedData.split(':')
  
  if (!ivBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted data format')
  }

  const key = deriveKey(keyString)
  const iv = Buffer.from(ivBase64, 'base64')
  const combined = Buffer.from(ciphertextBase64, 'base64')
  
  // 從末尾分離 authTag 和密文（與 Web Crypto API 一致）
  const ciphertext = combined.subarray(0, combined.length - AUTH_TAG_LENGTH)
  const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH)
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH
  })
  decipher.setAuthTag(authTag)
  
  let decrypted = decipher.update(ciphertext)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  
  return decrypted.toString('utf8')
}

/**
 * 檢查內容是否為加密格式
 */
export function isEncryptedContent(content: string): boolean {
  const parts = content.split(':')
  if (parts.length !== 2) return false
  
  const base64Regex = /^[A-Za-z0-9+/]+=*$/
  return base64Regex.test(parts[0]) && base64Regex.test(parts[1])
}

/**
 * 安全解密 - 如果 key 為空或解密失敗則返回原文
 */
export function safeDecrypt(content: string, keyString: string | undefined): string {
  if (!keyString || keyString.trim() === '') {
    return content
  }
  
  if (!isEncryptedContent(content)) {
    console.warn('Content does not appear to be encrypted, returning as-is')
    return content
  }
  
  try {
    return aesDecrypt(content, keyString)
  } catch (error) {
    console.error('Failed to decrypt content:', error)
    throw new Error('解密失敗，請確認 AES 金鑰是否正確')
  }
}

/**
 * 安全加密 - 如果 key 為空則返回原文
 */
export function safeEncrypt(content: string, keyString: string | undefined): string {
  if (!keyString || keyString.trim() === '') {
    return content
  }
  
  return aesEncrypt(content, keyString)
}
