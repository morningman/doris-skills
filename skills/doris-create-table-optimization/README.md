# Doris Create Table Optimization — Maintainer Guide

This directory contains the **doris-create-table-optimization** skill, a systematic methodology for optimizing Apache Doris CREATE TABLE statements based on real-world POC experience.

## File Purposes

| File | Purpose |
|------|---------|
| `SKILL.md` | Agent discovery and activation entry point. Contains optimization flow and rule index. |
| `AGENTS.md` | Auto-generated compiled document containing all rules. **Do not edit manually.** |
| `metadata.json` | Version, organization, and reference metadata. |
| `README.md` | This file — human-readable maintainer guide. |
| `rules/_sections.md` | Defines the four rule categories and their prefixes. |
| `rules/_template.md` | Template for creating new rules. |
| `rules/*.md` | Individual rule files. |

## Rule Prefixes

| Prefix | Category | Description |
|--------|----------|-------------|
| `workload-` | Workload Analysis | Table profiling, filter/JOIN extraction, selectivity evaluation |
| `partition-` | Partitioning | Filter-driven strategy, List partition on low-NDV columns |
| `bucket-` | Bucketing | JOIN key alignment, tablet size calculation, BE node balance |
| `property-` | Properties | Inverted indexes, NOT NULL, Random bucketing for writes |

## Trigger Phrases

Rules should be activated when the agent encounters these patterns:

- **Workload**: table data volume, row count, large table identification, POC data analysis, WHERE clause, filter selectivity, NDV, JOIN key
- **Partitioning**: partition strategy, List partition, Range partition, filter-driven partition, low-NDV column
- **Bucketing**: tablet size, bucket count, BE balance, compression ratio, JOIN key as bucket key, colocate join
- **Properties**: inverted index, NOT NULL optimization, Random bucketing, write-only table

## Adding a New Rule

1. Copy `rules/_template.md` to `rules/{prefix}-{name}.md`
2. Fill in the YAML frontmatter (title, impact, impactDescription, tags)
3. Write the rule content with bad/good examples
4. Add the rule to the Quick Reference section in `SKILL.md`
5. Run validation: `cd packages/doris-create-table-optimization-build && npm run validate`
6. Run build to regenerate `AGENTS.md`: `npm run build`

## Related Documentation

- [Apache Doris Documentation](https://doris.apache.org/docs)
- [Apache Doris Data Partitioning](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
- [Apache Doris GitHub](https://github.com/apache/doris)
- [agentskills.io Specification](https://agentskills.io)
