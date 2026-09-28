# 毎日 8:00 に run_daily.bat を実行するタスクを登録する（PowerShell で 1 回だけ実行）
#   powershell -ExecutionPolicy Bypass -File .\register_task.ps1
$bat = Join-Path $PSScriptRoot "run_daily.bat"
$action   = New-ScheduledTaskAction -Execute $bat -WorkingDirectory $PSScriptRoot
$trigger  = New-ScheduledTaskTrigger -Daily -At 8:00
# PC がスリープ/電源オフで 8:00 を逃したら、起動後すぐ実行する
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun -ExecutionTimeLimit (New-TimeSpan -Minutes 30)
Register-ScheduledTask -TaskName "zanmai-time daily update" -Action $action -Trigger $trigger -Settings $settings -Force
Write-Host "登録しました。タスクスケジューラで「zanmai-time daily update」を確認できます。"
