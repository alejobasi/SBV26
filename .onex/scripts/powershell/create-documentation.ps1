#!/usr/bin/env pwsh

[CmdletBinding()]
param(
    [string]$ShortName,
    [string]$TicketKey = '',
    [ValidateSet('legacy','target','hybrid','')]
    [string]$SystemKind = '',
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: ./create-documentation.ps1 -ShortName <name> [-TicketKey <key>] [-SystemKind legacy|target|hybrid] [-Json]"
    exit 0
}

if (-not $ShortName) {
    Write-Error "ERROR: -ShortName is required."
    exit 1
}

. "$PSScriptRoot/common.ps1"

$repoRoot = Get-RepoRoot
$hasGit = Test-HasGit

$docId = $ShortName.ToLower() -replace '\s+', '-' -replace '[^a-z0-9-]', '' -replace '-+', '-'
$docId = $docId.Trim('-')
$docId = $docId.Substring(0, [Math]::Min($docId.Length, 50))

$branchName = if ($TicketKey) { "docs/$TicketKey-$docId" } else { "docs/$docId" }
$docsRoot = Join-Path $repoRoot '.onex/docs'
$docDir = Join-Path $docsRoot $docId
$templatesDir = Join-Path $repoRoot '.onex/templates'

$assessmentFile = Join-Path $docDir 'assessment.md'
$deliverablesFile = Join-Path $docDir 'deliverables-index.md'
$functionalDocFile = Join-Path $docDir 'functional-documentation.md'
$sourceReviewFile = Join-Path $docDir 'source-review-log.md'
$evidenceFile = Join-Path $docDir 'evidence-index.md'
$contextFile = Join-Path $docDir 'santander-context.md'
$coverageFile = Join-Path $docDir 'coverage-matrix.md'
$documentationFile = Join-Path $docDir 'technical-documentation.md'
$publicationMapFile = Join-Path $docDir 'publication-map.md'
$publicationFile = Join-Path $docDir 'publication-log.md'

if ($hasGit) {
    try {
        git checkout -b $branchName 2>$null
        if ($LASTEXITCODE -ne 0) {
            git checkout $branchName 2>$null
        }
    } catch {
        Write-Warning "[ONEX] Git branch operation failed, continuing anyway"
    }
}

New-Item -ItemType Directory -Path $docDir -Force | Out-Null

$templateMap = @{
    'documentation-assessment-template.md' = $assessmentFile
    'documentation-deliverables-template.md' = $deliverablesFile
    'documentation-functional-template.md' = $functionalDocFile
    'documentation-source-review-template.md' = $sourceReviewFile
    'documentation-evidence-template.md' = $evidenceFile
    'documentation-context-template.md' = $contextFile
    'documentation-coverage-template.md' = $coverageFile
    'documentation-technical-template.md' = $documentationFile
    'documentation-publication-map-template.md' = $publicationMapFile
    'documentation-publication-template.md' = $publicationFile
}

foreach ($templateName in $templateMap.Keys) {
    $destination = $templateMap[$templateName]
    $source = Join-Path $templatesDir $templateName
    $resolvedSystemKind = if ($SystemKind) { $SystemKind } else { 'pending' }

    if (Test-Path $destination) {
        continue
    }

    if (Test-Path $source) {
        $content = Get-Content $source -Raw
        $content = $content -replace '\{\{DOC_ID\}\}', $docId
        $content = $content -replace '\{\{SYSTEM_KIND\}\}', $resolvedSystemKind
        Set-Content $destination -Value $content -Encoding UTF8
    } else {
        New-Item -ItemType File -Path $destination -Force | Out-Null
    }
}

if ($Json) {
    [PSCustomObject]@{
        DOC_ID = $docId
        BRANCH = $branchName
        DOC_DIR = $docDir
        ASSESSMENT = $assessmentFile
        DELIVERABLES = $deliverablesFile
        FUNCTIONAL_DOCUMENTATION = $functionalDocFile
        SOURCE_REVIEW = $sourceReviewFile
        EVIDENCE = $evidenceFile
        CONTEXT = $contextFile
        COVERAGE = $coverageFile
        DOCUMENTATION = $documentationFile
        PUBLICATION_MAP = $publicationMapFile
        PUBLICATION = $publicationFile
        SYSTEM_KIND = $SystemKind
        HAS_GIT = $hasGit
    } | ConvertTo-Json -Compress
} else {
    Write-Output "DOC_ID: $docId"
    Write-Output "BRANCH: $branchName"
    Write-Output "DOC_DIR: $docDir"
}