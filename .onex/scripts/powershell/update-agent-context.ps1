#!/usr/bin/env pwsh
# Update agent context files with project information from plan.md

param(
    [string]$FeatureDir = "",
    [switch]$Json
)

# Import common functions
. (Join-Path $PSScriptRoot "common.ps1")

$ErrorActionPreference = "Stop"

# Get repo root
$repoRoot = Get-RepoRoot

# Determine feature directory
if (-not $FeatureDir) {
    $feature = Get-CurrentFeature
    if (-not $feature) {
        Write-Error "No feature specified and unable to determine current feature"
        exit 1
    }
    $FeatureDir = Join-Path $repoRoot ".onex/specs/$feature"
}

# Check if plan.md exists
$planFile = Join-Path $FeatureDir "plan.md"
if (-not (Test-Path $planFile)) {
    Write-Error "Plan file not found: $planFile"
    exit 1
}

Write-Host "📖 Reading plan.md..." -ForegroundColor Cyan

# Parse plan.md to extract technical context
$planContent = Get-Content $planFile -Raw

# Extract language
$language = ""
if ($planContent -match '\*\*Language/Version\*\*:\s*([^\n]+)') {
    $language = $matches[1].Trim()
}

# Extract framework
$framework = ""
if ($planContent -match '\*\*Primary Dependencies\*\*:\s*\n-\s*Framework:\s*([^\n]+)') {
    $framework = $matches[1].Trim()
} elseif ($planContent -match '(?:Santander Spring Boot|Gluon|Darwin)[\s\d.]+') {
    $framework = $matches[0].Trim()
}

# Extract database
$database = ""
if ($planContent -match '\*\*Storage\*\*:\s*([^\n]+)') {
    $database = $matches[1].Trim()
}

# Extract project type
$projectType = ""
if ($planContent -match '\*\*Project Type\*\*:\s*([^\n]+)') {
    $projectType = $matches[1].Trim()
}

# Determine if it's Darwin/Gluon or Santander Spring Boot
$isDarwin = $framework -match '(?i)(gluon|darwin)'
$isSantander = $framework -match '(?i)(santander|spring\s*boot)'

# Extract libraries
$libraries = @()
if ($planContent -match '\*\*Primary Dependencies\*\*:\s*\n-\s*Framework:[^\n]+\n-\s*Libraries:\s*([^\n]+)') {
    $libraries = $matches[1] -split ',' | ForEach-Object { $_.Trim() }
}

Write-Host "  Language: $language" -ForegroundColor Gray
Write-Host "  Framework: $framework" -ForegroundColor Gray
Write-Host "  Database: $database" -ForegroundColor Gray
Write-Host "  Project Type: $projectType" -ForegroundColor Gray

# Determine which agent files to update
$agentFiles = @()

# VS Code Copilot (.github/agents/copilot-instructions.md)
$copilotAgentFile = Join-Path $repoRoot ".github/agents/copilot-instructions.md"
$agentFiles += $copilotAgentFile

# Check if agent file exists, create from template if not
$templateFile = Join-Path $PSScriptRoot "../../templates/agent-file-template.md"

foreach ($agentFile in $agentFiles) {
    $agentDir = Split-Path $agentFile -Parent
    
    # Create directory if it doesn't exist
    if (-not (Test-Path $agentDir)) {
        New-Item -ItemType Directory -Path $agentDir -Force | Out-Null
        Write-Host "  Created directory: $agentDir" -ForegroundColor Green
    }
    
    # Create from template if file doesn't exist
    if (-not (Test-Path $agentFile)) {
        if (Test-Path $templateFile) {
            Copy-Item $templateFile $agentFile
            Write-Host "  Created agent file from template: $agentFile" -ForegroundColor Green
        } else {
            # Create minimal agent file
            $minimalContent = @'
# AI Agent Instructions

<!-- SPECIFY:START:TECH_STACK -->
<!-- Technology stack will be automatically updated here -->
<!-- SPECIFY:END:TECH_STACK -->

<!-- SPECIFY:START:PROJECT_STRUCTURE -->
<!-- Project structure will be automatically updated here -->
<!-- SPECIFY:END:PROJECT_STRUCTURE -->

<!-- SPECIFY:START:COMMANDS -->
<!-- Available ONEX commands will be listed here -->
<!-- SPECIFY:END:COMMANDS -->

## Development Guidelines

Follow best practices for the technology stack in use.

'@
            Set-Content -Path $agentFile -Value $minimalContent
            Write-Host "  Created minimal agent file: $agentFile" -ForegroundColor Green
        }
    }
}

# Update each agent file
Write-Host "`n🔄 Updating agent context..." -ForegroundColor Cyan

foreach ($agentFile in $agentFiles) {
    if (-not (Test-Path $agentFile)) {
        Write-Warning "Agent file not found: $agentFile"
        continue
    }
    
    $content = Get-Content $agentFile -Raw
    
    # Build tech stack section
    $techStackSection = @"
**Language**: $language
**Framework**: $framework
**Database**: $database
**Project Type**: $projectType
"@
    
    if ($libraries.Count -gt 0) {
        $techStackSection += "`n**Key Libraries**: $($libraries -join ', ')"
    }
    
    # Add framework-specific resources
    if ($isDarwin) {
        $techStackSection += @'

**Framework Resources**:
- Darwin Gateway documentation in `backend/agents/darwin-gateway/`
- Gluon Java experts in `backend/agents/darwin-java-expert/`
- Use `/ONEX.clarify` for Gateway configuration questions
'@
    } elseif ($isSantander) {
        $techStackSection += @'

**Framework Resources**:
- Santander Spring Boot expert in `backend/agents/santander-springboot-expert/`
- Use `/ONEX.clarify` for framework-specific questions
'@
    }
    
    # Replace TECH_STACK section
    if ($content -match '<!-- SPECIFY:START:TECH_STACK -->.*?<!-- SPECIFY:END:TECH_STACK -->') {
        $content = $content -replace '(?s)<!-- SPECIFY:START:TECH_STACK -->.*?<!-- SPECIFY:END:TECH_STACK -->', 
            "<!-- SPECIFY:START:TECH_STACK -->`n$techStackSection`n<!-- SPECIFY:END:TECH_STACK -->"
    }
    
    # Build project structure section
    $projectStructure = @'
```
.onex/
  ├── specs/
  │   └── [feature-id]-[feature-name]/
  │       ├── spec.md           # Feature specification
  │       ├── plan.md           # Implementation plan
  │       ├── research.md       # Technical decisions
  │       ├── data-model.md     # Data models
  │       ├── quickstart.md     # Setup guide
  │       ├── contracts/        # API contracts
  │       └── tasks.md          # Implementation tasks
```
'@
    
    # Replace PROJECT_STRUCTURE section
    if ($content -match '<!-- SPECIFY:START:PROJECT_STRUCTURE -->.*?<!-- SPECIFY:END:PROJECT_STRUCTURE -->') {
        $content = $content -replace '(?s)<!-- SPECIFY:START:PROJECT_STRUCTURE -->.*?<!-- SPECIFY:END:PROJECT_STRUCTURE -->', 
            "<!-- SPECIFY:START:PROJECT_STRUCTURE -->`n$projectStructure`n<!-- SPECIFY:END:PROJECT_STRUCTURE -->"
    }
    
    # Build commands section with skills/toolsets integration
    $commandsSection = @'
## ONEX Commands

- `/ONEX.constitution` - Define project principles
- `/ONEX.specify` - Create feature specification
- `/ONEX.clarify` - Clarify underspecified areas
- `/ONEX.plan` - Generate implementation plan
- `/ONEX.tasks` - Break down into tasks
- `/ONEX.analyze` - Analyze consistency
- `/ONEX.implement` - Execute implementation
- `/ONEX.checklist` - Generate quality checklist
- `/ONEX.taskstoissues` - Convert tasks to GitHub Issues

## Available Skills

'@
    
    # Add relevant skills based on project type
    if ($projectType -match '(?i)microservice') {
        $commandsSection += "- **API Design** (`backend/skills/api-design.skill/`)`n"
        $commandsSection += "- **Backend Java Microservices** (`backend/skills/backend-java-microservices.skill/`)`n"
    }
    
    if ($database) {
        $commandsSection += "- **Database Optimization** (`backend/skills/database-optimization.skill/`)`n"
    }
    
    $commandsSection += "- **Performance Tuning** (`backend/skills/performance-tuning.skill/`)`n"
    $commandsSection += "- **Troubleshooting** (`backend/skills/troubleshooting.skill/`)`n"
    
    $commandsSection += "`n## Quality Toolsets`n"
    $commandsSection += "- SonarQube (`backend/toolsets/sonarqube-java.toolsets.jsonc`)`n"
    $commandsSection += "- Checkstyle (`backend/toolsets/checkstyle-code-style.toolsets.jsonc`)`n"
    $commandsSection += "- JaCoCo (`backend/toolsets/jacoco-coverage.toolsets.jsonc`)`n"
    $commandsSection += "- PMD (`backend/toolsets/pmd-code-analysis.toolsets.jsonc`)`n"
    $commandsSection += "- SpotBugs (`backend/toolsets/spotbugs-bug-detection.toolsets.jsonc`)`n"
    
    # Replace COMMANDS section
    if ($content -match '<!-- SPECIFY:START:COMMANDS -->.*?<!-- SPECIFY:END:COMMANDS -->') {
        $content = $content -replace '(?s)<!-- SPECIFY:START:COMMANDS -->.*?<!-- SPECIFY:END:COMMANDS -->', 
            "<!-- SPECIFY:START:COMMANDS -->`n$commandsSection`n<!-- SPECIFY:END:COMMANDS -->"
    }
    
    # Write updated content
    Set-Content -Path $agentFile -Value $content
    Write-Host "  Updated: $agentFile" -ForegroundColor Green
}

Write-Host "`n✅ Agent context updated successfully!" -ForegroundColor Green

if ($Json) {
    $output = @{
        success = $true
        language = $language
        framework = $framework
        database = $database
        projectType = $projectType
        agentFiles = $agentFiles
    }
    Write-Output ($output | ConvertTo-Json -Depth 10)
}
