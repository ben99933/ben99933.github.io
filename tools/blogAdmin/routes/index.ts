import { Router } from "express";
import blogRouter from "./blog";

const router = Router();

router.use("/blog", blogRouter);
router.get("/health", (_, res) => res.json({ ok: true }));

export default router;