@echo off
cd /d %~dp0

rem node-RED container name
set nodeRedContainerName=nodeRED

rem build and install
npm run build & ^
copy /Y src\*.html nodes & ^
xcopy /Y /S /E dist\* nodes\* & ^
xcopy /Y /S /E src\locales\ nodes\locales\* & ^
xcopy /Y /S /E nodes\* test\data\your-node-red\nodes\* & ^
copy /Y package.json test\data\your-node-red\ & ^
docker exec -it %nodeRedContainerName% bash -c "cd /data/ && npm install ./your-node-red/ && exit" & ^
docker restart %nodeRedContainerName%
pause