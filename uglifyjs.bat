@echo off
echo start uglifyjs

:: 设置压缩JS文件的根目录，脚本会自动按树层次查找和压缩所有的JS
SET JSFOLDER=%cd%\babel\

chdir /d %JSFOLDER%
for /r . %%a in (*.js) do (
    uglifyjs %%~fa  --config-file ../uglifyjs.config.json -o %%~fa
)
echo done
pause & exit