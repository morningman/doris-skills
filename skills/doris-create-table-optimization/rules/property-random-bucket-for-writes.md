---
title: "Use Random Bucketing for Write-Only Tables"
impact: HIGH
impactDescription: "Random bucketing provides the best write throughput for tables that are only used for data ingestion (e.g., INSERT INTO performance tests in POC), avoiding hash computation overhead"
tags: [property, write, random-bucket, ingestion, poc]
---

# Use Random Bucketing for Write-Only Tables

## Description

In POC scenarios, users often test write performance using `INSERT INTO` statements. If a table is used **only for write/ingestion testing** and will not be queried (or queried only for simple full scans), use **Random bucketing** instead of Hash bucketing.

Random bucketing avoids the hash computation overhead and distributes data more evenly during high-throughput writes.

## Bad Example

Using Hash bucketing on a write-only test table:

```sql
-- DON'T: Use Hash bucketing for a table that's only used for write testing
CREATE TABLE write_test_table (
    id BIGINT,
    data VARCHAR(255),
    create_time DATETIME
)
DUPLICATE KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 16;
-- Hash computation adds unnecessary overhead for write-only workloads
```

## Good Example

Use Random bucketing for write-only tables:

```sql
-- DO: Use Random bucketing for write/ingestion-only tables
CREATE TABLE write_test_table (
    id BIGINT,
    data VARCHAR(255),
    create_time DATETIME
)
DUPLICATE KEY(id)
DISTRIBUTED BY RANDOM BUCKETS 16;
-- Random bucketing provides best write throughput
```

## Additional Context

- This applies primarily to POC performance testing scenarios where the table exists solely to measure write speed
- If the table will also be queried with JOINs or filtered lookups, use Hash bucketing with appropriate key selection instead
- Random bucketing is available since Doris 2.0
- For production tables with mixed read/write workloads, Hash bucketing is generally preferred

## References

- [Apache Doris Documentation — Random Distribution](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
