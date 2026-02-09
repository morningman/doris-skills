---
title: "Apply 80/20 Rule — Focus on High-Impact Large Tables"
impact: CRITICAL
impactDescription: "20% of tables by data volume determine the vast majority of query performance; misallocating optimization effort wastes time and may leave the real bottlenecks unaddressed"
tags: [workload, priority, large-tables, pareto]
---

# Apply 80/20 Rule — Focus on High-Impact Large Tables

## Description

After profiling all tables, apply the **80/20 rule (Pareto principle)**: the top 20% of tables by data volume determine the performance of your SQL queries. Focus your CREATE TABLE optimization efforts on these large tables first.

Small dimension tables (a few thousand rows, single-digit MB) rarely benefit from partition or bucket tuning. Over-optimizing them wastes effort and adds unnecessary complexity.

## Bad Example

Spending equal effort on all tables regardless of size:

```sql
-- DON'T: Spend time optimizing a 5MB dimension table with partitions and indexes
CREATE TABLE dm_dim_org (
    org_code VARCHAR(20),
    org_name VARCHAR(100),
    yq_code VARCHAR(20)
)
DUPLICATE KEY(org_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
)
DISTRIBUTED BY HASH(org_code) BUCKETS 8
PROPERTIES ("replication_num" = "3");
-- This table is only 5MB / 5000 rows — partitioning and 8 buckets are overkill
```

## Good Example

Prioritize the 55GB table that dominates query time:

```sql
-- DO: Focus optimization on dm_key_index_result (55GB, 55M rows)
-- This is the largest table and appears in the most critical query
-- Analyze its filter conditions, determine partition strategy, size buckets properly

-- Step 1: Identify it as the #1 priority from the data profile
-- Step 2: Analyze all WHERE clauses and JOIN keys for this table
-- Step 3: Design partition + bucket strategy specifically for its query patterns
-- Step 4: Apply indexes on its most selective filter columns
```

For the 5MB dimension table, a simple structure suffices:

```sql
-- DO: Keep small dimension tables simple
CREATE TABLE dm_dim_org (
    org_code VARCHAR(20) NOT NULL,
    org_name VARCHAR(100),
    yq_code VARCHAR(20)
)
DUPLICATE KEY(org_code)
DISTRIBUTED BY HASH(org_code) BUCKETS 1;
```

## Additional Context

- **Think like the optimizer**: your job is to reduce the amount of data the query engine must read. Large tables are where this matters most
- Every structure change on a large table (e.g., re-partitioning 55 GB) is expensive — analyze carefully before acting. Confirm data characteristics with the user before making changes
- For small dimension tables (< 100 MB), a single bucket with no partitioning is usually sufficient

## References

- [Apache Doris Documentation — Data Partitioning](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
