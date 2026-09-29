@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "SITE_NODE_EXE="
if exist "C:\Program Files\nodejs\node.exe" set "SITE_NODE_EXE=C:\Program Files\nodejs\node.exe"
if not defined SITE_NODE_EXE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "SITE_NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined SITE_NODE_EXE (
  echo 暂未找到 Node.js，请让 Codex 帮助启动预览。
  pause
  exit /b 1
)
if not exist "node_modules\vitepress\bin\vitepress.js" (
  echo 请先在此文件夹运行 npm install，或让 Codex 帮助准备预览。
  pause
  exit /b 1
)
echo 本地预览网址：http://127.0.0.1:5173/
echo 请保留此窗口；关闭窗口后预览会结束。
"%SITE_NODE_EXE%" "node_modules\vitepress\bin\vitepress.js" dev docs --host 127.0.0.1 --port 5173 --strictPort
pause
