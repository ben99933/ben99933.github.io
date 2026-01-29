import path from "path";
import fs from "fs/promises";
import {BlogPostMetadata} from '@/utils/Blog/BlogPostItem';
import { readJsonSafe, writeJson, ensureDir } from "../lib/FsHelper";

export const PROJECT_ROOT = path.resolve(__dirname, "../../../");
export const BLOGDB_ROOT = path.join(PROJECT_ROOT, "public", "blogDB");
export const META_ROOT = path.join(BLOGDB_ROOT, "metadata");
export const POST_ROOT = path.join(BLOGDB_ROOT, "post");
export const IMAGE_ROOT = path.join(BLOGDB_ROOT, "images");
export const INDEX_JSON = path.join(BLOGDB_ROOT, "index.json");

export const yyyymm = (dateStr?: string) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
};

export const mdPathFor = (dateStr: string, uuid: string) => path.join(POST_ROOT, yyyymm(dateStr), `${uuid}.md`);
export const metaPathFor = (dateStr: string, uuid: string) => path.join(META_ROOT, yyyymm(dateStr), `${uuid}.json`);
export const imgDirFor = (dateStr: string, uuid: string) => path.join(IMAGE_ROOT, yyyymm(dateStr), uuid);
export const relMetaPath = (dateStr: string, uuid: string) => `${yyyymm(dateStr)}/${uuid}.json`;

export const loadIndexList = async (): Promise<string[]> => {
  const arr = await readJsonSafe<string[] | unknown>(INDEX_JSON, []);
  return Array.isArray(arr) ? (arr as string[]) : [];
};

export const saveIndexList = async (list: string[]) => {
  const uniq = [...new Set(list)];
  await writeJson(INDEX_JSON, uniq);
};

export const readPostData = async (metaRelPath: string): Promise<{ meta: BlogPostMetadata; content: string } | null> => {
    const metaAbs = path.join(META_ROOT, metaRelPath);
    const meta = await readJsonSafe<BlogPostMetadata | null>(metaAbs, null);
    if (!meta) return null;
    const mdAbs = mdPathFor(meta.date, meta.UUID);
    let content = "";
    try { 
        content = await fs.readFile(mdAbs, "utf-8"); 
    } 
    catch {
        console.error(`Failed to read post content from ${mdAbs}`);
        content = ""; // Default to empty content if reading fails
    }
    return { meta, content };
};

export const initBlogDirs = async () => {
  await ensureDir(BLOGDB_ROOT);
  await ensureDir(META_ROOT);
  await ensureDir(POST_ROOT);
  await ensureDir(IMAGE_ROOT);
  if (!(await readJsonSafe(INDEX_JSON, null))) await writeJson(INDEX_JSON, []);
};
