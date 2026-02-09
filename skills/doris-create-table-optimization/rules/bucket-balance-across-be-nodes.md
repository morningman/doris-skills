---
title: "Align Tablet Count with BE Node Count for Even Distribution"
impact: HIGH
impactDescription: "Uneven tablet distribution across BE nodes causes data skew, where some nodes process more data than others, leading to stragglers that slow down overall query response time"
tags: [bucket, balance, be-nodes, tablet-count, data-skew]
---

# Align Tablet Count with BE Node Count for Even Distribution

## Description

After calculating the ideal tablet count (partition_count * bucket_count), verify that it is **evenly divisible** by the number of BE (Backend) nodes in the cluster. If not, adjust the bucket count up or down to the nearest divisible number.

Uneven distribution means some BE nodes handle more tablets than others, creating stragglers that slow down parallel query execution.

## Bad Example

Tablet count that does not divide evenly across BE nodes:

```sql
-- DON'T: 170 tablets across 3 BE nodes
-- 170 / 3 = 56.67 → some BEs get 57, others get 56
-- This causes uneven parallel scan workload
CREATE TABLE large_table (
    id INT,
    data VARCHAR(255)
)
DUPLICATE KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 170;
-- 170 tablets on 3 BEs = uneven distribution
```

## Good Example

Adjust tablet count to be divisible by BE node count:

```sql
-- DO: Adjust to 180 tablets (divisible by 3 BE nodes)
-- 180 / 3 = 60 tablets per BE — perfectly balanced
CREATE TABLE large_table (
    id INT,
    data VARCHAR(255)
)
DUPLICATE KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 180;
-- 180 tablets on 3 BEs = 60 per node, evenly distributed
```

Or adjust down:

```sql
-- DO: Or adjust to 168 tablets (also divisible by 3)
CREATE TABLE large_table (
    id INT,
    data VARCHAR(255)
)
DUPLICATE KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 168;
-- 168 / 3 = 56 per node, evenly distributed
```

## Calculation Guide

```
Given:
- Calculated tablet_count = partition_count * bucket_count
- BE node count = N

Adjustment:
- Round tablet_count to nearest multiple of N
- Candidates: floor(tablet_count / N) * N  and  ceil(tablet_count / N) * N
- Pick whichever keeps tablet size within 1-5 GB target
- Recalculate: bucket_count = adjusted_tablet_count / partition_count
```

## Additional Context

- This is especially important for large tables where parallel scan performance matters
- For small tables (< 1 GB), a single bucket is often sufficient regardless of BE count
- When using replication (e.g., replication_num = 3), each tablet replica also needs to be considered for storage balance, but the query parallelism is determined by primary tablet distribution
- If the partition count itself is not divisible by the BE count, focus on making the total tablet count (partitions * buckets) divisible

## References

- [Apache Doris Documentation — Data Distribution](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
