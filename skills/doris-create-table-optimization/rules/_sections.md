---
title: Rule Sections
description: Defines the four major rule categories for Doris Create Table Optimization
---

# Rule Sections

This file defines the four major categories used to organize rules in the doris-create-table-optimization skill.

## Sections

| # | Category | Prefix | Impact | Description |
|---|----------|--------|--------|-------------|
| 1 | Workload Analysis | `workload-` | CRITICAL | Catalog tables with row counts and data volumes, identify high-impact large tables, extract and evaluate WHERE clause filters and JOIN keys |
| 2 | Partitioning | `partition-` | CRITICAL | Choose partition strategy driven by actual filter patterns, use List partitioning on low-NDV high-selectivity columns |
| 3 | Bucketing | `bucket-` | CRITICAL | Align bucket keys with JOIN keys, calculate bucket count using tablet size targets (1-5 GB), balance tablets across BE nodes |
| 4 | Properties | `property-` | HIGH | Apply inverted indexes on filtered columns, set NOT NULL constraints, use Random bucketing for write-only tables |

## Sub-prefixes

### Workload Analysis (`workload-`)

| Sub-prefix | Focus |
|------------|-------|
| `workload-profile-` | Cataloging tables with row counts, data volumes, and SQL occurrence |
| `workload-prioritize-` | Applying the 80/20 rule to focus on high-impact large tables |
| `workload-extract-` | Extracting WHERE clause filters and JOIN keys, evaluating selectivity and NDV |

### Partitioning (`partition-`)

| Sub-prefix | Focus |
|------------|-------|
| `partition-filter-` | Choosing between List and Range partitioning based on filter analysis |
| `partition-list-` | Using low-NDV high-selectivity columns as List partition keys |

### Bucketing (`bucket-`)

| Sub-prefix | Focus |
|------------|-------|
| `bucket-align-` | Aligning bucket keys with JOIN keys for colocate/bucket shuffle join |
| `bucket-tablet-` | Calculating bucket count with tablet size target of 1-5 GB |
| `bucket-balance-` | Aligning tablet count with BE node count for even data distribution |

### Properties (`property-`)

| Sub-prefix | Focus |
|------------|-------|
| `property-inverted-` | Adding inverted indexes on columns used in WHERE clauses |
| `property-not-null-` | Setting NOT NULL on columns that never contain null values |
| `property-random-` | Using Random bucketing for write-only / ingestion-only tables |
