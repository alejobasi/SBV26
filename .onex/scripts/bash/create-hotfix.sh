#!/usr/bin/env bash
# Create a hotfix branch and initial report for a production incident (Mac/Linux)

set -euo pipefail

# Defaults
JSON_MODE=false
INCIDENT_KEY=""
DESCRIPTION=""
SEVERITY="P1"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --incident-key|-k)
            INCIDENT_KEY="$2"; shift 2 ;;
        --description|-d)
            DESCRIPTION="$2"; shift 2 ;;
        --severity|-s)
            SEVERITY="$2"; shift 2 ;;
        --json)
            JSON_MODE=true; shift ;;
        --help|-h)
            echo "Usage: $0 --description <desc> [--incident-key <key>] [--severity P1|P2|P3] [--json]"
            echo ""
            echo "Examples:"
            echo "  $0 --description 'null-pointer-payment' --incident-key 'INC-456' --severity P1"
            echo "  $0 --description 'login-timeout' --severity P2"
            exit 0 ;;
        -*)
            echo "ERROR: Unknown option '$1'. Use --help for usage." >&2; exit 1 ;;
        *)
            # Positional: treat as description if not yet set
            [[ -z "$DESCRIPTION" ]] && DESCRIPTION="$1" || true
            shift ;;
    esac
done

if [[ -z "$DESCRIPTION" ]]; then
    echo "ERROR: --description is required (short kebab-case description for branch name)." >&2
    exit 1
fi

# Validate severity
case "$SEVERITY" in
    P1|P2|P3) ;;
    *) echo "ERROR: --severity must be P1, P2 or P3 (got: $SEVERITY)." >&2; exit 1 ;;
esac

# Normalize description
SHORT_DESC=$(echo "$DESCRIPTION" \
    | tr '[:upper:]' '[:lower:]' \
    | tr -s ' ' '-' \
    | sed 's/[^a-z0-9-]//g' \
    | sed 's/-\+/-/g' \
    | cut -c1-50)

# Source common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
HOTFIX_DIR="$REPO_ROOT/.onex/hotfixes"
mkdir -p "$HOTFIX_DIR"

NOW=$(date -u '+%Y-%m-%d %H:%M UTC' 2>/dev/null || date '+%Y-%m-%d %H:%M UTC')
TIMESTAMP=$(date -u '+%Y%m%d-%H%M' 2>/dev/null || date '+%Y%m%d-%H%M')

# Determine branch name and report filename
if [[ -n "$INCIDENT_KEY" ]]; then
    BRANCH_NAME="fix/${INCIDENT_KEY}-${SHORT_DESC}"
    REPORT_NAME="${INCIDENT_KEY}.md"
    INC_DISPLAY="$INCIDENT_KEY"
    JIRA_URL="https://santander.atlassian.net/browse/${INCIDENT_KEY}"
else
    BRANCH_NAME="fix/${SHORT_DESC}"
    REPORT_NAME="hotfix-${TIMESTAMP}.md"
    INC_DISPLAY="No ticket"
    JIRA_URL="N/A"
fi

REPORT_FILE="$HOTFIX_DIR/$REPORT_NAME"

# Create fix branch
HAS_GIT_REPO="false"
if has_git; then
    HAS_GIT_REPO="true"
    if git checkout -b "$BRANCH_NAME" 2>/dev/null; then
        echo "[ONEX] Created and checked out branch: $BRANCH_NAME" >&2
    else
        git checkout "$BRANCH_NAME" 2>/dev/null || true
        echo "[ONEX] Checked out existing branch: $BRANCH_NAME" >&2
    fi
else
    echo "[ONEX] Warning: Git not detected — skipping branch creation for $BRANCH_NAME" >&2
fi

# Generate hotfix report markdown
cat > "$REPORT_FILE" <<MDEOF
# Hotfix Report — ${INC_DISPLAY}

> Generated with ONEX \`/onex-fix.hotfix\` — updated automatically during the hotfix cycle.
> **Do not edit manually while the hotfix is in progress.**

## Incident

| Field | Value |
|-------|-------|
| Key | ${INC_DISPLAY} |
| Severity | ${SEVERITY} |
| Date | ${NOW} |
| Branch | ${BRANCH_NAME} |
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

- **Incident**: [${INC_DISPLAY}](${JIRA_URL})
- **Sub-tasks created**: _To be filled by agent — Step 6_

---
Generated with ONEX \`/onex-fix.hotfix\`
Workflow: `hotfix`
Source branch: `${BRANCH_NAME}`
Revision: `_To be filled by agent — Step 5_`
Date: `${NOW}`
MDEOF

echo "[ONEX] Hotfix report created: $REPORT_FILE" >&2

# Initial commit
if has_git; then
    git add "$REPORT_FILE" 2>/dev/null || true
    if git commit -m "ONEX_docs(hotfix): init report for ${INC_DISPLAY}" 2>/dev/null; then
        echo "[ONEX] Initial commit created" >&2
    else
        echo "[ONEX] Warning: could not commit report — stage and commit manually" >&2
    fi
fi

if $JSON_MODE; then
    printf '{"BRANCH_NAME":"%s","REPORT_FILE":"%s","INCIDENT_KEY":"%s","SEVERITY":"%s","HAS_GIT":%s}\n' \
        "$BRANCH_NAME" "$REPORT_FILE" "$INC_DISPLAY" "$SEVERITY" "$HAS_GIT_REPO"
else
    echo "BRANCH_NAME:  $BRANCH_NAME"
    echo "REPORT_FILE:  $REPORT_FILE"
    echo "INCIDENT_KEY: $INC_DISPLAY"
    echo "SEVERITY:     $SEVERITY"
    echo "HAS_GIT:      $HAS_GIT_REPO"
fi
