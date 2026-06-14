#!/usr/bin/env pwsh
# Scan and reply to GitHub pull request review comments for ONEX.

[CmdletBinding()]
param(
    [ValidateSet('scan', 'apply')]
    [string]$Action,
    [int]$PrNumber,
    [string]$OutputPath,
    [string]$InputPath,
    [string]$Signature = '<!-- ONEX:auto-replied -->',
    [string[]]$TargetAuthors = @(
        'copilot-pull-request-reviewer[bot]',
        'github-copilot[bot]',
        'copilot[bot]'
    ),
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

function Show-Usage {
    Write-Output 'Usage:'
    Write-Output '  ./pr-review-comments.ps1 -Action scan  [-PrNumber 123] [-OutputPath .onex/.pr-review-comments.json]'
    Write-Output '  ./pr-review-comments.ps1 -Action apply [-PrNumber 123] -InputPath .onex/.pr-review-replies.json'
}

function Assert-GitHubCli {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw 'GitHub CLI (gh) is required.'
    }

    & gh auth status | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'GitHub CLI is not authenticated. Run gh auth login first.'
    }
}

function Invoke-GhJson {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $output = & gh @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "gh command failed: gh $($Arguments -join ' ')"
    }

    if ([string]::IsNullOrWhiteSpace($output)) {
        return $null
    }

    return $output | ConvertFrom-Json -Depth 100
}

function Get-RepoContext {
    $repoInfo = Invoke-GhJson -Arguments @('repo', 'view', '--json', 'owner,name')
    $prArgs = @('pr', 'view')

    if ($PrNumber -gt 0) {
        $prArgs += [string]$PrNumber
    }

    $prArgs += @('--json', 'number,url,headRefName,baseRefName')

    $prInfo = Invoke-GhJson -Arguments $prArgs

    return [PSCustomObject]@{
        Owner = $repoInfo.owner.login
        Name = $repoInfo.name
        PullRequest = $prInfo
    }
}

function Get-AllReviewComments {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Owner,
        [Parameter(Mandatory = $true)]
        [string]$Repo,
        [Parameter(Mandatory = $true)]
        [int]$PullRequestNumber
    )

    $allComments = @()
    $page = 1

    while ($true) {
        $endpoint = "repos/$Owner/$Repo/pulls/$PullRequestNumber/comments?per_page=100&page=$page"
        $pageComments = Invoke-GhJson -Arguments @('api', $endpoint)

        if ($null -eq $pageComments) {
            break
        }

        $pageComments = @($pageComments)
        if ($pageComments.Count -eq 0) {
            break
        }

        $allComments += $pageComments

        if ($pageComments.Count -lt 100) {
            break
        }

        $page += 1
    }

    return $allComments
}

function Get-RepliesByParent {
    param(
        [Parameter(Mandatory = $true)]
        [object[]]$Comments
    )

    $replyMap = @{}

    foreach ($comment in $Comments) {
        if ($null -eq $comment.in_reply_to_id) {
            continue
        }

        $parentId = [string]$comment.in_reply_to_id
        if (-not $replyMap.ContainsKey($parentId)) {
            $replyMap[$parentId] = @()
        }

        $replyMap[$parentId] += $comment
    }

    return $replyMap
}

function Test-HasSignedReply {
    param(
        [Parameter(Mandatory = $true)]
        [object[]]$Replies,
        [Parameter(Mandatory = $true)]
        [string]$ReplySignature
    )

    foreach ($reply in $Replies) {
        if ($null -ne $reply.body -and $reply.body -match [regex]::Escape($ReplySignature)) {
            return $true
        }
    }

    return $false
}

function Build-ScanResult {
    param(
        [Parameter(Mandatory = $true)]
        [pscustomobject]$Context,
        [Parameter(Mandatory = $true)]
        [object[]]$Comments,
        [Parameter(Mandatory = $true)]
        [string[]]$Authors,
        [Parameter(Mandatory = $true)]
        [string]$ReplySignature
    )

    $repliesByParent = Get-RepliesByParent -Comments $Comments
    $candidates = @()

    foreach ($comment in $Comments) {
        if ($null -ne $comment.in_reply_to_id) {
            continue
        }

        $authorLogin = $comment.user.login
        if ($Authors -notcontains $authorLogin) {
            continue
        }

        $existingReplies = @()
        $commentIdKey = [string]$comment.id
        if ($repliesByParent.ContainsKey($commentIdKey)) {
            $existingReplies = @($repliesByParent[$commentIdKey])
        }

        if (Test-HasSignedReply -Replies $existingReplies -ReplySignature $ReplySignature) {
            continue
        }

        $candidates += [PSCustomObject]@{
            commentId = $comment.id
            author = $authorLogin
            path = $comment.path
            line = $comment.line
            side = $comment.side
            commitId = $comment.commit_id
            createdAt = $comment.created_at
            url = $comment.html_url
            diffHunk = $comment.diff_hunk
            body = $comment.body
            replyCount = $existingReplies.Count
        }
    }

    return [PSCustomObject]@{
        repository = [PSCustomObject]@{
            owner = $Context.Owner
            name = $Context.Name
        }
        pullRequest = [PSCustomObject]@{
            number = $Context.PullRequest.number
            url = $Context.PullRequest.url
            headRefName = $Context.PullRequest.headRefName
            baseRefName = $Context.PullRequest.baseRefName
        }
        signature = $ReplySignature
        generatedAt = (Get-Date).ToUniversalTime().ToString('o')
        candidateCount = $candidates.Count
        candidates = $candidates
    }
}

function Write-JsonOutput {
    param(
        [Parameter(Mandatory = $true)]
        [object]$Data,
        [string]$Path
    )

    $json = $Data | ConvertTo-Json -Depth 100
    if ($Path) {
        $directory = Split-Path -Parent $Path
        if ($directory) {
            New-Item -ItemType Directory -Path $directory -Force | Out-Null
        }
        Set-Content -Path $Path -Value $json -Encoding UTF8
    }

    Write-Output $json
}

function Get-ResponsesFromFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -Path $Path -PathType Leaf)) {
        throw "Input file not found: $Path"
    }

    $data = Get-Content -Path $Path -Raw -Encoding UTF8 | ConvertFrom-Json -Depth 100
    if ($null -eq $data.responses) {
        throw 'Input JSON must contain a responses array.'
    }

    return @($data.responses)
}

function Invoke-ReplyCreate {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Owner,
        [Parameter(Mandatory = $true)]
        [string]$Repo,
        [Parameter(Mandatory = $true)]
        [int]$PullRequestNumber,
        [Parameter(Mandatory = $true)]
        [long]$CommentId,
        [Parameter(Mandatory = $true)]
        [string]$Body
    )

    $payloadPath = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
    try {
        $payload = @{
            body = $Body
            in_reply_to = $CommentId
        } | ConvertTo-Json -Depth 10 -Compress

        Set-Content -Path $payloadPath -Value $payload -Encoding UTF8
        $endpoint = "repos/$Owner/$Repo/pulls/$PullRequestNumber/comments"
        $output = & gh api --method POST $endpoint --input $payloadPath
        if ($LASTEXITCODE -ne 0) {
            throw "gh api failed while replying to comment $CommentId"
        }

        if ([string]::IsNullOrWhiteSpace($output)) {
            return $null
        }

        return $output | ConvertFrom-Json -Depth 50
    }
    finally {
        if (Test-Path $payloadPath) {
            Remove-Item $payloadPath -Force -ErrorAction SilentlyContinue
        }
    }
}

function Invoke-Scan {
    $context = Get-RepoContext
    $comments = Get-AllReviewComments -Owner $context.Owner -Repo $context.Name -PullRequestNumber $context.PullRequest.number
    $result = Build-ScanResult -Context $context -Comments $comments -Authors $TargetAuthors -ReplySignature $Signature
    Write-JsonOutput -Data $result -Path $OutputPath
}

function Invoke-Apply {
    if (-not $InputPath) {
        throw 'InputPath is required when Action=apply.'
    }

    $context = Get-RepoContext
    $comments = Get-AllReviewComments -Owner $context.Owner -Repo $context.Name -PullRequestNumber $context.PullRequest.number
    $repliesByParent = Get-RepliesByParent -Comments $comments
    $responses = Get-ResponsesFromFile -Path $InputPath

    $posted = @()
    $skipped = @()

    foreach ($response in $responses) {
        $commentId = [long]$response.commentId
        $replyBody = [string]$response.body

        if ([string]::IsNullOrWhiteSpace($replyBody)) {
            $skipped += [PSCustomObject]@{
                commentId = $commentId
                reason = 'empty-body'
            }
            continue
        }

        if ($replyBody -notmatch [regex]::Escape($Signature)) {
            $replyBody = "$replyBody`n`n$Signature"
        }

        $commentIdKey = [string]$commentId
        $existingReplies = @()
        if ($repliesByParent.ContainsKey($commentIdKey)) {
            $existingReplies = @($repliesByParent[$commentIdKey])
        }

        if (Test-HasSignedReply -Replies $existingReplies -ReplySignature $Signature) {
            $skipped += [PSCustomObject]@{
                commentId = $commentId
                reason = 'already-replied'
            }
            continue
        }

        $createdReply = Invoke-ReplyCreate -Owner $context.Owner -Repo $context.Name -PullRequestNumber $context.PullRequest.number -CommentId $commentId -Body $replyBody
        $posted += [PSCustomObject]@{
            commentId = $commentId
            replyUrl = $createdReply.html_url
        }
    }

    $result = [PSCustomObject]@{
        repository = [PSCustomObject]@{
            owner = $context.Owner
            name = $context.Name
        }
        pullRequest = [PSCustomObject]@{
            number = $context.PullRequest.number
            url = $context.PullRequest.url
        }
        appliedAt = (Get-Date).ToUniversalTime().ToString('o')
        postedCount = $posted.Count
        skippedCount = $skipped.Count
        posted = $posted
        skipped = $skipped
    }

    Write-JsonOutput -Data $result -Path $OutputPath
}

if ($Help -or -not $Action) {
    Show-Usage
    exit 0
}

Assert-GitHubCli

switch ($Action) {
    'scan' {
        Invoke-Scan
    }
    'apply' {
        Invoke-Apply
    }
    default {
        throw "Unsupported action: $Action"
    }
}
