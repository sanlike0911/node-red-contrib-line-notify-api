@echo off
setlocal
set CurrentDirectory="%~dp0"

rem build and install and npm run start
npm run build & ^
xcopy /Y /S /E /I /EXCLUDE:build-exclude-filelist src\nodes\* nodes\* & ^
xcopy /Y /S /E /I dist\* nodes\* & ^
xcopy /Y /S /E /I nodes\* data\your-node\nodes\* & ^
xcopy /Y /I package.json data\your-node\* & ^
cd data/ & ^
npm install .\your-node & ^
cd .. & ^
if "%1" EQU "-r" ( npm run start )