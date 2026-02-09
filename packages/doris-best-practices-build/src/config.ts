import path from "path";

/** Root of the repository */
export const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

/** Path to the doris-best-practices skill */
export const SKILL_DIR = path.join(REPO_ROOT, "skills", "doris-best-practices");

/** Path to the rules directory */
export const RULES_DIR = path.join(SKILL_DIR, "rules");

/** Path to the generated AGENTS.md */
export const AGENTS_MD_PATH = path.join(SKILL_DIR, "AGENTS.md");

/** Path to the SKILL.md */
export const SKILL_MD_PATH = path.join(SKILL_DIR, "SKILL.md");

/** Path to metadata.json */
export const METADATA_PATH = path.join(SKILL_DIR, "metadata.json");

/** Path to _sections.md */
export const SECTIONS_PATH = path.join(RULES_DIR, "_sections.md");

/** Valid section prefixes */
export const VALID_PREFIXES = ["schema-", "query-", "ingest-", "ops-"] as const;

/** Valid impact levels */
export const VALID_IMPACTS = [
  "CRITICAL",
  "HIGH",
  "MEDIUM-HIGH",
  "MEDIUM",
  "LOW-MEDIUM",
  "LOW",
] as const;
