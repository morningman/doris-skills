# AGENTS.md — Repository-Level AI Agent Guide

This file provides guidance for AI agents working within this repository.

## Repository Structure

```
doris-skills/
├── .github/                               # CI/CD configuration
│   ├── CODEOWNERS
│   └── workflows/
├── packages/
│   └── doris-best-practices-build/        # Build tooling (TypeScript)
│       └── src/
└── skills/
    ├── doris-best-practices/              # General best practices skill
    │   ├── SKILL.md                       # Skill definition (agent discovery entry point)
    │   ├── AGENTS.md                      # Compiled rules (auto-generated)
    │   ├── metadata.json                  # Version and metadata
    │   ├── README.md                      # Maintainer guide
    │   └── rules/                         # Individual rule files
    │       ├── _sections.md               # Category definitions
    │       ├── _template.md               # New rule template
    │       └── {prefix}-{name}.md         # Rule files
    └── doris-create-table-optimization/   # CREATE TABLE optimization skill
        ├── SKILL.md                       # Skill definition (agent discovery entry point)
        ├── AGENTS.md                      # Compiled rules (auto-generated)
        ├── metadata.json                  # Version and metadata
        ├── README.md                      # Maintainer guide
        └── rules/                         # Individual rule files
            ├── _sections.md               # Category definitions
            ├── _template.md               # New rule template
            └── {prefix}-{name}.md         # Rule files
```

## Creating a New Skill

### Directory Structure

Each skill lives under `skills/{skill-name}/` and must contain:

1. **`SKILL.md`** — The agent discovery and activation entry point. Contains YAML frontmatter with `name` and `description` fields, followed by usage instructions and rule index.
2. **`metadata.json`** — Version, organization, and reference information.
3. **`README.md`** — Human-readable maintainer guide.
4. **`AGENTS.md`** — Auto-generated compiled document (do not edit manually).
5. **`rules/`** — Directory containing individual rule files.

### Naming Conventions

- Skill directories: `kebab-case` (e.g., `doris-best-practices`)
- Rule files: `{section}-{subsection}-{descriptive-name}.md` (e.g., `schema-model-choose-table-model.md`)
- Section prefixes must match those defined in `rules/_sections.md`

### SKILL.md Format

The `SKILL.md` file must have YAML frontmatter with at least:

```yaml
---
name: skill-name
description: When and how to use this skill.
license: Apache-2.0
metadata:
  author: Author Name
  version: "0.1.0"
---
```

### Rule File Format

Each rule file in `rules/` must follow this structure:

```yaml
---
title: Human-readable rule title
impact: CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM | LOW-MEDIUM | LOW
impactDescription: Brief explanation of why this impact level
tags: [tag1, tag2, tag3]
---
```

Followed by Markdown content with sections for explanation, bad examples, good examples, and references.

## Context Efficiency Best Practices

- Keep `SKILL.md` under 500 lines for fast agent loading
- Use progressive information disclosure: `SKILL.md` → specific rule → general knowledge
- Rules should be self-contained — each rule file should be understandable without reading other rules
- Use concise SQL examples with clear before/after patterns

## Impact Levels

| Level | Description |
|-------|-------------|
| **CRITICAL** | Can cause data loss, severe performance degradation, or system instability |
| **HIGH** | Significant performance impact or operational risk |
| **MEDIUM-HIGH** | Notable performance or reliability improvement |
| **MEDIUM** | Moderate improvement to performance or maintainability |
| **LOW-MEDIUM** | Minor improvement, good practice |
| **LOW** | Style preference or minor optimization |

## Development Workflow

The build tooling in `packages/doris-best-practices-build/` provides:

1. **`validate`** — Check rule file structure and frontmatter
2. **`validate-sql`** — Verify SQL examples in rules are syntactically valid
3. **`check-links`** — Verify external links in rule files are reachable
4. **`build`** — Compile all rules into the skill's `AGENTS.md`

Run the full pipeline:

```bash
cd packages/doris-best-practices-build
npm install
npm run validate
npm run validate-sql
npm run check-links
npm run build
```

## Contributing Guidelines

1. **One rule per file** — Each best practice gets its own Markdown file in `rules/`.
2. **Follow the template** — Use `rules/_template.md` as a starting point.
3. **Include examples** — Every rule should have at least one bad example and one good example with Doris SQL.
4. **Reference official docs** — Link to the relevant Apache Doris documentation.
5. **Run validation** — Ensure `npm run validate` passes before submitting.
6. **Keep impact levels accurate** — Use the impact level definitions above consistently.
