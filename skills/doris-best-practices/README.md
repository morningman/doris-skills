# Doris Best Practices — Maintainer Guide

This directory contains the **doris-best-practices** skill, a curated set of rules for Apache Doris schema design, query optimization, data ingestion, and operations.

## File Purposes

| File | Purpose |
|------|---------|
| `SKILL.md` | Agent discovery and activation entry point. Contains rule index and usage instructions. |
| `AGENTS.md` | Auto-generated compiled document containing all rules. **Do not edit manually.** |
| `metadata.json` | Version, organization, and reference metadata. |
| `README.md` | This file — human-readable maintainer guide. |
| `rules/_sections.md` | Defines the four rule categories and their prefixes. |
| `rules/_template.md` | Template for creating new rules. |
| `rules/*.md` | Individual rule files. |

## Rule Prefixes

| Prefix | Category | Description |
|--------|----------|-------------|
| `schema-` | Schema Design | Table models, partitioning, bucketing, types, indexes |
| `query-` | Query Optimization | JOINs, materialized views, profiling, pruning |
| `ingest-` | Data Ingestion | Stream Load, Broker Load, Routine Load, Group Commit |
| `ops-` | Operations | Compaction, tablets, replicas, FE config, backup |

## Trigger Phrases

Rules should be activated when the agent encounters these patterns:

- **Schema**: `CREATE TABLE`, `ALTER TABLE`, `DUPLICATE KEY`, `AGGREGATE KEY`, `UNIQUE KEY`, `PRIMARY KEY`, `DISTRIBUTED BY HASH`, `PARTITION BY RANGE`, `PARTITION BY LIST`
- **Query**: `SELECT`, `JOIN`, `EXPLAIN`, `PROFILE`, `CREATE MATERIALIZED VIEW`, query performance, slow query
- **Ingestion**: `Stream Load`, `Broker Load`, `Routine Load`, `INSERT INTO SELECT`, `Group Commit`, `max_filter_ratio`, `curl -T`
- **Operations**: `compaction`, `tablet`, `replica`, `fe.conf`, `be.conf`, `ADMIN`, `BACKUP`, `RESTORE`

## Adding a New Rule

1. Copy `rules/_template.md` to `rules/{prefix}-{name}.md`
2. Fill in the YAML frontmatter (title, impact, impactDescription, tags)
3. Write the rule content with bad/good examples
4. Add the rule to the Quick Reference section in `SKILL.md`
5. Run validation: `cd packages/doris-best-practices-build && npm run validate`
6. Run build to regenerate `AGENTS.md`: `npm run build`

## Related Documentation

- [Apache Doris Documentation](https://doris.apache.org/docs)
- [Apache Doris GitHub](https://github.com/apache/doris)
- [agentskills.io Specification](https://agentskills.io)
