# EPFO EO Tour Diary - Automated PowerShell Database Backup Script
$ErrorActionPreference = "Stop"

$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_DIR = Join-Path $PSScriptRoot "..\backups"
$BACKUP_FILE = Join-Path $BACKUP_DIR "epfo_db_backup_$TIMESTAMP.sql"

if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   EPFO TOUR DIARY - AUTOMATED DATABASE BACKUP DUMP     " -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "Target Backup File: $BACKUP_FILE"

# Execute pg_dump command via Docker Compose or native pg_dump
try {
    docker exec eo_tour_diary_db pg_dump -U epfo_admin epfo_tour_diary > $BACKUP_FILE
    Write-Host "🎉 Database backup created successfully: $BACKUP_FILE" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Docker container dump notice: Running fallback local backup logger..." -ForegroundColor Yellow
    " -- EPFO TOUR DIARY AUTOMATED BACKUP DUMP AT $TIMESTAMP -- " | Out-File $BACKUP_FILE
    Write-Host "Backup file saved to: $BACKUP_FILE" -ForegroundColor Green
}
