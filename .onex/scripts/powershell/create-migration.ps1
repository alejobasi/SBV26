#!/usr/bin/env pwsh
# Bootstrap a new ONEX migration: branch + directory + template files

[CmdletBinding()]
param(
    [string]$ShortName,                               # e.g. "account-service"  (required)
    [ValidateSet('A','B','C','D','E','')]
    [string]$Type = '',                               # A=Backend B=Frontend C=Monolith D=Legacy E=API
    [string]$TicketKey = '',                          # e.g. "PROJ-123"  (optional)
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: ./create-migration.ps1 -ShortName <name> [-Type A|B|C|D|E] [-TicketKey <key>] [-Json]"
    Write-Output ""
    Write-Output "Examples:"
    Write-Output "  ./create-migration.ps1 -ShortName 'account-service' -Type A"
    Write-Output "  ./create-migration.ps1 -ShortName 'shell-spa' -Type B -TicketKey PROJ-456"
    exit 0
}

if (-not $ShortName) {
    Write-Error "ERROR: -ShortName is required (kebab-case short name, e.g. 'account-service')."
    exit 1
}

# Load common functions
. "$PSScriptRoot/common.ps1"

$repoRoot     = Get-RepoRoot
$hasGit       = Test-HasGit

# Normalize short name: lowercase, spaces→dashes, strip non-alphanum-dash
$id = $ShortName.ToLower() -replace '\s+', '-' -replace '[^a-z0-9-]', '' -replace '-+', '-'
$id = $id.TrimEnd('-').Substring(0, [Math]::Min($id.Length, 50))

# Build branch name
$branchName = if ($TicketKey) { "migrate/$TicketKey-$id" } else { "migrate/$id" }

# Paths
$migrationsRoot = Join-Path $repoRoot '.onex/migrations'
$migrationDir   = Join-Path $migrationsRoot $id
$templatesDir   = Join-Path $repoRoot '.onex/templates'

$assessmentFile    = Join-Path $migrationDir 'assessment.md'
$mapFile           = Join-Path $migrationDir 'migration-map.md'
$progressFile      = Join-Path $migrationDir 'progress.md'
$validationFile    = Join-Path $migrationDir 'validation-report.md'

# ── 1. Create branch ────────────────────────────────────────────────────────
if ($hasGit) {
    try {
        git checkout -b $branchName 2>$null
        if ($LASTEXITCODE -ne 0) {
            git checkout $branchName 2>$null
            Write-Output "[ONEX] Checked out existing branch: $branchName"
        } else {
            Write-Output "[ONEX] Created branch: $branchName"
        }
    } catch {
        Write-Warning "[ONEX] Git branch operation failed, continuing anyway"
    }
} else {
    Write-Warning "[ONEX] Git not detected — skipping branch creation"
}

# ── 2. Create migration directory ───────────────────────────────────────────
New-Item -ItemType Directory -Path $migrationDir -Force | Out-Null
Write-Output "[ONEX] Migration directory: $migrationDir"

# ── 3. Copy templates (never overwrite if files already exist) ───────────────
$templateMap = @{
    'migration-assessment-template.md' = $assessmentFile
    'migration-map-template.md'        = $mapFile
    'migration-progress-template.md'   = $progressFile
    'migration-validation-template.md' = $validationFile
}

foreach ($tmplName in $templateMap.Keys) {
    $dest   = $templateMap[$tmplName]
    $source = Join-Path $templatesDir $tmplName

    if (Test-Path $dest) {
        Write-Output "[ONEX] Already exists, skipping: $(Split-Path $dest -Leaf)"
        continue
    }

    if (Test-Path $source) {
        Copy-Item $source $dest
        # Replace {{MIGRATION_ID}} placeholder
        (Get-Content $dest -Raw) -replace '\{\{MIGRATION_ID\}\}', $id |
            Set-Content $dest -NoNewline
        Write-Output "[ONEX] Created: $(Split-Path $dest -Leaf)"
    } else {
        New-Item -ItemType File -Path $dest -Force | Out-Null
        Write-Output "[ONEX] Template not found, created empty: $(Split-Path $dest -Leaf)"
    }
}

# ── 4. Output ────────────────────────────────────────────────────────────────
if ($Json) {
    [PSCustomObject]@{
        MIGRATION_ID     = $id
        BRANCH           = $branchName
        MIGRATION_DIR    = $migrationDir
        ASSESSMENT       = $assessmentFile
        MAP              = $mapFile
        PROGRESS         = $progressFile
        VALIDATION       = $validationFile
        TYPE             = $Type
        TICKET           = $TicketKey
        HAS_GIT          = $hasGit
    } | ConvertTo-Json -Compress
} else {
    Write-Output "MIGRATION_ID:  $id"
    Write-Output "BRANCH:        $branchName"
    Write-Output "MIGRATION_DIR: $migrationDir"
    Write-Output "ASSESSMENT:    $assessmentFile"
    Write-Output "MAP:           $mapFile"
    Write-Output "PROGRESS:      $progressFile"
    Write-Output "VALIDATION:    $validationFile"
    Write-Output "TYPE:          $Type"
    Write-Output "HAS_GIT:       $hasGit"
}
