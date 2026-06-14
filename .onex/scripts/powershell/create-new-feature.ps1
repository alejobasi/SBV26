#!/usr/bin/env pwsh
# Create a new feature specification for Santander projects

[CmdletBinding()]
param(
    [switch]$Json,
    [int]$Number,
    [string]$ShortName,
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$FeatureDescription,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

# Show help if requested
if ($Help) {
    Write-Output "Usage: ./create-new-feature.ps1 [-Json] [-Number <num>] [-ShortName <name>] <feature description>"
    Write-Output ""
    Write-Output "Examples:"
    Write-Output "  ./create-new-feature.ps1 'Add Darwin Gateway authentication'"
    Write-Output "  ./create-new-feature.ps1 -Number 5 -ShortName 'gateway-auth' 'Add Darwin Gateway authentication'"
    exit 0
}

# Check if feature description provided
if (-not $FeatureDescription -or $FeatureDescription.Count -eq 0) {
    Write-Error "Usage: ./create-new-feature.ps1 [-Json] [-Number <num>] [-ShortName <name>] <feature description>"
    exit 1
}

$featureDesc = ($FeatureDescription -join ' ').Trim()

# Load common functions
. "$PSScriptRoot/common.ps1"

$repoRoot = Get-RepoRoot
$hasGit = Test-HasGit
$specsDir = Join-Path $repoRoot '.onex/specs'

# Ensure specs directory exists
New-Item -ItemType Directory -Path $specsDir -Force | Out-Null

function Get-HighestNumberFromSpecs {
    param([string]$SpecsDir)
    
    $highest = 0
    if (Test-Path $SpecsDir) {
        Get-ChildItem -Path $SpecsDir -Directory | ForEach-Object {
            if ($_.Name -match '^(\d+)') {
                $num = [int]$matches[1]
                if ($num -gt $highest) { $highest = $num }
            }
        }
    }
    return $highest
}

function Get-HighestNumberFromBranches {
    $highest = 0
    try {
        $branches = git branch -a 2>$null
        if ($LASTEXITCODE -eq 0) {
            $branches | ForEach-Object {
                if ($_ -match '(\d{3})-') {
                    $num = [int]$matches[1]
                    if ($num -gt $highest) { $highest = $num }
                }
            }
        }
    } catch {
        # Git command failed
    }
    return $highest
}

# Determine feature number
if ($Number -gt 0) {
    $featureNum = $Number
} else {
    $specsHigh = Get-HighestNumberFromSpecs -SpecsDir $specsDir
    $branchHigh = Get-HighestNumberFromBranches
    $featureNum = [Math]::Max($specsHigh, $branchHigh) + 1
}

# Generate short name if not provided
if (-not $ShortName) {
    # Extract key words from description
    $words = $featureDesc -split '\s+' | Where-Object { $_.Length -gt 3 } | Select-Object -First 3
    $ShortName = ($words -join '-').ToLower() -replace '[^a-z0-9-]', ''
}

$branchName = "ONEX-{0:D3}-{1}" -f $featureNum, $ShortName

# Create branch if Git is available
if ($hasGit) {
    try {
        git checkout -b $branchName 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Output "[ONEX] Created and checked out branch: $branchName"
        } else {
            # Branch might exist, try to check it out
            git checkout $branchName 2>$null
            Write-Output "[ONEX] Checked out existing branch: $branchName"
        }
    } catch {
        Write-Warning "[ONEX] Git operation failed, continuing without branch"
    }
} else {
    Write-Warning "[ONEX] Warning: Git repository not detected; skipped branch creation for $branchName"
}

$featureDir = Join-Path $specsDir $branchName
New-Item -ItemType Directory -Path $featureDir -Force | Out-Null

$template = Join-Path $repoRoot '\.onex/templates/spec-template.md'
$specFile = Join-Path $featureDir 'spec.md'
if (Test-Path $template) { 
    Copy-Item $template $specFile -Force 
} else { 
    New-Item -ItemType File -Path $specFile | Out-Null 
}

# Set the ONEX_FEATURE environment variable for the current session
$env:ONEX_FEATURE = $branchName

if ($Json) {
    $obj = [PSCustomObject]@{ 
        BRANCH_NAME = $branchName
        SPEC_FILE = $specFile
        FEATURE_NUM = $featureNum
        HAS_GIT = $hasGit
    }
    $obj | ConvertTo-Json -Compress
} else {
    Write-Output "BRANCH_NAME: $branchName"
    Write-Output "SPEC_FILE: $specFile"
    Write-Output "FEATURE_NUM: $featureNum"
    Write-Output "HAS_GIT: $hasGit"
    Write-Output "ONEX_FEATURE environment variable set to: $branchName"
}
