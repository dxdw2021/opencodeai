# OpenCode 桌面应用专家集成指南

## 概述

OpenCode 已经有桌面应用（基于 Tauri），专家系统已经集成到应用中。

## 启动桌面应用

### 方法 1: 直接运行已构建的版本
```bash
# 直接运行可执行文件
d:/DEV/tool/opencodeai/packages/desktop/src-tauri/target/release/OpenCode.exe
```

### 方法 2: 从源代码启动开发模式
```bash
cd d:/DEV/tool/opencodeai
bun run --cwd packages/desktop tauri dev
```

### 方法 3: 构建安装包
```bash
cd d:/DEV/tool/opencodeai
bun run --cwd packages/desktop tauri build
```

## 桌面应用中的专家使用

### 1. 启动桌面应用
- 运行 `OpenCode.exe` 或使用开发模式启动
- 应用会自动启动 OpenCode 服务器

### 2. 选择专家
在桌面应用中，有以下方式选择专家：

#### 方式 A: 使用 Agent 选择器
- 在输入框左侧，有一个 Agent 选择下拉菜单
- 点击下拉菜单，可以看到所有可用的专家
- 选择想要使用的专家

#### 方式 B: 使用快捷键
- 按 `Ctrl+A`（Windows/Linux）或 `Cmd+A`（macOS）打开 Agent 选择对话框
- 从列表中选择专家

#### 方式 C: 使用命令
- 在输入框中输入 `/agent <专家名称>`
- 例如：`/agent content-creator`

### 3. 专家列表
桌面应用会自动加载 `.opencode/agent/` 目录中的所有专家文件。

## 专家文件位置

```
.opencode/
└── agent/
    ├── content-creator.md
    ├── data-analytics-reporter.md
    ├── frontend-developer.md
    ├── backend-architect.md
    └── ... (199 个专家)
```

## 验证专家集成

### 检查专家是否加载
1. 启动桌面应用
2. 查看 Agent 选择器是否显示专家列表
3. 如果没有显示，检查 `.opencode/agent/` 目录是否存在专家文件

### 重新集成专家
如果专家没有正确加载，可以重新运行集成脚本：

```bash
cd d:/DEV/tool/opencodeai
node reintegrate-experts.mjs
```

## 桌面应用功能

### 主要功能
- ✅ 专家选择和切换
- ✅ 模型选择
- ✅ 会话管理
- ✅ 文件上下文
- ✅ MCP 服务器管理
- ✅ 主题切换
- ✅ 自动更新

### 快捷键
| 快捷键 | 功能 |
|--------|------|
| `Ctrl+A` | 打开 Agent 选择对话框 |
| `Ctrl+M` | 打开模型选择对话框 |
| `Ctrl+N` | 新建会话 |
| `Ctrl+Shift+S` | 打开会话列表 |
| `Ctrl+Shift+T` | 切换主题 |
| `Ctrl+Shift+H` | 打开帮助 |

## 故障排除

### 问题 1: 专家没有显示
**解决方案**:
1. 检查 `.opencode/agent/` 目录是否存在
2. 运行 `node reintegrate-experts.mjs` 重新集成
3. 重启桌面应用

### 问题 2: 桌面应用无法启动
**解决方案**:
1. 检查是否有其他 OpenCode 实例在运行
2. 检查端口是否被占用
3. 查看日志文件

### 问题 3: 专家功能不正常
**解决方案**:
1. 检查专家文件格式是否正确
2. 查看控制台错误信息
3. 尝试使用其他专家

## 开发者指南

### 添加新专家
1. 在 `experts/plugins/` 目录创建新的专家插件
2. 运行 `node reintegrate-experts.mjs` 集成专家
3. 重启桌面应用

### 自定义专家界面
如果需要自定义专家选择界面，可以修改以下文件：
- `packages/app/src/components/prompt-input.tsx`
- `packages/app/src/context/local.tsx`

### 构建自定义版本
```bash
# 开发模式
bun run --cwd packages/desktop tauri dev

# 构建生产版本
bun run --cwd packages/desktop tauri build

# 构建安装包
bun run --cwd packages/desktop tauri build -- --bundles nsis
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `packages/desktop/` | 桌面应用源代码 |
| `packages/desktop/src-tauri/` | Tauri 配置和 Rust 代码 |
| `packages/desktop/src-tauri/target/release/OpenCode.exe` | 可执行文件 |
| `packages/desktop/src-tauri/target/release/bundle/nsis/` | 安装包 |
| `.opencode/agent/` | 集成后的专家目录 |
| `integrate-experts.mjs` | 专家集成脚本 |
| `reintegrate-experts.mjs` | 重新集成脚本 |

## 下一步

1. **启动桌面应用** - 运行 `OpenCode.exe` 或使用开发模式
2. **选择专家** - 使用 Agent 选择器或快捷键
3. **开始使用** - 与专家对话，获取专业帮助

---

**提示**: 桌面应用会自动加载 `.opencode/agent/` 目录中的专家。如果专家没有显示，请重新运行集成脚本。
