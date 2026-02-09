---
title: "Rule Title — Use a Clear, Descriptive Name"
impact: CRITICAL | HIGH | MEDIUM-HIGH | MEDIUM | LOW-MEDIUM | LOW
impactDescription: "Brief explanation of why this impact level is assigned"
tags: [tag1, tag2, tag3]
---

# Rule Title

## Description

Explain the best practice clearly and concisely. State **what** the rule recommends and **why** it matters for Apache Doris performance, reliability, or correctness.

## Bad Example

Explain what is wrong with this approach:

```sql
-- DON'T: Description of the anti-pattern
CREATE TABLE bad_example (
    id INT,
    name VARCHAR(255),
    event_time DATETIME
)
DUPLICATE KEY(id)
DISTRIBUTED BY HASH(id) BUCKETS 1;
```

## Good Example

Explain the recommended approach:

```sql
-- DO: Description of the best practice
CREATE TABLE good_example (
    event_time DATETIME,
    id INT,
    name VARCHAR(255)
)
DUPLICATE KEY(event_time, id)
PARTITION BY RANGE(event_time) (
    PARTITION p202601 VALUES LESS THAN ("2026-02-01"),
    PARTITION p202602 VALUES LESS THAN ("2026-03-01")
)
DISTRIBUTED BY HASH(id) BUCKETS 16;
```

## Additional Context

- Provide any additional context that helps understand when this rule applies
- Mention version-specific behavior if relevant (e.g., "Available since Doris 2.1")
- Note any exceptions or edge cases where the rule may not apply

## References

- [Apache Doris Documentation — Relevant Page](https://doris.apache.org/docs/relevant-page)
