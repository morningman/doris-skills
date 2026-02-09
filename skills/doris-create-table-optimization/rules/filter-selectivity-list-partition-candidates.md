---
title: "Use Low-NDV High-Selectivity Columns as List Partition Keys"
impact: CRITICAL
impactDescription: "Choosing list partition keys based on filter selectivity and NDV enables partition pruning that can eliminate the majority of data reads, providing order-of-magnitude performance gains"
tags: [filter, selectivity, ndv, list-partition]
---

# Use Low-NDV High-Selectivity Columns as List Partition Keys

## Description

When a WHERE clause uses an `IN (...)` filter on a column with **low NDV (Number of Distinct Values)** — typically under 2000 — and that filter provides **high selectivity** (eliminates a large portion of rows), consider making that column a **List partition key**.

This is an unconventional but highly effective technique: instead of the traditional approach of partitioning by time, partition by the column that the queries actually filter on most effectively.

## Bad Example

Partitioning by date when the real selectivity comes from `org_code`:

```sql
-- DON'T: Partition by date when org_code IN ('0105', '0106') is the most selective filter
-- and the data only spans 2 months anyway
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8),
    org_code VARCHAR(20),
    act_code VARCHAR(30),
    cpx_code VARCHAR(20),
    value_day_bcs DOUBLE
)
DUPLICATE KEY(date_id)
PARTITION BY RANGE(date_id) (
    PARTITION p202502 VALUES LESS THAN ("20250301"),
    PARTITION p202503 VALUES LESS THAN ("20250401")
)
DISTRIBUTED BY HASH(org_code) BUCKETS 16;
-- date_id partitioning is useless here — the data only has 2 months
-- and queries always scan both months
```

## Good Example

Partition by the low-NDV, high-selectivity filter column:

```sql
-- DO: Use org_code as List partition key
-- org_code has NDV ≈ small number, and IN ('0105', '0106') filters are in every query
-- This enables partition pruning to skip all irrelevant orgs
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8) NOT NULL,
    org_code VARCHAR(20) NOT NULL,
    act_code VARCHAR(30) NOT NULL,
    cpx_code VARCHAR(20) NOT NULL,
    scene_code VARCHAR(20) NOT NULL,
    value_day_bcs DOUBLE,
    value_day_cs DOUBLE,
    value_mtd_bcs DOUBLE,
    value_mtd_cs DOUBLE,
    value_ld DOUBLE,
    bgt_day DOUBLE
)
DUPLICATE KEY(date_id, org_code, act_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
    -- Add more partitions as org_code values are discovered
)
DISTRIBUTED BY HASH(act_code) BUCKETS 16;
```

## Decision Criteria

Use this checklist to decide if a column qualifies for List partitioning:

| Criterion | Threshold |
|-----------|-----------|
| NDV (distinct values) | < 2000 |
| Used in IN (...) filter | Yes, in most/all queries |
| Selectivity | High — eliminates > 50% of rows |
| Values are known/stable | Yes — not rapidly growing |

## Additional Context

- This technique is described as "unconventional" because most DBAs default to date-based Range partitioning. But if the data only spans a narrow time window and the queries always scan that entire window, date partitioning provides zero pruning benefit
- Validate the NDV with the user before creating partitions — run `SELECT org_code, COUNT(*) FROM table GROUP BY org_code` or ask the user to confirm
- You can combine List partitioning on one column with inverted indexes on other filter columns for layered pruning
- If the NDV is very large (> 2000), List partitioning becomes impractical — use inverted indexes instead

## References

- [Apache Doris Documentation — List Partitioning](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
- [Apache Doris Documentation — Inverted Index](https://doris.apache.org/docs/table-design/index/inverted-index)
