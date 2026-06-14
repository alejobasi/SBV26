#!/usr/bin/env pwsh
# Create a hotfix branch and initial report for a production incident

[CmdletBinding()]
param(
    [string]$IncidentKey,        # e.g. "INC-456" — optional
    [string]$Description,        # short description for branch name (required)
    [ValidateSet('P1','P2','P3')]
    [string]$Severity = 'P1',
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: ./create-hotfix.ps1 -Description <desc> [-IncidentKey <key>] [-Severity P1|P2|P3] [-Json]"
    Write-Output ""
    Write-Output "Examples:"
    Write-Output "  ./create-hotfix.ps1 -Description 'null-pointer-payment' -IncidentKey 'INC-456' -Severity P1"
    Write-Output "  ./create-hotfix.ps1 -Description 'login-timeout' -Severity P2"
    exit 0
}

if (-not $Description) {
    Write-Error "ERROR: -Description is required (short kebab-case description for branch name)."
    exit 1
}

# Normalize description: lowercase, replace spaces with dashes, strip non-alphanum
$shortDesc = $Description.ToLower() -replace '\s+', '-' -replace '[^a-z0-9-]', '' -replace '-+', '-'
$shortDesc = $shortDesc.Substring(0, [Math]::Min($shortDesc.Length, 50))

# Load common functions
. "$PSScriptRoot/common.ps1"
$repoRoot  = Get-RepoRoot
$hasGit    = Test-HasGit
$hotfixDir = Join-Path $repoRoot '.onex/hotfixes'

# Ensure hotfixes directory exists
New-Item -ItemType Directory -Path $hotfixDir -Force | Out-Null

# Determine branch name and report filename
if ($IncidentKey) {
    $branchName  = "fix/$IncidentKey-$shortDesc"
    $reportName  = "$IncidentKey.md"
} else {
    $timestamp   = Get-Date -Format 'yyyyMMdd-HHmm'
    $branchName  = "fix/$shortDesc"
    $reportName  = "hotfix-$timestamp.md"
}

$reportFile = Join-Path $hotfixDir $reportName
$now        = Get-Date -Format 'yyyy-MM-dd HH:mm UTC'
$incKeyDisplay = if ($IncidentKey) { $IncidentKey } else { 'No ticket' }
$jiraUrl    = if ($IncidentKey) { "https://santander.atlassian.net/browse/$IncidentKey" } else { 'N/A' }

# Create fix branch
if ($hasGit) {
    try {
        git checkout -b $branchName 2>$null
        if ($LASTEXITCODE -ne 0) {
            git checkout $branchName 2>$null
            Write-Output "[ONEX] Checked out existing branch: $branchName" | Out-Host
        } else {
            Write-Output "[ONEX] Created and checked out branch: $branchName" | Out-Host
        }
    } catch {
        Write-Warning "[ONEX] Git operation failed, continuing without branch"
    }
} else {
    Write-Warning "[ONEX] Git not detected — skipping branch creation"
}

# Generate hotfix report markdown
$report = @"
# Hotfix Report — $incKeyDisplay

> Generated with ONEX ``/onex-fix.hotfix`` — updated automatically during the hotfix cycle.
> **Do not edit manually while the hotfix is in progress.**

## Incident

| Field | Value |
|-------|-------|
| Key | $incKeyDisplay |
| Severity | $Severity |
| Date | $now |
| Branch | $branchName |
| Summary | _To be filled by agent — Step 0_ |
| Description | _To be filled by agent — Step 0_ |

## Project Baseline (from constitution.md)

| Dimension | Value |
|-----------|-------|
| Framework | _To be filled by agent — Step 0_ |
| Testing pattern | _To be filled by agent — Step 0_ |
| Naming convention | _To be filled by agent — Step 0_ |
| Null handling | _To be filled by agent — Step 0_ |
| Constitution source | _To be filled by agent — Step 0_ |

## Root Cause

> _To be filled by agent — Step 1_

## Fix Applied

| File | Lines | Change description |
|------|-------|--------------------|
| _To be filled by agent — Step 2_ | | |

## Rollback Plan

> _To be filled by agent — Step 2_

## Regression Test

| Test class | Method | Result |
|------------|--------|--------|
| _To be filled by agent — Step 3_ | | |

**Module test run**: _To be filled by agent — Step 3_
**Coverage delta**: _To be filled by agent — Step 3_

## Express Checklist

- [ ] No secrets hardcoded
- [ ] No debugging artifacts
- [ ] API contract unchanged
- [ ] No sensitive data in logs
- [ ] Regression test added
- [ ] HOTFIX inline comment added

**Result**: _To be filled by agent — Step 4_

## Pull Request

- **URL**: _To be filled by agent — Step 5_
- **Status**: Pending

## Jira

- **Incident**: [$incKeyDisplay]($jiraUrl)
- **Sub-tasks created**: _To be filled by agent — Step 6_

---
Generated with ONEX ``/onex-fix.hotfix``
Workflow: `hotfix`
Source branch: `$branchName`
Revision: `_To be filled by agent — Step 5_`
Date: `$now`
"@

Set-Content -Path $reportFile -Value $report -Encoding UTF8
Write-Output "[ONEX] Hotfix report created: $reportFile" | Out-Host

# Initial commit
if ($hasGit) {
    try {
        git add $reportFile 2>$null
        git commit -m "ONEX_docs(hotfix): init report for $incKeyDisplay" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Output "[ONEX] Initial commit created" | Out-Host
        }
    } catch {
        Write-Warning "[ONEX] Could not commit report — stage and commit manually"
    }
}

if ($Json) {
    [PSCustomObject]@{
        BRANCH_NAME   = $branchName
        REPORT_FILE   = $reportFile
        INCIDENT_KEY  = $incKeyDisplay
        SEVERITY      = $Severity
        HAS_GIT       = $hasGit
    } | ConvertTo-Json -Compress
} else {
    Write-Output "BRANCH_NAME:  $branchName"
    Write-Output "REPORT_FILE:  $reportFile"
    Write-Output "INCIDENT_KEY: $incKeyDisplay"
    Write-Output "SEVERITY:     $Severity"
    Write-Output "HAS_GIT:      $hasGit"
}
