---
title: "Set NOT NULL on Columns Without Null Values"
impact: MEDIUM
impactDescription: "NOT NULL constraints enable Doris to skip null-checking logic and use more compact storage, providing modest but consistent performance improvements"
tags: [property, null, schema, data-types]
---

# Set NOT NULL on Columns Without Null Values

## Description

If a column is known to never contain NULL values, explicitly declare it as `NOT NULL` in the CREATE TABLE statement. This allows Doris to:

1. Skip null bitmap storage and null-checking logic during query execution
2. Use slightly more compact storage format
3. Provide clearer semantics for downstream consumers

## Bad Example

Leaving all columns nullable by default when they never contain nulls:

```sql
-- DON'T: Default nullable columns when the data never has nulls
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8),        -- never null in practice
    org_code VARCHAR(20),      -- never null in practice
    act_code VARCHAR(30),      -- never null in practice
    value_day_bcs DOUBLE       -- may be null
)
DUPLICATE KEY(date_id, org_code)
DISTRIBUTED BY HASH(org_code) BUCKETS 8;
```

## Good Example

Explicitly set NOT NULL on columns that are guaranteed non-null:

```sql
-- DO: Declare NOT NULL on columns known to never contain null values
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8) NOT NULL,
    org_code VARCHAR(20) NOT NULL,
    act_code VARCHAR(30) NOT NULL,
    value_day_bcs DOUBLE       -- keep nullable if nulls are possible
)
DUPLICATE KEY(date_id, org_code)
DISTRIBUTED BY HASH(org_code) BUCKETS 8;
```

## Additional Context

- Confirm with the user or data source whether columns can contain NULL values before applying NOT NULL
- Key columns (partition keys, bucket keys) should generally be NOT NULL
- This optimization has modest impact on its own, but combined with other optimizations contributes to overall performance

## References

- [Apache Doris Documentation — CREATE TABLE](https://doris.apache.org/docs/sql-manual/sql-statements/table-and-view/table/CREATE-TABLE)
