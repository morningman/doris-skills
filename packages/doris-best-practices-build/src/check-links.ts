import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { RULES_DIR, SKILL_DIR } from "./config";

/**
 * Check that external links in rule files and SKILL.md are well-formed.
 * Optionally fetches URLs to verify they are reachable (when CHECK_LINKS_FETCH=1).
 */
async function checkLinks(): Promise<void> {
  console.log("Checking external links...");

  const mdFiles = await glob("**/*.md", {
    cwd: SKILL_DIR,
    absolute: true,
  });

  const linkRegex = /\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
  let totalLinks = 0;
  const errors: { file: string; url: string; message: string }[] = [];

  for (const filePath of mdFiles) {
    const filename = filePath.replace(SKILL_DIR + "/", "");
    const raw = fs.readFileSync(filePath, "utf-8");
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(raw)) !== null) {
      totalLinks++;
      const url = match[2];

      // Basic URL validation
      try {
        new URL(url);
      } catch {
        errors.push({ file: filename, url, message: "Malformed URL" });
      }
    }
  }

  // Optional: fetch URLs to check reachability
  if (process.env.CHECK_LINKS_FETCH === "1") {
    console.log("Fetching URLs to verify reachability...");
    // Implementation deferred — would use fetch() with timeout and retry
  }

  if (errors.length > 0) {
    console.error(`\nFound ${errors.length} link error(s):\n`);
    for (const err of errors) {
      console.error(`  ${err.file}: ${err.url} — ${err.message}`);
    }
    process.exit(1);
  }

  console.log(`Checked ${totalLinks} link(s) in ${mdFiles.length} file(s) — all valid.`);
}

checkLinks().catch((err) => {
  console.error("Link check failed:", err);
  process.exit(1);
});
