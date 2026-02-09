---
title: "Choose Partition Strategy Based on Filter Analysis, Not Convention"
impact: CRITICAL
impactDescription: "Choosing the wrong partition strategy (e.g., Range by date when data only spans 2 months) provides zero pruning benefit and wastes the single most powerful optimization lever available"
tags: [partition, list-partition, range-partition, filter-driven]
---

# Choose Partition Strategy Based on Filter Analysis, Not Convention

## Description

The partition strategy must be driven by **actual SQL filter patterns**, not by convention. The most common mistake is defaulting to Range partitioning by date when the date column provides no meaningful pruning.

Use this decision tree:

1. **Does the SQL filter on a low-NDV column with IN (...)?** → Use **List partitioning** on that column
2. **Does the SQL filter on a time range spanning many months/years?** → Use **Range partitioning** by date
3. **Is the data volume small enough that a single partition suffices?** → **Skip partitioning** entirely
4. **Does the data only span a narrow time window and queries always scan all of it?** → **Do not partition by date** — find a different column or skip partitioning

## Bad Example

Defaulting to date Range partitioning when the data only has 2 months:

```sql
-- DON'T: Partition by date when data only covers 2 months
-- and every query scans both months
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8),
    org_code VARCHAR(20),
    act_code VARCHAR(30),
    value_day_bcs DOUBLE
)
DUPLICATE KEY(date_id)
PARTITION BY RANGE(date_id) (
    PARTITION p202502 VALUES LESS THAN ("20250301"),
    PARTITION p202503 VALUES LESS THAN ("20250401")
)
DISTRIBUTED BY HASH(org_code) BUCKETS 8;
-- Queries always filter to both months → partition pruning eliminates nothing
```

## Good Example

Choose partition based on which filter actually prunes data:

```sql
-- DO: Partition by org_code which has real selectivity in the queries
-- org_code IN ('0105', '0106') appears in every query and has low NDV
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8) NOT NULL,
    org_code VARCHAR(20) NOT NULL,
    act_code VARCHAR(30) NOT NULL,
    scene_code VARCHAR(20) NOT NULL,
    cpx_code VARCHAR(20) NOT NULL,
    value_day_bcs DOUBLE,
    INDEX idx_act_code (act_code) USING INVERTED,
    INDEX idx_cpx_code (cpx_code) USING INVERTED,
    INDEX idx_scene_code (scene_code) USING INVERTED
)
DUPLICATE KEY(date_id, org_code, act_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
)
DISTRIBUTED BY HASH(act_code) BUCKETS 3;
```

## Decision Summary

| Data Characteristic | Recommended Strategy |
|---------------------|---------------------|
| Low-NDV column always filtered with IN | List partition on that column |
| Time-series data spanning months/years with range filters | Range partition by date |
| Data < 1 GB total | No partition needed |
| Narrow time window, all queries scan full window | Do NOT partition by date — find another column |

## Additional Context

- **Adapt to the data**: this is the most important principle. Do not apply conventions blindly
- Confirm your analysis with the user: "Your data only spans 2 months and every query scans both — date partitioning provides no benefit. Instead, I recommend List partitioning by org_code."
- Each structural change on a large table is expensive. Analyze thoroughly and confirm before executing

## References

- [Apache Doris Documentation — Data Partitioning](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
