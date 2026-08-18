@echo off
echo Starting M/S VS Civil website on http://localhost:8080 ...
echo.
echo IMPORTANT: Check vscivilandinteriors@gmail.com for FormSubmit activation email after first test.
echo.
start http://localhost:8080
npx --yes http-server -p 8080 -c-1
