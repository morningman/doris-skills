---
name: doris-best-practices
description: MUST USE when reviewing Apache Doris schemas, queries, or configurations. Provides comprehensive best practices for table model selection, partitioning, bucketing, query optimization, data ingestion, and cluster operations.
license: Apache-2.0
metadata:
  author: Apache Doris Community
  version: "0.1.0"
---

# Doris Best Practices

## How to Apply This Skill

When working with Apache Doris SQL or configuration:

1. **Check rules first** — Search the `rules/` directory for applicable best practices before giving general advice.
2. **Cite rule names** — When a rule applies, reference it by name (e.g., `schema-model-choose-table-model`).
3. **Fall back to general knowledge** — If no specific rule exists, use general Doris expertise.
4. **Search documentation** — For the latest features, consult [Apache Doris docs](https://doris.apache.org/docs).

## Review Flows

### Schema Review

When reviewing `CREATE TABLE` statements or schema changes:

1. Check table model selection (`schema-model-*` rules)
2. Validate partition strategy (`schema-partition-*` rules)
3. Verify bucket configuration (`schema-bucket-*` rules)
4. Review data type choices (`schema-types-*` rules)
5. Evaluate index usage (`schema-index-*` rules)

### Query Review

When reviewing SELECT queries or query performance:

1. Analyze JOIN strategies (`query-join-*` rules)
2. Consider materialized views (`query-mv-*` rules)
3. Check partition pruning (`query-partition-*` rules)
4. Review column selection (`query-column-*` rules)
5. Suggest query profiling (`query-profile-*` rules)

### Ingestion Review

When reviewing data loading operations:

1. Evaluate load method selection (`ingest-stream-*`, `ingest-broker-*`, `ingest-routine-*` rules)
2. Check batch size and frequency (`ingest-batch-*` rules)
3. Review error handling (`ingest-error-*` rules)
4. Validate schema mapping (`ingest-schema-*` rules)
5. Consider Group Commit for high-frequency small writes (`ingest-stream-*` rules)

### Operations Review

When reviewing cluster configuration or maintenance:

1. Check compaction settings (`ops-compaction-*` rules)
2. Review tablet management (`ops-tablet-*` rules)
3. Validate replica strategy (`ops-replica-*` rules)
4. Evaluate FE configuration (`ops-fe-*` rules)
5. Review backup procedures (`ops-backup-*` rules)

## Rule Categories and Priority

| Priority | Category | Prefix | Impact | Rule Count |
|----------|----------|--------|--------|------------|
| 1 | Schema Design | `schema-` | CRITICAL | ~12 rules |
| 2 | Query Optimization | `query-` | CRITICAL | ~10 rules |
| 3 | Data Ingestion | `ingest-` | CRITICAL | ~10 rules |
| 4 | Operations | `ops-` | HIGH | ~8 rules |

## Quick Reference

Rules are organized by category. Each rule file is located in `rules/` and named using the pattern `{section}-{subsection}-{descriptive-name}.md`.

### Schema Design (`schema-`)

| Sub-prefix | Focus |
|------------|-------|
| `schema-model-` | Table model selection (Duplicate, Aggregate, Unique, Primary Key) |
| `schema-partition-` | Range/List partitioning, dynamic partitions |
| `schema-bucket-` | Hash bucketing, bucket count, auto bucket |
| `schema-types-` | Data type selection, string vs numeric, DECIMAL precision |
| `schema-index-` | Bloom filter, bitmap, inverted indexes |

### Query Optimization (`query-`)

| Sub-prefix | Focus |
|------------|-------|
| `query-join-` | Broadcast vs shuffle vs colocate join |
| `query-mv-` | Materialized view creation and selection |
| `query-profile-` | Query profile analysis and tuning |
| `query-partition-` | Partition pruning optimization |
| `query-column-` | Column pruning, avoid SELECT * |

### Data Ingestion (`ingest-`)

| Sub-prefix | Focus |
|------------|-------|
| `ingest-stream-` | Stream Load, HTTP streaming, Group Commit |
| `ingest-broker-` | Broker Load for HDFS/S3 bulk imports |
| `ingest-routine-` | Routine Load from Kafka |
| `ingest-batch-` | Batch size tuning, load frequency |
| `ingest-insert-` | INSERT INTO SELECT patterns |
| `ingest-error-` | Error handling, max_filter_ratio |
| `ingest-schema-` | Column mapping, data transformation |

### Operations (`ops-`)

| Sub-prefix | Focus |
|------------|-------|
| `ops-compaction-` | Compaction tuning, cumulative vs base |
| `ops-tablet-` | Tablet size, count, management |
| `ops-replica-` | Replica count, placement, repair |
| `ops-fe-` | FE configuration, metadata management |
| `ops-backup-` | Backup and restore strategies |

## Activation Triggers

This skill should be activated when the AI agent encounters:

- `CREATE TABLE` statements with Doris-specific syntax (e.g., `DUPLICATE KEY`, `AGGREGATE KEY`, `UNIQUE KEY`, `PRIMARY KEY`)
- Questions about choosing a table model in Doris
- `Stream Load`, `Broker Load`, or `Routine Load` operations
- Doris query performance issues or `EXPLAIN` output
- Compaction, tablet, or replica management discussions
- References to `doris`, `fe.conf`, `be.conf`, or Doris-specific functions
- Partitioning with `PARTITION BY RANGE` or `PARTITION BY LIST` in Doris context
- Bucketing with `DISTRIBUTED BY HASH`
