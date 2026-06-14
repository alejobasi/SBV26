#!/usr/bin/env pwsh
# Resolve all ONEX migration paths from the current branch (read-only)

[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: ./setup-migration.ps1 [-Json] [-Help]"
    Write-Output "  -Json     Output results in JSON format"
    Write-Output "  -Help     Show this help message"
    exit 0
}

# Load common functions
. "$PSScriptRoot/common.ps1"

$repoRoot = Get-RepoRoot
$hasGit   = Test-HasGit

# ── Resolve migration ID from current branch ─────────────────────────────────
$currentBranch = 'unknown'
if ($hasGit) {
    try {
        $currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
    } catch {}
}

# Branch must match migrate/* or migrate/<ticket>-<id>
if ($currentBranch -notmatch '^migrate/') {
    # Fallback: try to find the only/latest migration directory
    $migrationsRoot = Join-Path $repoRoot '.onex/migrations'
    if (Test-Path $migrationsRoot) {
        $dirs = Get-ChildItem -Path $migrationsRoot -Directory | Sort-Object LastWriteTime -Descending
        if ($dirs.Count -gt 0) {
            $migrationId = $dirs[0].Name
            Write-Warning "[ONEX] Not on a migrate/* branch — using latest migration directory: $migrationId"
        } else {
            Write-Error "[ONEX] ERROR: Not on a migrate/* branch and no migration directory found."
            Write-Error "  Run onex.migrate.assess first, or: git checkout migrate/<id>"
            exit 1
        }
    } else {
        Write-Error "[ONEX] ERROR: Not on a migrate/* branch. Run onex.migrate.assess first."
        exit 1
    }
} else {
    # Extract id: strip "migrate/" prefix, then strip optional "<ticket>-" prefix
    $afterPrefix = $currentBranch -replace '^migrate/', ''
    # If branch is "migrate/PROJ-123-account-service" id is "account-service"
    # If branch is "migrate/account-service"         id is "account-service"
    if ($afterPrefix -match '^[A-Z]+-\d+-(.+)$') {
        $migrationId = $matches[1]
    } else {
        $migrationId = $afterPrefix
    }
}

# ── Build paths ──────────────────────────────────────────────────────────────
$migrationDir   = Join-Path $repoRoot ".onex/migrations/$migrationId"
$assessmentFile = Join-Path $migrationDir 'assessment.md'
$mapFile        = Join-Path $migrationDir 'migration-map.md'
$progressFile   = Join-Path $migrationDir 'progress.md'
$validationFile = Join-Path $migrationDir 'validation-report.md'

# Ensure directory exists (safe: only creates folder, never overwrites files)
New-Item -ItemType Directory -Path $migrationDir -Force | Out-Null

# ── Output ───────────────────────────────────────────────────────────────────
if ($Json) {
    [PSCustomObject]@{
        MIGRATION_ID     = $migrationId
        BRANCH           = $currentBranch
        MIGRATION_DIR    = $migrationDir
        ASSESSMENT       = $assessmentFile
        MAP              = $mapFile
        PROGRESS         = $progressFile
        VALIDATION       = $validationFile
        HAS_GIT          = $hasGit
        REPO_ROOT        = $repoRoot
    } | ConvertTo-Json -Compress
} else {
    Write-Output "MIGRATION_ID:  $migrationId"
    Write-Output "BRANCH:        $currentBranch"
    Write-Output "MIGRATION_DIR: $migrationDir"
    Write-Output "ASSESSMENT:    $assessmentFile"
    Write-Output "MAP:           $mapFile"
    Write-Output "PROGRESS:      $progressFile"
    Write-Output "VALIDATION:    $validationFile"
    Write-Output "HAS_GIT:       $hasGit"
}
