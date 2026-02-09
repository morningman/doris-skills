---
title: Rule Sections
description: Defines the four major rule categories for Doris Create Table Optimization
---

# Rule Sections

This file defines the four major categories used to organize rules in the doris-create-table-optimization skill.

## Sections

| # | Category | Prefix | Impact | Description |
|---|----------|--------|--------|-------------|
| 1 | Data Profiling | `analyze-` | CRITICAL | Catalog tables with row counts and data volumes, identify the top 20% large tables that determine query performance |
| 2 | Filter & JOIN Analysis | `filter-` | CRITICAL | Extract WHERE clause filters and JOIN keys from SQL workloads, evaluate selectivity and NDV for partition/index candidates |
| 3 | Partition & Bucket Sizing | `sizing-` | CRITICAL | Calculate partition strategy, bucket count, tablet size targets (1-5 GB), ensure tablet count aligns with BE node count |
| 4 | Index & Properties | `prop-` | HIGH | Apply inverted indexes on filtered columns, set NOT NULL constraints, use Random bucketing for write-only tables |

## Sub-prefixes

### Data Profiling (`analyze-`)

| Sub-prefix | Focus |
|------------|-------|
| `analyze-data-` | Cataloging tables with row counts, data volumes, and SQL occurrence |
| `analyze-priority-` | Applying the 80/20 rule to focus on high-impact large tables |

### Filter & JOIN Analysis (`filter-`)

| Sub-prefix | Focus |
|------------|-------|
| `filter-condition-` | Extracting and listing WHERE clause filter conditions per table |
| `filter-join-` | Extracting JOIN keys for bucket key and colocate group selection |
| `filter-selectivity-` | Evaluating filter selectivity, NDV, and list partition candidates |

### Partition & Bucket Sizing (`sizing-`)

| Sub-prefix | Focus |
|------------|-------|
| `sizing-partition-` | Choosing between List and Range partitioning based on filter analysis |
| `sizing-bucket-` | Calculating bucket count with tablet size target of 1-5 GB |
| `sizing-balance-` | Aligning tablet count with BE node count for even data distribution |

### Index & Properties (`prop-`)

| Sub-prefix | Focus |
|------------|-------|
| `prop-index-` | Adding inverted indexes on columns used in WHERE clauses |
| `prop-null-` | Setting NOT NULL on columns that never contain null values |
| `prop-write-` | Using Random bucketing for write-only / ingestion-only tables |
