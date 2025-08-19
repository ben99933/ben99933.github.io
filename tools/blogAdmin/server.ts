import express from "express";
import cors from "cors";
import routes from "./routes";
import { initBlogDirs } from "./services/BlogService";
import {PROJECT_ROOT, BLOGDB_ROOT} from "./services/BlogService"

async function main() {
  await initBlogDirs();

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use("/api", routes);

  const PORT = Number(process.env.PORT) || 3030;
  app.listen(PORT, () => {
    console.log(`Blog Admin API running at http://localhost:${PORT}`);
  });
}

main();
console.log(`PROJECT_ROOT: ${PROJECT_ROOT}`);
console.log(`BLOGDB_ROOT: ${BLOGDB_ROOT}`);