import express from "express";
import fs from "fs/promises";
import crypto from "crypto";
import {
  loadIndexList,
  saveIndexList,
  readPostData,
  metaPathFor,
  mdPathFor,
  imgDirFor,
  relMetaPath,
} from "../services/BlogService";

import { ensureDir, writeJson } from "../lib/FsHelper";
import { ModelBlogPostData } from "../Models/ModelBlogPost";
import { BlogPostMetadata } from '@/utils/Blog/BlogPostItem';
import path from "path";
import { title } from "process";

const router = express.Router();

router.get("/all", async (_, res) => {
  try {
    const list = await loadIndexList();
    const posts: BlogPostMetadata[] = [];
    for (const metaRel of list) {
      const data = await readPostData(metaRel);
      if (data) posts.push(data.meta);
    }
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:uuid", async (req, res) => {
  
  console.log(`Fetching post with UUID: ${req.params.uuid}`);
  const list = await loadIndexList();
  for (const metaRel of list) {
    const data = await readPostData(metaRel);
    if (data?.meta?.UUID === req.params.uuid) return res.json(data);
  }
  res.status(404).json({ error: "not found" });
});

router.post("/", async (req, res) => {
  console.log("Received POST request to /api/blog");
  console.log("Request body:", req.body);
  try {
    const { metadata, content } = req.body as ModelBlogPostData;
    if (!metadata.title) {
      return res.status(400).json({ error: "title 為必填" });
    }
    if (!metadata.UUID || !metadata.date) {
      return res.status(400).json({ error: "UUID 和 date 為必填" });
    }

    const uuid = metadata.UUID;
    const metaAbs = metaPathFor(metadata.date, uuid);
    const mdAbs = mdPathFor(metadata.date, uuid);
    const imgDir = imgDirFor(metadata.date, uuid);

    await ensureDir(path.dirname(metaAbs));
    await ensureDir(path.dirname(mdAbs));
    await ensureDir(imgDir);

    const meta: BlogPostMetadata = {
      UUID: uuid,
      title: metadata.title,
      date: metadata.date,
      tags: metadata.tags || [],
      description: metadata.description || "",
      img: metadata.img || "",
    };

    await writeJson(metaAbs, meta);
    await fs.writeFile(mdAbs, content, "utf-8");

    const metaRel = relMetaPath(meta.date, uuid);
    const list = (await loadIndexList()).filter(async p => {
      const data = await readPostData(p);
      return data?.meta?.UUID !== uuid;
    });

    list.push(metaRel);
    await saveIndexList(list);
    res.json({ ok: true, UUID: uuid, meta });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:uuid", async (req, res) => {
  console.log(`Received DELETE request for UUID: ${req.params.uuid}`);
  const { uuid } = req.params;
  const list = await loadIndexList();

  let removed = false;
  const remain: string[] = [];

  for (const metaRel of list) {
    const data = await readPostData(metaRel);
    if (data?.meta?.UUID === uuid) {
      await fs.rm(metaPathFor(data.meta.date, uuid), { force: true });
      await fs.rm(mdPathFor(data.meta.date, uuid), { force: true });
      removed = true;
    } else {
      remain.push(metaRel);
    }
  }

  await saveIndexList(remain);
  res.json({ ok: true, removed });
});

export default router;