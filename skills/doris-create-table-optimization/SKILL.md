---
name: doris-create-table-optimization
description: MUST USE when optimizing Apache Doris CREATE TABLE statements for POC or production scenarios. Provides a systematic methodology for analyzing SQL workloads, selecting partition/bucket strategies, sizing tablets, and applying index optimizations to maximize query performance.
license: Apache-2.0
metadata:
  author: Apache Doris Community
  version: "0.1.0"
---

# Doris Create Table Optimization

## How to Apply This Skill

When optimizing Apache Doris table structures for query performance:

1. **Check rules first** — Search the `rules/` directory for applicable optimization rules before giving general advice.
2. **Cite rule names** — When a rule applies, reference it by name (e.g., `workload-profile-table-volumes`).
3. **Fall back to general knowledge** — If no specific rule exists, use general Doris expertise.
4. **Search documentation** — For the latest features, consult [Apache Doris docs](https://doris.apache.org/docs).

## Core Methodology

Table structure is the foundation of database performance. A well-optimized table structure can solve half of the SQL performance tuning work. Follow the **four-step optimization flow** below.

## Optimization Flow

### Step 1: Workload Analysis (`workload-`)

Before making any schema decisions, profile the data and analyze SQL workloads:

1. Catalog all tables with row counts and data sizes (`workload-profile-*` rules)
2. Identify the top 20% of tables by data volume — these determine query performance (`workload-prioritize-*` rules)
3. Extract WHERE clause filters and JOIN keys, evaluate selectivity (`workload-extract-*` rules)

### Step 2: Partitioning (`partition-`)

Choose the right partition strategy based on workload analysis:

1. Determine partition strategy based on actual filter patterns, not convention (`partition-filter-*` rules)
2. Use List partitioning on low-NDV high-selectivity columns (`partition-list-*` rules)

### Step 3: Bucketing (`bucket-`)

Calculate optimal bucket configuration:

1. Align bucket keys with JOIN keys for efficient join strategies (`bucket-align-*` rules)
2. Calculate bucket count based on tablet size targets of 1-5 GB (`bucket-tablet-*` rules)
3. Ensure tablet count is divisible by BE node count for data balance (`bucket-balance-*` rules)

### Step 4: Properties (`property-`)

Apply final optimizations:

1. Add inverted indexes on filtered columns (`property-inverted-*` rules)
2. Set NOT NULL on columns that never contain null values (`property-not-null-*` rules)
3. Use Random bucketing for write-only tables (`property-random-*` rules)

## Rule Categories and Priority

| Priority | Category | Prefix | Impact | Rule Count |
|----------|----------|--------|--------|------------|
| 1 | Workload Analysis | `workload-` | CRITICAL | ~3 rules |
| 2 | Partitioning | `partition-` | CRITICAL | ~2 rules |
| 3 | Bucketing | `bucket-` | CRITICAL | ~3 rules |
| 4 | Properties | `property-` | HIGH | ~3 rules |

## Quick Reference

Rules are organized by category. Each rule file is located in `rules/` and named using the pattern `{section}-{subsection}-{descriptive-name}.md`.

### Workload Analysis (`workload-`)

| Sub-prefix | Focus |
|------------|-------|
| `workload-profile-` | Table row counts, data volume cataloging, identifying large tables |
| `workload-prioritize-` | 80/20 rule for focusing optimization on high-impact tables |
| `workload-extract-` | Extracting and evaluating WHERE clause filters, JOIN keys, and selectivity |

### Partitioning (`partition-`)

| Sub-prefix | Focus |
|------------|-------|
| `partition-filter-` | Choosing partition strategy based on actual filter patterns |
| `partition-list-` | Using low-NDV high-selectivity columns as List partition keys |

### Bucketing (`bucket-`)

| Sub-prefix | Focus |
|------------|-------|
| `bucket-align-` | Aligning bucket keys with JOIN keys for colocate/bucket shuffle join |
| `bucket-tablet-` | Tablet size targets and bucket count calculation |
| `bucket-balance-` | BE node data balance and tablet count alignment |

### Properties (`property-`)

| Sub-prefix | Focus |
|------------|-------|
| `property-inverted-` | Inverted index on filtered columns |
| `property-not-null-` | NOT NULL constraints for columns without null values |
| `property-random-` | Random bucketing for write-only / ingestion tables |

## Activation Triggers

This skill should be activated when the AI agent encounters:

- Requests to optimize Doris `CREATE TABLE` statements for query performance
- POC (Proof of Concept) or performance benchmarking scenarios involving Doris
- Questions about choosing partition or bucket strategies based on SQL workloads
- Tablet sizing or tablet count planning discussions
- Questions about how many buckets or partitions to use
- Filter condition analysis for schema optimization
- References to `DISTRIBUTED BY HASH`, `PARTITION BY RANGE`, `PARTITION BY LIST` with optimization intent
- Discussions about data volume, compression ratio, or tablet balance across BE nodes
