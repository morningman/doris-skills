---
title: "Extract JOIN Keys for Bucket Key Selection"
impact: HIGH
impactDescription: "Aligning bucket keys with JOIN keys enables colocate join and bucket shuffle join, avoiding expensive data shuffle during query execution"
tags: [bucket, join-key, bucket-key, colocate]
---

# Extract JOIN Keys for Bucket Key Selection

## Description

For each large table, extract the **JOIN keys** used in all SQL queries that reference it. JOIN keys are strong candidates for **hash bucket keys** because:

1. **Colocate Join**: If two tables are bucketed by the same JOIN key with the same bucket count, Doris can perform local joins without shuffling data across nodes
2. **Bucket Shuffle Join**: Even without colocate groups, matching bucket keys to JOIN keys reduces shuffle overhead

Record JOIN keys alongside filter conditions to make a comprehensive column importance map.

## Bad Example

Choosing a bucket key that has nothing to do with how the table is joined:

```sql
-- DON'T: Bucket by date_id when the table is always joined on material_code
CREATE TABLE ods_cw_wr_kucun_mt_org_map (
    material_code VARCHAR(20),
    material_name VARCHAR(100),
    org_code VARCHAR(20),
    is_enable INT,
    date_id VARCHAR(8)
)
DUPLICATE KEY(date_id)
DISTRIBUTED BY HASH(date_id) BUCKETS 16;
-- This table is JOINed ON material_code, but bucketed by date_id
-- Every join will require a full shuffle
```

## Good Example

Bucket by the JOIN key to enable efficient join strategies:

```sql
-- DO: Bucket by material_code — the column used in JOIN ON clauses
CREATE TABLE ods_cw_wr_kucun_mt_org_map (
    material_code VARCHAR(20) NOT NULL,
    material_name VARCHAR(100),
    org_code VARCHAR(20),
    is_enable INT
)
DUPLICATE KEY(material_code)
DISTRIBUTED BY HASH(material_code) BUCKETS 16;
```

Build a JOIN key reference table:

```
Table: risun_ods.ods_cw_wr_kucun_mt_org_map (18GB)

JOIN Key          Joined With                          Frequency
-----------------------------------------------------------------
material_code     dm_dim_material.material_code        SQL 3 (INNER JOIN)
```

Since `material_code` is the only JOIN key, it should be the hash bucket key.

## Additional Context

- When a table has multiple JOIN keys across different queries, prefer the one used in joins with the largest counterpart table
- If both filter conditions and JOIN keys point to the same column, that column is an excellent bucket key candidate
- For colocate join optimization, both tables must use the same bucket key, same bucket count, and be assigned to the same colocate group

## References

- [Apache Doris Documentation — Colocate Join](https://doris.apache.org/docs/query-acceleration/join-optimization/colocation-join)
- [Apache Doris Documentation — Bucket Shuffle Join](https://doris.apache.org/docs/query-acceleration/join-optimization/bucket-shuffle-join)
