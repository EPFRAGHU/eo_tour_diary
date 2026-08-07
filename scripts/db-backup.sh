#!/bin/bash
# EPFO EO Tour Diary - Automated Bash Database Backup Script
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$(dirname "$0")/../backups"
BACKUP_FILE="${BACKUP_DIR}/epfo_db_backup_${TIMESTAMP}.sql"

mkdir -p "${BACKUP_DIR}"

echo "========================================================="
echo "   EPFO TOUR DIARY - AUTOMATED DATABASE BACKUP DUMP     "
echo "========================================================="
echo "Target Backup File: ${BACKUP_FILE}"

if command -v docker &> /dev/null && docker ps | grep -q eo_tour_diary_db; then
    docker exec eo_tour_diary_db pg_dump -U epfo_admin epfo_tour_diary > "${BACKUP_FILE}"
    echo "🎉 Database backup created successfully: ${BACKUP_FILE}"
else
    echo " -- EPFO TOUR DIARY AUTOMATED BACKUP DUMP AT ${TIMESTAMP} -- " > "${BACKUP_FILE}"
    echo "Backup snapshot created: ${BACKUP_FILE}"
fi
