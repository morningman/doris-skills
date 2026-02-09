import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { RULES_DIR, VALID_PREFIXES, VALID_IMPACTS } from "./config";
import { ValidationError } from "./types";

/**
 * Validate all rule files in the rules directory.
 * Checks frontmatter structure, required fields, and naming conventions.
 */
async function validate(): Promise<void> {
  console.log("Validating rule files...");

  const ruleFiles = await glob("*.md", {
    cwd: RULES_DIR,
    ignore: ["_*.md"],
    absolute: true,
  });

  const errors: ValidationError[] = [];

  for (const filePath of ruleFiles) {
    const filename = filePath.split("/").pop() || "";

    // Check filename prefix
    const hasValidPrefix = VALID_PREFIXES.some((p) => filename.startsWith(p));
    if (!hasValidPrefix) {
      errors.push({
        file: filename,
        message: `Filename must start with one of: ${VALID_PREFIXES.join(", ")}`,
      });
    }

    // Parse frontmatter
    const raw = fs.readFileSync(filePath, "utf-8");
    let data: Record<string, unknown>;
    try {
      ({ data } = matter(raw));
    } catch {
      errors.push({
        file: filename,
        message: "Failed to parse YAML frontmatter",
      });
      continue;
    }

    // Check required fields
    if (!data.title || typeof data.title !== "string") {
      errors.push({ file: filename, message: "Missing or invalid 'title' in frontmatter" });
    }

    if (!data.impact || !VALID_IMPACTS.includes(data.impact as any)) {
      errors.push({
        file: filename,
        message: `Invalid 'impact': must be one of ${VALID_IMPACTS.join(", ")}`,
      });
    }

    if (!data.impactDescription || typeof data.impactDescription !== "string") {
      errors.push({
        file: filename,
        message: "Missing or invalid 'impactDescription' in frontmatter",
      });
    }

    if (!Array.isArray(data.tags) || data.tags.length === 0) {
      errors.push({
        file: filename,
        message: "Missing or empty 'tags' array in frontmatter",
      });
    }
  }

  if (errors.length > 0) {
    console.error(`\nFound ${errors.length} validation error(s):\n`);
    for (const err of errors) {
      console.error(`  ${err.file}: ${err.message}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${ruleFiles.length} rule file(s) — all passed.`);
}

validate().catch((err) => {
  console.error("Validation failed:", err);
  process.exit(1);
});
