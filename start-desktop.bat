@echo off
echo ========================================
echo   OpenCode 桌面应用启动器
echo ========================================
echo.

echo [1/3] 检查专家集成...
if exist ".opencode\agent\*.md" (
    echo ✅ 专家已集成
) else (
    echo ⚠️  专家未集成，正在集成...
    node reintegrate-experts.mjs
    if errorlevel 1 (
        echo ❌ 专家集成失败
        pause
        exit /b 1
    )
    echo ✅ 专家集成完成
)

echo.
echo [2/3] 检查桌面应用...
if exist "packages\desktop\src-tauri\target\release\OpenCode.exe" (
    echo ✅ 桌面应用已构建
) else (
    echo ❌ 桌面应用未构建
    echo 请先运行: bun run --cwd packages/desktop tauri build
    pause
    exit /b 1
)

echo.
echo [3/3] 启动桌面应用...
echo 正在启动 OpenCode 桌面应用...
start "" "packages\desktop\src-tauri\target\release\OpenCode.exe"

echo.
echo ✅ OpenCode 桌面应用已启动！
echo.
echo 使用说明：
echo - 按 Ctrl+A 打开 Agent 选择对话框
echo - 在输入框左侧的下拉菜单中选择专家
echo - 输入 /agent <专家名称> 切换专家
echo.
echo 按任意键退出此窗口...
pause >nul
