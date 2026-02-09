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
2. **Cite rule names** — When a rule applies, reference it by name (e.g., `analyze-data-profile-tables`).
3. **Fall back to general knowledge** — If no specific rule exists, use general Doris expertise.
4. **Search documentation** — For the latest features, consult [Apache Doris docs](https://doris.apache.org/docs).

## Core Methodology

Table structure is the foundation of database performance. A well-optimized table structure can solve half of the SQL performance tuning work. Follow the **four-step optimization flow** below.

## Optimization Flow

### Step 1: Data Profiling (`analyze-`)

Before making any schema decisions, profile the data:

1. Catalog all tables with row counts and data sizes (`analyze-data-*` rules)
2. Identify the top 20% of tables by data volume — these determine query performance (80/20 rule)
3. Establish a reference table for subsequent optimization decisions

### Step 2: Filter & JOIN Analysis (`filter-`)

Analyze SQL workloads to identify optimization opportunities:

1. Extract WHERE clause filter conditions from all queries (`filter-condition-*` rules)
2. Extract JOIN keys from all queries (`filter-join-*` rules)
3. Evaluate filter selectivity — determine which conditions prune the most data
4. Prioritize columns with best selectivity for partitioning and indexing

### Step 3: Partition & Bucket Sizing (`sizing-`)

Calculate optimal partition and bucket configuration:

1. Determine partition strategy based on filter analysis (`sizing-partition-*` rules)
2. Calculate bucket count based on tablet size targets (`sizing-bucket-*` rules)
3. Ensure tablet count is divisible by BE node count for data balance (`sizing-balance-*` rules)
4. Account for compression ratio (typically 3:1 to 5:1) when estimating sizes

### Step 4: Index & Properties (`prop-`)

Apply final optimizations:

1. Add inverted indexes on filtered columns (`prop-index-*` rules)
2. Set NOT NULL on columns that never contain null values (`prop-null-*` rules)
3. Use Random bucketing for write-only tables (`prop-write-*` rules)

## Rule Categories and Priority

| Priority | Category | Prefix | Impact | Rule Count |
|----------|----------|--------|--------|------------|
| 1 | Data Profiling | `analyze-` | CRITICAL | ~2 rules |
| 2 | Filter & JOIN Analysis | `filter-` | CRITICAL | ~3 rules |
| 3 | Partition & Bucket Sizing | `sizing-` | CRITICAL | ~3 rules |
| 4 | Index & Properties | `prop-` | HIGH | ~3 rules |

## Quick Reference

Rules are organized by category. Each rule file is located in `rules/` and named using the pattern `{section}-{subsection}-{descriptive-name}.md`.

### Data Profiling (`analyze-`)

| Sub-prefix | Focus |
|------------|-------|
| `analyze-data-` | Table row counts, data volume cataloging, identifying large tables |
| `analyze-priority-` | 80/20 rule for focusing optimization on high-impact tables |

### Filter & JOIN Analysis (`filter-`)

| Sub-prefix | Focus |
|------------|-------|
| `filter-condition-` | Extracting and evaluating WHERE clause filter conditions |
| `filter-join-` | Extracting JOIN keys for bucket key selection |
| `filter-selectivity-` | Evaluating filter selectivity and NDV for partition candidates |

### Partition & Bucket Sizing (`sizing-`)

| Sub-prefix | Focus |
|------------|-------|
| `sizing-partition-` | List vs Range partition selection based on filter analysis |
| `sizing-bucket-` | Tablet size targets and bucket count calculation |
| `sizing-balance-` | BE node data balance and tablet count alignment |

### Index & Properties (`prop-`)

| Sub-prefix | Focus |
|------------|-------|
| `prop-index-` | Inverted index on filtered columns |
| `prop-null-` | NOT NULL constraints for columns without null values |
| `prop-write-` | Random bucketing for write-only / ingestion tables |

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
