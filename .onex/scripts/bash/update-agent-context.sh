#!/usr/bin/env bash
# Update agent context files with project information from plan.md (Mac/Linux)

set -euo pipefail

JSON_MODE=false
FEATURE_DIR=""

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --feature-dir=*)
            FEATURE_DIR="${arg#*=}"
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--feature-dir=<path>]"
            exit 0
            ;;
        *)
            echo "ERROR: Unknown option '$arg'. Use --help for usage." >&2
            exit 1
            ;;
    esac
done

# Source common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT="$(get_repo_root)"

# Determine feature directory
if [[ -z "$FEATURE_DIR" ]]; then
    CURRENT_BRANCH="$(get_current_branch)"
    FEATURE_DIR="$(find_feature_dir_by_prefix "$REPO_ROOT" "$CURRENT_BRANCH")"
fi

PLAN_FILE="$FEATURE_DIR/plan.md"

if [[ ! -f "$PLAN_FILE" ]]; then
    echo "ERROR: Plan file not found: $PLAN_FILE" >&2
    exit 1
fi

echo "📖 Reading plan.md..."

PLAN_CONTENT="$(cat "$PLAN_FILE")"

# Extract fields from plan.md
LANGUAGE=""
if echo "$PLAN_CONTENT" | grep -qP '\*\*Language/Version\*\*:'; then
    LANGUAGE="$(echo "$PLAN_CONTENT" | grep -P '\*\*Language/Version\*\*:' | head -1 | sed 's/.*\*\*Language\/Version\*\*:\s*//' | xargs)"
fi

FRAMEWORK=""
if echo "$PLAN_CONTENT" | grep -qP '^\s*-\s*Framework:'; then
    FRAMEWORK="$(echo "$PLAN_CONTENT" | grep -P '^\s*-\s*Framework:' | head -1 | sed 's/.*Framework:\s*//' | xargs)"
fi
if [[ -z "$FRAMEWORK" ]]; then
    FRAMEWORK="$(echo "$PLAN_CONTENT" | grep -oE '(Santander Spring Boot|Gluon|Darwin)[[:space:][:digit:].]*' | head -1 | xargs || true)"
fi

DATABASE=""
if echo "$PLAN_CONTENT" | grep -qP '\*\*Storage\*\*:'; then
    DATABASE="$(echo "$PLAN_CONTENT" | grep -P '\*\*Storage\*\*:' | head -1 | sed 's/.*\*\*Storage\*\*:\s*//' | xargs)"
fi

PROJECT_TYPE=""
if echo "$PLAN_CONTENT" | grep -qP '\*\*Project Type\*\*:'; then
    PROJECT_TYPE="$(echo "$PLAN_CONTENT" | grep -P '\*\*Project Type\*\*:' | head -1 | sed 's/.*\*\*Project Type\*\*:\s*//' | xargs)"
fi

IS_DARWIN=false
IS_SANTANDER=false
echo "$FRAMEWORK" | grep -qiE '(gluon|darwin)'      && IS_DARWIN=true    || true
echo "$FRAMEWORK" | grep -qiE '(santander|spring)'  && IS_SANTANDER=true || true

echo "  Language:     $LANGUAGE"
echo "  Framework:    $FRAMEWORK"
echo "  Database:     $DATABASE"
echo "  Project Type: $PROJECT_TYPE"

# ── Agent file path ──────────────────────────────────────────────────────────
AGENT_FILE="$REPO_ROOT/.github/agents/copilot-instructions.md"
TEMPLATE_FILE="$SCRIPT_DIR/../../templates/agent-file-template.md"
AGENT_DIR="$(dirname "$AGENT_FILE")"

mkdir -p "$AGENT_DIR"

if [[ ! -f "$AGENT_FILE" ]]; then
    if [[ -f "$TEMPLATE_FILE" ]]; then
        cp "$TEMPLATE_FILE" "$AGENT_FILE"
        echo "  Created agent file from template: $AGENT_FILE"
    else
        cat > "$AGENT_FILE" <<'MINIMAL'
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
MINIMAL
        echo "  Created minimal agent file: $AGENT_FILE"
    fi
fi

# ── Build replacement sections ────────────────────────────────────────────────
TECH_STACK="**Language**: $LANGUAGE
**Framework**: $FRAMEWORK
**Database**: $DATABASE
**Project Type**: $PROJECT_TYPE"

if $IS_DARWIN; then
    TECH_STACK="$TECH_STACK

**Framework Resources**:
- Darwin Gateway documentation in \`backend/agents/darwin-gateway/\`
- Gluon Java experts in \`backend/agents/darwin-java-expert/\`
- Use \`/onex.clarify\` for Gateway configuration questions"
elif $IS_SANTANDER; then
    TECH_STACK="$TECH_STACK

**Framework Resources**:
- Santander Spring Boot expert in \`backend/agents/santander-springboot-expert/\`
- Use \`/onex.clarify\` for framework-specific questions"
fi

PROJECT_STRUCTURE="\`\`\`
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
\`\`\`"

COMMANDS_SECTION="## ONEX Commands

- \`/onex.constitution\` - Define project principles
- \`/onex.specify\` - Create feature specification
- \`/onex.clarify\` - Clarify underspecified areas
- \`/onex.plan\` - Generate implementation plan
- \`/onex.tasks\` - Break down into tasks
- \`/onex.analyze\` - Analyze consistency
- \`/onex.implement\` - Execute implementation
- \`/onex.checklist\` - Generate quality checklist
- \`/onex.taskstoissues\` - Convert tasks to Jira issues

## Available Skills"

echo "$PROJECT_TYPE" | grep -qiE 'microservice' && COMMANDS_SECTION="$COMMANDS_SECTION
- **API Design** (\`backend/skills/api-design.skill/\`)
- **Backend Java Microservices** (\`backend/skills/backend-java-microservices.skill/\`)" || true

[[ -n "$DATABASE" ]] && COMMANDS_SECTION="$COMMANDS_SECTION
- **Database Optimization** (\`backend/skills/database-optimization.skill/\`)" || true

COMMANDS_SECTION="$COMMANDS_SECTION
- **Performance Tuning** (\`backend/skills/performance-tuning.skill/\`)
- **Troubleshooting** (\`backend/skills/troubleshooting.skill/\`)

## Quality Toolsets
- SonarQube (\`backend/toolsets/sonarqube-java.toolsets.jsonc\`)
- Checkstyle (\`backend/toolsets/checkstyle-code-style.toolsets.jsonc\`)
- JaCoCo (\`backend/toolsets/jacoco-coverage.toolsets.jsonc\`)
- PMD (\`backend/toolsets/pmd-code-analysis.toolsets.jsonc\`)
- SpotBugs (\`backend/toolsets/spotbugs-bug-detection.toolsets.jsonc\`)"

# ── Apply replacements using Python (portable sed for multi-line blocks) ──────
python3 - "$AGENT_FILE" <<PYEOF
import sys, re

path = sys.argv[1]
content = open(path).read()

tech_stack   = """${TECH_STACK}"""
proj_struct  = """${PROJECT_STRUCTURE}"""
commands     = """${COMMANDS_SECTION}"""

def replace_block(text, tag, replacement):
    pattern = f'<!-- SPECIFY:START:{tag} -->.*?<!-- SPECIFY:END:{tag} -->'
    repl = f'<!-- SPECIFY:START:{tag} -->\n{replacement}\n<!-- SPECIFY:END:{tag} -->'
    return re.sub(pattern, repl, text, flags=re.DOTALL)

content = replace_block(content, 'TECH_STACK',        tech_stack)
content = replace_block(content, 'PROJECT_STRUCTURE', proj_struct)
content = replace_block(content, 'COMMANDS',          commands)

open(path, 'w').write(content)
print(f"  Updated: {path}")
PYEOF

echo ""
echo "✅ Agent context updated successfully!"

if $JSON_MODE; then
    python3 -c "
import json
print(json.dumps({
    'success': True,
    'language': '${LANGUAGE}',
    'framework': '${FRAMEWORK}',
    'database': '${DATABASE}',
    'projectType': '${PROJECT_TYPE}',
    'agentFiles': ['${AGENT_FILE}']
}, indent=2))
"
fi
