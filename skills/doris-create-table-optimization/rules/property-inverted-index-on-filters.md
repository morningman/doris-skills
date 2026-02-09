---
title: "Add Inverted Indexes on Filtered Columns"
impact: HIGH
impactDescription: "Inverted indexes on frequently filtered columns enable index-based data skipping, significantly reducing the amount of data read from disk for selective queries"
tags: [property, index, inverted-index, filter-column]
---

# Add Inverted Indexes on Filtered Columns

## Description

For columns that appear in WHERE clauses but are **not** used as partition or bucket keys, add **inverted indexes**. This provides an additional layer of data pruning beyond partition pruning and bucket pruning.

The rule of thumb: **if a column has a filter condition and you do not know what else to do with it, add an inverted index.** This is a safe, low-risk optimization that almost always helps.

## Bad Example

No indexes on frequently filtered columns:

```sql
-- DON'T: Leave high-selectivity filter columns without indexes
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
DISTRIBUTED BY HASH(act_code) BUCKETS 3;
-- act_code is the bucket key, org_code is the partition key
-- But cpx_code and scene_code are also filtered in every query — no indexes!
```

## Good Example

Add inverted indexes on all remaining filter columns:

```sql
-- DO: Add inverted indexes on columns used in WHERE clauses
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8) NOT NULL,
    org_code VARCHAR(20) NOT NULL,
    act_code VARCHAR(30) NOT NULL,
    scene_code VARCHAR(20) NOT NULL,
    cpx_code VARCHAR(20) NOT NULL,
    value_day_bcs DOUBLE,
    INDEX idx_act_code (act_code) USING INVERTED,
    INDEX idx_cpx_code (cpx_code) USING INVERTED,
    INDEX idx_scene_code (scene_code) USING INVERTED,
    INDEX idx_date_id (date_id) USING INVERTED
)
DUPLICATE KEY(date_id, org_code, act_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
)
DISTRIBUTED BY HASH(act_code) BUCKETS 3;
```

Or add indexes after table creation:

```sql
ALTER TABLE dm_key_index_result ADD INDEX idx_cpx_code (cpx_code) USING INVERTED;
ALTER TABLE dm_key_index_result ADD INDEX idx_scene_code (scene_code) USING INVERTED;
ALTER TABLE dm_key_index_result ADD INDEX idx_date_id (date_id) USING INVERTED;
```

## Additional Context

- Inverted indexes work well with `IN (...)`, `=`, and string matching filters
- The storage overhead of inverted indexes is modest compared to the performance gains
- Available since Doris 2.0; for older versions, consider Bloom filter indexes as an alternative
- Inverted indexes are especially effective on columns with medium NDV (tens to thousands of distinct values)

## References

- [Apache Doris Documentation — Inverted Index](https://doris.apache.org/docs/table-design/index/inverted-index)
