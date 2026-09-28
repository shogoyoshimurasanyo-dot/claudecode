@echo off
rem Called by Task Scheduler. Runs in this folder.
cd /d "%~dp0"
py -3 zanmai_daily.py %*
