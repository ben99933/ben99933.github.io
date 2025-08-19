import fs from "fs/promises"
import path from "path"

export const ensureDir = async (p: string) => {
  await fs.mkdir(p, { recursive: true })
}

export const readJsonSafe = async <T>(file: string, fallback: T): Promise<T> => {
  try {
    const buf = await fs.readFile(file)
    const s = new TextDecoder("utf-8", { fatal: false }).decode(buf)
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

export const writeJson = async (file: string, obj: unknown) => {
  const s = JSON.stringify(obj, null, 4)
  const buf = new TextEncoder().encode(s)
  await ensureDir(path.dirname(file))
  await fs.writeFile(file, buf)
}