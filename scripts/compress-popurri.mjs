import { createGzip } from "zlib";
import { createReadStream, createWriteStream, readdirSync, statSync } from "fs";
import { join } from "path";

const dir = "dist/_astro";
try {
  for (const f of readdirSync(dir)) {
    if (f.endsWith(".json")) {
      const p = join(dir, f);
      const gz = p + ".gz";
      if (statSync(p).size > 50000) {
        await new Promise((res, rej) => {
          createReadStream(p).pipe(createGzip()).pipe(createWriteStream(gz)).on("finish", res).on("error", rej);
        });
        console.log(`gzipped ${f}`);
      }
    }
  }
} catch {}
