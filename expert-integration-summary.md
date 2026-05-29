# OpenCode 专家集成总结

## 集成完成时间
2026年5月28日 02:20

## 集成状态

✅ **专家名称已更新为中文职业名称** - 使用 `profession.zh` 字段

## 集成统计

| 统计项 | 数量 |
|--------|------|
| 成功集成 | 192 个专家 |
| 跳过（非 agent 类型） | 54 个 |
| 错误 | 0 个 |
| 总计 | 246 个专家 |

## 专家名称示例

| 原名称 | 新名称 | 专业领域 |
|--------|--------|----------|
| 文爆爆 | 内容创作专家 | 内容创作 |
| 数妙妙 | 数据分析报告师 | 数据分析 |
| 卖得好 | 中国电商运营专家 | 电商运营 |
| 斗音音 | 抖音策略师 | 短视频运营 |
| 像素君 | UI设计师 | UI设计 |
| 磐石石 | 后端架构师 | 后端架构 |
| 架构通 | 软件架构师 | 软件架构 |
| 掌中灵 | 微信小程序开发者 | 微信小程序 |
| 云鼎 | 腾讯安全专家 | 安全 |
| AI 刘小排 | 创业教练 | 创业辅导 |

## 集成脚本

### 主要脚本
- `reintegrate-experts-zh.mjs` - 中文版本集成脚本
- `integrate-experts.mjs` - 原始集成脚本

### 脚本功能
1. 读取 `experts/manifest.json` 中的专家定义
2. 使用 `profession.zh` 作为显示名称（如"高级项目经理"）
3. 将专家文件复制到 `.opencode/agent/` 目录
4. 生成中文名称的 `.md` 文件

## 桌面应用

### 安装位置
- 可执行文件: `C:\Users\Administrator.LAPTOP-QMJNJC9F\AppData\Local\Programs\OpenCode Dev\OpenCode Dev.exe`
- 桌面快捷方式: `C:\Users\Administrator.LAPTOP-QMJNJC9F\Desktop\OpenCode Dev.lnk`

### 启动方法
1. 双击桌面快捷方式
2. 运行 `start-desktop.ps1` 脚本
3. 直接运行可执行文件

## 使用方法

### 方法 1: 使用下拉菜单
1. 启动 OpenCode 桌面应用
2. 在输入框左侧的 Agent 选择器中选择专家
3. 选择中文名称的专家

### 方法 2: 使用快捷键
- 按 `Ctrl+A` 打开 Agent 选择对话框
- 从列表中选择专家

### 方法 3: 使用命令
- 在输入框中输入 `/agent <专家名称>`
- 例如：`/agent 高级项目经理`

## 文件说明

| 文件 | 说明 |
|------|------|
| `.opencode/agent/*.md` | 专家文件目录 (192 个专家) |
| `reintegrate-experts-zh.mjs` | 中文版本集成脚本 |
| `expert-desktop-integration.md` | 集成指南文档 |
| `start-desktop.ps1` | PowerShell 启动脚本 |
| `start-desktop.bat` | 批处理启动脚本 |

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+A` | 打开 Agent 选择对话框 |
| `Ctrl+M` | 打开模型选择对话框 |
| `Ctrl+N` | 新建会话 |
| `Ctrl+Shift+S` | 打开会话列表 |
| `Ctrl+Shift+T` | 切换主题 |

## 验证方法

1. 启动 OpenCode 桌面应用
2. 按 `Ctrl+A` 打开 Agent 选择对话框
3. 检查专家名称是否显示为中文职业名称（如"高级项目经理"）
4. 选择一个专家进行测试

## 注意事项

- 专家名称现在使用 `profession.zh` 字段（如"高级项目经理"）
- 文件名也使用中文名称（如"高级项目经理.md"）
- 桌面应用已重新启动以加载新的专家配置
- 所有 192 个专家都已成功集成

---

**提示**: 如果专家名称仍然显示为英文，请重启 OpenCode 桌面应用。