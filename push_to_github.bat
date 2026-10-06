@echo off
set "PATH=%LOCALAPPDATA%\MinGit\cmd;%LOCALAPPDATA%\gh;%PATH%"
set "GIT_SSH_COMMAND=ssh -o StrictHostKeyChecking=no -i %USERPROFILE%\.ssh\id_ed25519"
echo ========================================================
echo Pushing Smart Krishi Connect (FarmChain) to GitHub...
echo ========================================================
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo SUCCESS! Project successfully pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo PUSH FAILED. Please make sure you added your SSH key at:
    echo https://github.com/settings/ssh/new
)
pause
