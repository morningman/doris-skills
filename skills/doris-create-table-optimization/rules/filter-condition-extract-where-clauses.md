---
title: "Extract and Evaluate WHERE Clause Filter Conditions"
impact: CRITICAL
impactDescription: "Filter conditions directly determine which columns should be used for partitioning and indexing; incorrect analysis leads to full table scans on large tables"
tags: [filter, where-clause, selectivity, partition-candidate]
---

# Extract and Evaluate WHERE Clause Filter Conditions

## Description

For each large table identified in the data profiling step, extract **all** WHERE clause filter conditions from every SQL query that references the table. Organize them into a reference table listing:

- **Column name**
- **Filter type** (IN, =, BETWEEN, range, function-wrapped)
- **Number of distinct values** in the filter
- **Estimated selectivity** (how much data the filter eliminates)

Then evaluate which conditions prune the most data. Columns with the best selectivity are candidates for **partition keys** or **inverted indexes**.

## Bad Example

Ignoring filter analysis and partitioning by a date column out of habit:

```sql
-- DON'T: Blindly partition by date without checking actual filter patterns
-- In this case, the SQL only queries 2 months of data — date partitioning adds no value
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8),
    org_code VARCHAR(20),
    act_code VARCHAR(30),
    scene_code VARCHAR(20),
    cpx_code VARCHAR(20),
    value_day_bcs DOUBLE
)
DUPLICATE KEY(date_id)
PARTITION BY RANGE(date_id) (
    PARTITION p202501 VALUES LESS THAN ("20250201"),
    PARTITION p202502 VALUES LESS THAN ("20250301"),
    PARTITION p202503 VALUES LESS THAN ("20250401")
)
DISTRIBUTED BY HASH(date_id) BUCKETS 16;
```

## Good Example

Systematically extract filter conditions from all SQL queries:

```
Table: risun_dm.dm_key_index_result (55GB)

Column        Filter Type    Distinct Values    Selectivity
------------------------------------------------------------
act_code      IN (...)       16 values          HIGH — prunes most rows
org_code      IN (...)       2 values           HIGH — only 2 of many orgs
cpx_code      IN (...)       3 values           HIGH — only 3 product lines
scene_code    IN (...)       5 values           MEDIUM — 5 scene types
date_id       substr IN      ~2 months          LOW — only 2 months in dataset
```

Based on this analysis, `act_code`, `org_code`, and `cpx_code` provide better selectivity than `date_id`. If the data only contains 2 months and the queries always filter to those 2 months, date partitioning provides no pruning benefit.

```sql
-- DO: Use filter analysis to choose partition/index strategy
-- org_code has NDV=2 and is always filtered — good List partition candidate
-- act_code, cpx_code, scene_code — good inverted index candidates
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8) NOT NULL,
    org_code VARCHAR(20) NOT NULL,
    act_code VARCHAR(30) NOT NULL,
    scene_code VARCHAR(20) NOT NULL,
    cpx_code VARCHAR(20) NOT NULL,
    value_day_bcs DOUBLE
)
DUPLICATE KEY(date_id, org_code, act_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
)
DISTRIBUTED BY HASH(act_code) BUCKETS 16
PROPERTIES ("replication_num" = "3");

ALTER TABLE dm_key_index_result ADD INDEX idx_act_code (act_code) USING INVERTED;
ALTER TABLE dm_key_index_result ADD INDEX idx_cpx_code (cpx_code) USING INVERTED;
ALTER TABLE dm_key_index_result ADD INDEX idx_scene_code (scene_code) USING INVERTED;
```

## Additional Context

- **Adapt to the data, not habits**: if the user's data only covers 2 months and queries always target those months, partitioning by date provides zero pruning benefit. Do not default to date partitioning
- Validate selectivity with the user: ask them to run `SELECT column, COUNT(*) FROM table GROUP BY column` or confirm the NDV (Number of Distinct Values) of key columns
- If you cannot query the data directly, ask the user about data distribution and usage patterns — user confirmation before import is more reliable than guessing

## References

- [Apache Doris Documentation — Data Partitioning](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
- [Apache Doris Documentation — Inverted Index](https://doris.apache.org/docs/table-design/index/inverted-index)
