import fs from "fs";
import matter from "gray-matter";
import { ParsedRule, RuleFrontmatter, SectionPrefix } from "./types";
import { VALID_PREFIXES } from "./config";

/**
 * Parse a rule Markdown file with YAML frontmatter.
 * Returns the parsed frontmatter and body content.
 */
export function parseRuleFile(filePath: string): ParsedRule | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const filename = filePath.split("/").pop() || "";

  // Determine section from filename prefix
  const section = VALID_PREFIXES.find((prefix) =>
    filename.startsWith(prefix)
  ) as SectionPrefix | undefined;

  if (!section) {
    return null;
  }

  const frontmatter: RuleFrontmatter = {
    title: data.title || "",
    impact: data.impact || "MEDIUM",
    impactDescription: data.impactDescription || "",
    tags: data.tags || [],
  };

  return {
    filename,
    frontmatter,
    content: content.trim(),
    section,
  };
}

/**
 * Parse the _sections.md metadata file.
 * Returns the raw content (section definitions are human-readable tables).
 */
export function parseSectionsFile(filePath: string): string {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);
  return content.trim();
}
