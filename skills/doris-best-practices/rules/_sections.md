---
title: Rule Sections
description: Defines the four major rule categories for Doris Best Practices
---

# Rule Sections

This file defines the four major categories used to organize rules in the doris-best-practices skill.

## Sections

| # | Category | Prefix | Impact | Description |
|---|----------|--------|--------|-------------|
| 1 | Schema Design | `schema-` | CRITICAL | Table model selection (Duplicate/Aggregate/Unique/Primary Key), partitioning strategy, bucket configuration, data type choices, index usage |
| 2 | Query Optimization | `query-` | CRITICAL | JOIN strategy selection (broadcast/shuffle/colocate), materialized view design, query profile analysis, partition pruning |
| 3 | Data Ingestion | `ingest-` | CRITICAL | Stream Load, Broker Load, Routine Load, Group Commit, batch tuning, error handling, schema mapping |
| 4 | Operations | `ops-` | HIGH | Compaction tuning, tablet management, replica strategy, FE configuration, backup and restore |

## Sub-prefixes

### Schema Design (`schema-`)

| Sub-prefix | Focus |
|------------|-------|
| `schema-model-` | Choosing between Duplicate, Aggregate, Unique, and Primary Key models |
| `schema-partition-` | Range partitioning, list partitioning, dynamic partitions |
| `schema-bucket-` | Hash bucket key selection, bucket count, auto bucketing |
| `schema-types-` | Data type selection, VARCHAR vs STRING, DECIMAL precision |
| `schema-index-` | Bloom filter index, bitmap index, inverted index |

### Query Optimization (`query-`)

| Sub-prefix | Focus |
|------------|-------|
| `query-join-` | Broadcast join, shuffle join, colocate join, bucket shuffle join |
| `query-mv-` | Materialized view creation, automatic query rewriting |
| `query-profile-` | Query profile reading, bottleneck identification |
| `query-partition-` | Partition pruning, predicate pushdown |
| `query-column-` | Column pruning, avoiding SELECT *, projection pushdown |

### Data Ingestion (`ingest-`)

| Sub-prefix | Focus |
|------------|-------|
| `ingest-stream-` | Stream Load via HTTP, Group Commit mode, streaming parameters |
| `ingest-broker-` | Broker Load for HDFS/S3/GCS bulk imports |
| `ingest-routine-` | Routine Load from Kafka, consumer configuration |
| `ingest-batch-` | Batch size tuning, load frequency, micro-batch patterns |
| `ingest-insert-` | INSERT INTO SELECT, INSERT INTO VALUES patterns |
| `ingest-error-` | Error handling, max_filter_ratio, error log analysis |
| `ingest-schema-` | Column mapping, WHERE filtering, data transformation during load |

### Operations (`ops-`)

| Sub-prefix | Focus |
|------------|-------|
| `ops-compaction-` | Cumulative compaction, base compaction, compaction score tuning |
| `ops-tablet-` | Tablet size planning, tablet count limits, tablet repair |
| `ops-replica-` | Replica count selection, rack-aware placement, replica repair |
| `ops-fe-` | FE configuration, metadata management, FE high availability |
| `ops-backup-` | Backup to remote storage, incremental backup, restore procedures |

## Key Differences from ClickHouse Agent Skills

- **4 categories** instead of 3 (ClickHouse uses schema/query/insert)
- **`ingest-` prefix** instead of `insert-` — Doris primarily uses Load operations (Stream Load, Broker Load, Routine Load) rather than INSERT statements
- **`schema-model-` sub-prefix** — Doris has four distinct table models (Duplicate, Aggregate, Unique, Primary Key) that fundamentally affect data behavior
- **`ops-` category** — Doris compaction and tablet management require dedicated operational guidance
