# OpenCode Desktop App Launcher
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OpenCode Desktop App Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check expert integration
Write-Host "[1/3] Checking expert integration..." -ForegroundColor Yellow
$expertFiles = Get-ChildItem -Path ".opencode\agent\*.md" -ErrorAction SilentlyContinue
if ($expertFiles) {
    Write-Host "OK: Experts integrated ($($expertFiles.Count) experts)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Experts not integrated, integrating now..." -ForegroundColor Yellow
    node reintegrate-experts.mjs
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Expert integration failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "OK: Expert integration completed" -ForegroundColor Green
}

Write-Host ""

# Check desktop app
Write-Host "[2/3] Checking desktop app..." -ForegroundColor Yellow
$exePath = "packages\desktop\src-tauri\target\release\OpenCode.exe"
if (Test-Path $exePath) {
    Write-Host "OK: Desktop app is built" -ForegroundColor Green
} else {
    Write-Host "ERROR: Desktop app is not built" -ForegroundColor Red
    Write-Host "Please run: bun run --cwd packages/desktop tauri build" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Launch desktop app
Write-Host "[3/3] Launching desktop app..." -ForegroundColor Yellow
Write-Host "Starting OpenCode Desktop App..." -ForegroundColor Cyan
Start-Process $exePath

Write-Host ""
Write-Host "OK: OpenCode Desktop App launched!" -ForegroundColor Green
Write-Host ""
Write-Host "Usage:" -ForegroundColor Cyan
Write-Host "- Press Ctrl+A to open Agent selection dialog" -ForegroundColor White
Write-Host "- Use the dropdown menu on the left side of input box" -ForegroundColor White
Write-Host "- Type /agent <expert-name> to switch expert" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
