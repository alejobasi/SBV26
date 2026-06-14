#!/usr/bin/env pwsh

[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: ./setup-documentation.ps1 [-Json]"
    exit 0
}

. "$PSScriptRoot/common.ps1"

$repoRoot = Get-RepoRoot
$hasGit = Test-HasGit
$docsRoot = Join-Path $repoRoot '.onex/docs'

$currentBranch = ''
if ($hasGit) {
    try {
        $currentBranch = (git rev-parse --abbrev-ref HEAD 2>$null).Trim()
    } catch {}
}

$docId = ''
if ($currentBranch -match '^docs/(?:[A-Z]+-\d+-)?(.+)$') {
    $docId = $matches[1]
}

if (-not $docId) {
    if (Test-Path $docsRoot) {
        $latest = Get-ChildItem -Path $docsRoot -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($latest) {
            $docId = $latest.Name
        }
    }
}

if (-not $docId) {
    Write-Error "ERROR: No documentation context found. Run /onex.doc.assess first."
    exit 1
}

$docDir = Join-Path $docsRoot $docId
New-Item -ItemType Directory -Path $docDir -Force | Out-Null

$result = [PSCustomObject]@{
    DOC_ID = $docId
    BRANCH = $currentBranch
    DOC_DIR = $docDir
    ASSESSMENT = (Join-Path $docDir 'assessment.md')
    DELIVERABLES = (Join-Path $docDir 'deliverables-index.md')
    FUNCTIONAL_DOCUMENTATION = (Join-Path $docDir 'functional-documentation.md')
    SOURCE_REVIEW = (Join-Path $docDir 'source-review-log.md')
    EVIDENCE = (Join-Path $docDir 'evidence-index.md')
    CONTEXT = (Join-Path $docDir 'santander-context.md')
    COVERAGE = (Join-Path $docDir 'coverage-matrix.md')
    DOCUMENTATION = (Join-Path $docDir 'technical-documentation.md')
    PUBLICATION_MAP = (Join-Path $docDir 'publication-map.md')
    PUBLICATION = (Join-Path $docDir 'publication-log.md')
    REPO_ROOT = $repoRoot
    HAS_GIT = $hasGit
}

if ($Json) {
    $result | ConvertTo-Json -Compress
} else {
    Write-Output "DOC_ID: $($result.DOC_ID)"
    Write-Output "DOC_DIR: $($result.DOC_DIR)"
}