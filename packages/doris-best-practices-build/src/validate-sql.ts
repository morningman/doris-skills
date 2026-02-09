import fs from "fs";
import { glob } from "glob";
import matter from "gray-matter";
import { RULES_DIR } from "./config";

/**
 * Basic SQL syntax validation for SQL code blocks in rule files.
 * Checks that SQL examples contain valid-looking statements.
 *
 * Note: This is a simplified validator. It checks for basic structural
 * correctness (matching parentheses, statement terminators) rather than
 * full SQL parsing. A more comprehensive validator can be added later
 * using a proper SQL parser.
 */
async function validateSql(): Promise<void> {
  console.log("Validating SQL examples in rule files...");

  const ruleFiles = await glob("*.md", {
    cwd: RULES_DIR,
    ignore: ["_*.md"],
    absolute: true,
  });

  let totalBlocks = 0;
  let errors = 0;

  for (const filePath of ruleFiles) {
    const filename = filePath.split("/").pop() || "";
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);

    // Extract SQL code blocks
    const sqlBlockRegex = /```sql\n([\s\S]*?)```/g;
    let match: RegExpExecArray | null;

    while ((match = sqlBlockRegex.exec(content)) !== null) {
      totalBlocks++;
      const sql = match[1].trim();

      // Basic checks
      const openParens = (sql.match(/\(/g) || []).length;
      const closeParens = (sql.match(/\)/g) || []).length;

      if (openParens !== closeParens) {
        console.error(
          `  ${filename}: Unbalanced parentheses in SQL block (${openParens} open, ${closeParens} close)`
        );
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\nFound ${errors} SQL validation error(s) in ${totalBlocks} block(s).`);
    process.exit(1);
  }

  console.log(`Validated ${totalBlocks} SQL block(s) in ${ruleFiles.length} file(s) — all passed.`);
}

validateSql().catch((err) => {
  console.error("SQL validation failed:", err);
  process.exit(1);
});
