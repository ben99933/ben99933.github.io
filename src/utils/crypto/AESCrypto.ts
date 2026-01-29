/**
 * AES 加解密工具 (瀏覽器端)
 * 使用 Web Crypto API 實作 AES-GCM 加解密
 */

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12  // GCM 推薦 12 bytes

/**
 * 將 Base64 字串轉換為 Uint8Array
 */
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * 將 Uint8Array 轉換為 Base64 字串
 */
function bytesToBase64(bytes: Uint8Array): string {
  let binaryString = ''
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i])
  }
  return btoa(binaryString)
}

/**
 * 從密鑰字串生成 CryptoKey
 */
async function deriveKey(keyString: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(keyString)
  
  // 使用 SHA-256 將任意長度的 key 轉換為 32 bytes
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
  
  return crypto.subtle.importKey(
    'raw',
    hashBuffer,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * AES-GCM 加密
 * @param plaintext 明文
 * @param keyString 密鑰字串
 * @returns 加密後的 Base64 字串 (格式: iv:ciphertext)
 */
export async function aesEncrypt(plaintext: string, keyString: string): Promise<string> {
  if (!keyString) {
    throw new Error('AES key is required for encryption')
  }

  const key = await deriveKey(keyString)
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)
  
  // 生成隨機 IV
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  )
  
  // 將 IV 和密文組合並編碼為 Base64
  const ivBase64 = bytesToBase64(iv)
  const ciphertextBase64 = bytesToBase64(new Uint8Array(encrypted))
  
  return `${ivBase64}:${ciphertextBase64}`
}

/**
 * AES-GCM 解密
 * @param encryptedData 加密的 Base64 字串 (格式: iv:ciphertext)
 * @param keyString 密鑰字串
 * @returns 解密後的明文
 */
export async function aesDecrypt(encryptedData: string, keyString: string): Promise<string> {
  if (!keyString) {
    throw new Error('AES key is required for decryption')
  }

  const [ivBase64, ciphertextBase64] = encryptedData.split(':')
  
  if (!ivBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted data format')
  }

  const key = await deriveKey(keyString)
  const iv = base64ToBytes(ivBase64)
  const ciphertext = base64ToBytes(ciphertextBase64)
  
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    ciphertext.buffer as ArrayBuffer
  )
  
  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

/**
 * 檢查內容是否為加密格式
 */
export function isEncryptedContent(content: string): boolean {
  // 檢查是否符合 base64:base64 格式
  const parts = content.split(':')
  if (parts.length !== 2) return false
  
  // 簡單檢查是否為有效的 Base64
  const base64Regex = /^[A-Za-z0-9+/]+=*$/
  return base64Regex.test(parts[0]) && base64Regex.test(parts[1])
}

/**
 * 安全解密 - 如果 key 為空或解密失敗則返回原文
 */
export async function safeDecrypt(content: string, keyString: string | undefined): Promise<string> {
  // 沒有 key 或 key 為空字串，直接返回原文
  if (!keyString || keyString.trim() === '') {
    return content
  }
  
  // 檢查內容是否為加密格式
  if (!isEncryptedContent(content)) {
    console.warn('Content does not appear to be encrypted, returning as-is')
    return content
  }
  
  try {
    return await aesDecrypt(content, keyString)
  } catch (error) {
    console.error('Failed to decrypt content:', error)
    throw new Error('解密失敗，請確認 AES 金鑰是否正確')
  }
}

/**
 * 安全加密 - 如果 key 為空則返回原文
 */
export async function safeEncrypt(content: string, keyString: string | undefined): Promise<string> {
  // 沒有 key 或 key 為空字串，直接返回原文
  if (!keyString || keyString.trim() === '') {
    return content
  }
  
  return await aesEncrypt(content, keyString)
}
