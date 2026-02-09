---
title: "Calculate Bucket Count Using Tablet Size Targets"
impact: CRITICAL
impactDescription: "Incorrect bucket count leads to either too-large tablets (slow scans, poor concurrency) or too-small tablets (excessive metadata overhead, small file problem)"
tags: [sizing, bucket, tablet-size, compression-ratio]
---

# Calculate Bucket Count Using Tablet Size Targets

## Description

After determining the partition strategy, calculate the **bucket count** so that each tablet falls within the **1-5 GB** size range (ideally 1-5 GB, acceptable up to 10 GB). Use this formula:

```
tablet_count = partition_count * bucket_count
single_tablet_size = total_data_size / tablet_count
target: 1 GB <= single_tablet_size <= 5 GB
```

When you do not have the exact compressed data size, apply the Doris compression ratio of **3:1 to 5:1** to estimate the on-disk size from the source data size.

## Bad Example

Using an arbitrary bucket count without calculating tablet size:

```sql
-- DON'T: Pick bucket count randomly
-- 55GB source data, compression ratio ~4:1, on-disk ~14GB
-- 2 partitions * 1 bucket = 2 tablets → 7GB per tablet (too large)
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8),
    org_code VARCHAR(20),
    act_code VARCHAR(30),
    value_day_bcs DOUBLE
)
DUPLICATE KEY(date_id, org_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
)
DISTRIBUTED BY HASH(act_code) BUCKETS 1;
-- 2 partitions * 1 bucket = 2 tablets, ~7GB each — too large
```

## Good Example

Calculate bucket count from the target tablet size:

```
Given:
- Source data size: 55 GB
- Compression ratio: ~4:1
- Estimated on-disk size: 55 / 4 ≈ 14 GB
- Partition count: 2 (List by org_code)
- Target tablet size: 1-5 GB

Calculation:
- tablet_count = on_disk_size / target_tablet_size
- tablet_count = 14 GB / 2 GB ≈ 7 tablets (minimum)
- tablet_count = 14 GB / 5 GB ≈ 3 tablets (minimum)
- Choose: tablet_count ≈ 6 (reasonable middle ground)
- bucket_count = tablet_count / partition_count = 6 / 2 = 3
```

```sql
-- DO: Calculate bucket count based on tablet size target
CREATE TABLE dm_key_index_result (
    date_id VARCHAR(8) NOT NULL,
    org_code VARCHAR(20) NOT NULL,
    act_code VARCHAR(30) NOT NULL,
    scene_code VARCHAR(20) NOT NULL,
    cpx_code VARCHAR(20) NOT NULL,
    value_day_bcs DOUBLE,
    value_day_cs DOUBLE,
    value_mtd_bcs DOUBLE,
    value_mtd_cs DOUBLE
)
DUPLICATE KEY(date_id, org_code, act_code)
PARTITION BY LIST(org_code) (
    PARTITION p0105 VALUES IN ("0105"),
    PARTITION p0106 VALUES IN ("0106")
)
DISTRIBUTED BY HASH(act_code) BUCKETS 3;
-- 2 partitions * 3 buckets = 6 tablets, ~2.3 GB each — within target range
```

## Additional Context

- Doris compression ratio is typically **3:1 to 5:1** depending on data characteristics (string-heavy data compresses more, numeric data compresses less)
- If you cannot measure the compressed size, use **4:1** as a safe default estimate
- Auto Bucket feature (available since Doris 2.0) can handle this automatically, but manual calculation is preferred for POC scenarios where you want precise control
- Re-check tablet sizes after initial data load — adjust if actual compression differs from estimates

## References

- [Apache Doris Documentation — Data Distribution](https://doris.apache.org/docs/table-design/data-partitioning/auto-partitioning)
