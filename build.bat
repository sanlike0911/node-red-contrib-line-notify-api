@echo off
cd /d %~dp0

rem node-RED container name
set nodeRedContainerName=nodeRED

rem build and install
npm run build & ^
xcopy /Y /S /E src\icons\ dist\icons\ & ^
xcopy /Y /S /E src\locales\ dist\locales\ & ^
copy /Y src\*.html dist & ^
xcopy /Y /S /E figs\ dist\figs\ & ^
copy /Y LICENSE dist & ^
copy /Y package.json dist & ^
copy /Y readme.md dist & ^
xcopy /Y /S /E dist\* test\data\dev\your-node-red\ & ^
docker exec -it %nodeRedContainerName% bash -c "cd /data/ && npm install ./dev/your-node-red/ && exit" & ^
docker restart %nodeRedContainerName%
pause