# Apache Doris Agent Skills

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

> Extend AI coding assistants with deep Apache Doris expertise.

## Install

```bash
npx skills add apache/doris-skills
```

## What Are Agent Skills?

Agent Skills are curated knowledge packages that extend AI programming assistants with domain-specific expertise. They follow the open [agentskills.io](https://agentskills.io) specification, enabling any compatible AI agent to discover and apply specialized best practices automatically.

When you install a skill, your AI assistant gains the ability to:
- Review schemas, queries, and configurations against proven best practices
- Suggest optimizations specific to the technology
- Catch common mistakes before they reach production

## Available Skills

### Doris Best Practices

Comprehensive best practices for Apache Doris covering schema design, query optimization, data ingestion, and operations. Rules are organized into four categories:

| Category | Prefix | Focus Areas |
|----------|--------|-------------|
| **Schema Design** | `schema-` | Table model selection, partitioning, bucketing, data types, indexes |
| **Query Optimization** | `query-` | JOIN strategies, materialized views, query profiling |
| **Data Ingestion** | `ingest-` | Stream Load, Broker Load, Routine Load, Group Commit |
| **Operations** | `ops-` | Compaction, tablet management, replica strategies |

## Supported Agents

This skill package works with any AI coding assistant that supports the agentskills.io specification, including:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://cursor.sh)
- [Windsurf](https://codeium.com/windsurf)
- [GitHub Copilot](https://github.com/features/copilot)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Cline](https://github.com/cline/cline)
- [Aider](https://aider.chat)
- [Continue](https://continue.dev)
- [Amazon Q Developer](https://aws.amazon.com/q/developer/)
- [Augment Code](https://www.augmentcode.com)
- [Codex CLI](https://github.com/openai/codex)
- [Void](https://voideditor.com)
- [Kilo Code](https://kilocode.ai)
- [Roo Code](https://roocode.com)
- [Trae](https://trae.ai)
- [Pear AI](https://trypear.ai)
- [Klein](https://github.com/nicepkg/klein)
- [Zed](https://zed.dev)
- [amp](https://ampcode.com)
- [Junie](https://www.jetbrains.com/junie/)
- [Devin](https://devin.ai)
- [OpenHands](https://github.com/All-Hands-AI/OpenHands)
- [BB](https://github.com/Beyond-Better/bb)
- [Archy](https://archy.dev)
- [Daytona](https://daytona.io)
- [Kortex](https://kortex.dev)

## Contributing

We welcome contributions! Please read the [AGENTS.md](AGENTS.md) for guidelines on how to contribute rules and maintain skills.

## License

Apache License 2.0 — see [LICENSE](LICENSE) for details.
