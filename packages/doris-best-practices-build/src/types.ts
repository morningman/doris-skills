/** Impact level for a rule */
export type Impact =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM-HIGH"
  | "MEDIUM"
  | "LOW-MEDIUM"
  | "LOW";

/** Section prefix */
export type SectionPrefix = "schema-" | "query-" | "ingest-" | "ops-";

/** YAML frontmatter for a rule file */
export interface RuleFrontmatter {
  title: string;
  impact: Impact;
  impactDescription: string;
  tags: string[];
}

/** Parsed rule with frontmatter and content */
export interface ParsedRule {
  filename: string;
  frontmatter: RuleFrontmatter;
  content: string;
  section: SectionPrefix;
}

/** Metadata from metadata.json */
export interface SkillMetadata {
  version: string;
  organization: string;
  date: string;
  dorisVersion: string;
  abstract: string;
  references: string[];
}

/** Validation error */
export interface ValidationError {
  file: string;
  message: string;
  line?: number;
}
