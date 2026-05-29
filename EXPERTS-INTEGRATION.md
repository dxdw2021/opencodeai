# OpenCode 专家系统集成指南

## 概述

本文档说明如何将 `experts/` 目录中的专家集成到 OpenCode 应用中。

## 专家系统架构

```
experts/
├── manifest.json          # 专家索引清单 (246 个专家)
├── metadata.json          # 缓存元数据
├── version.txt            # 版本号
├── avatars/               # 专家头像 (242 个 PNG 文件)
└── plugins/               # 专家插件目录 (400+ 个)
    └── <expert-name>/
        └── agents/
            └── <expert-name>.md   # Agent 定义文件
```

## 集成方法

### 方法 1: 使用集成脚本 (推荐)

运行集成脚本将专家复制到 `.opencode/agent/` 目录：

```bash
cd d:/DEV/tool/opencodeai
node integrate-experts.mjs
```

脚本会：
1. 读取 `experts/manifest.json`
2. 将所有 Agent 类型的专家 `.md` 文件复制到 `.opencode/agent/`
3. 跳过 Team 和 Plugin 类型的专家

### 方法 2: 手动复制

手动将 `experts/plugins/*/agents/*.md` 文件复制到 `.opencode/agent/` 目录。

## 使用方法

### 在 CLI 中使用

```bash
# 查看所有可用 Agent
opencode agent list

# 切换到指定专家
/agent content-creator

# 或在 TUI 中按 Ctrl+A 打开 Agent 选择对话框
```

### 在 Web UI 中使用

1. 打开 `expert-browser.html`
2. 浏览或搜索专家
3. 点击"调用专家"复制命令
4. 在 OpenCode 中粘贴执行

## 专家类型

| 类型 | 说明 | 数量 |
|------|------|------|
| Agent | 单个 AI 专家 | 192 |
| Team | 专家团队 | 20+ |
| Plugin | 插件专家 | 30+ |

## 专家分类

| 分类 | 示例专家 |
|------|----------|
| 产品设计 | 体验达、探真真 |
| 技术工程 | 像素匠、磐石石、架构通 |
| 数据智能 | 数妙妙、管道通、索引灵 |
| 内容创作 | 文爆爆、弹幕幕、图说说 |
| 营销增长 | 裂变变、种草草、搜霸霸 |
| 电商运营 | 卖得好、播旺旺、出海海 |
| 金融分析 | 账清清、回测明算 |
| 安全合规 | 盾甲甲、守规规 |
| 腾讯专区 | 小程达、云鼎、AndonQ |

## 专家定义格式

每个专家 `.md` 文件包含：

```markdown
---
name: content-creator
description: Expert content strategist and creator
color: teal
emoji: ✍️
vibe: Crafts compelling stories
---

# 专家角色定义

## 核心能力
- 能力 1
- 能力 2

## 专业技能
- 技能 1
- 技能 2
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `integrate-experts.mjs` | 专家集成脚本 |
| `expert-browser.html` | 专家浏览器 UI |
| `.opencode/agent/` | 集成后的专家目录 |

## 注意事项

1. 专家集成后需要重启 OpenCode 才能生效
2. 每个专家都是独立的 Agent，有自己的提示词和行为
3. 部分专家可能需要特定的 API 或权限才能使用
4. 专家数据来源于远端 CDN，可能需要网络连接

## 故障排除

### 专家未显示

1. 检查 `.opencode/agent/` 目录是否存在
2. 确认 `.md` 文件格式正确
3. 重启 OpenCode 应用

### 专家调用失败

1. 检查 Agent 名称是否正确
2. 查看 OpenCode 日志获取错误信息
3. 确认网络连接正常

## 更新日志

- 2026-05-27: 初始版本，集成 192 个 Agent 专家