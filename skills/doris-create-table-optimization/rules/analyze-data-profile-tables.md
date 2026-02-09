---
title: "Profile Tables with Row Counts and Data Volumes"
impact: CRITICAL
impactDescription: "Without accurate data profiling, all subsequent partition/bucket/index decisions will be based on guesswork, leading to suboptimal or harmful table structures"
tags: [analyze, data-profiling, poc, table-catalog]
---

# Profile Tables with Row Counts and Data Volumes

## Description

Before making any CREATE TABLE optimization decisions, you **must** catalog every table involved in the target SQL workloads. For each table, record:

- **Table name** (including database prefix)
- **Row count**
- **Data volume** (uncompressed or source size)
- **Which SQL queries reference this table**

This catalog becomes the foundation for all subsequent optimization steps. Without it, you risk over-engineering small tables or under-optimizing large ones.

## Bad Example

Jumping straight into schema design without understanding the data:

```sql
-- DON'T: Create table structure without knowing data volume
-- "I'll just use 16 buckets and add partitions later"
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8),
    org_code VARCHAR(20),
    act_code VARCHAR(30),
    value_day_bcs DOUBLE
)
DUPLICATE KEY(date_id, org_code)
DISTRIBUTED BY HASH(org_code) BUCKETS 16;
```

## Good Example

First, build a data profile table to guide decisions:

```
Table Name                              Rows        Size    Referenced In
----------------------------------------------------------------------
risun_dm.dm_key_index_result            55M         55GB    SQL 1
risun_dm.dm_ys_daily_detail             11M         11GB    SQL 2
risun_ods.ods_cw_wr_kucun_mt_org_map    18M         18GB    SQL 3
risun_dm.ads_index_result_cg            18M         18GB    SQL 3
risun_dm.dm_dim_org_cpx_scx             50K         50MB    SQL 3
risun_dm.dm_dim_material                100K        100MB   SQL 3
risun_ods.ods_cw_wr_mt_type_map         80K         80MB    SQL 3
risun_dm.dm_dim_org                     5K          5MB     SQL 2, SQL 3
risun_dm.dm_dim_cpx                     1K          1MB     SQL 3
```

Then use this profile to prioritize optimization efforts on the largest tables (55GB, 18GB) before touching smaller ones.

## Additional Context

- If you do not have access to the actual data to measure sizes, ask the user to confirm row counts and volumes — user confirmation is more reliable than guessing after import
- Doris typically achieves a **3:1 to 5:1 compression ratio**, so 55 GB of source data may compress to roughly 11-18 GB on disk. Factor this into tablet sizing calculations
- Record which SQL queries reference each table to understand cross-table optimization opportunities

## References

- [Apache Doris Documentation — Data Partitioning](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
