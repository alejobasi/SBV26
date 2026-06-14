#!/usr/bin/env bash

# Create a new feature specification for Santander projects (Mac/Linux)

set -euo pipefail

# Defaults
JSON_MODE=false
FEATURE_NUM=0
SHORT_NAME=""
FEATURE_DESC=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)
            JSON_MODE=true
            shift
            ;;
        --number)
            FEATURE_NUM="$2"
            shift 2
            ;;
        --short-name)
            SHORT_NAME="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--number <n>] [--short-name <name>] \"<feature description>\""
            echo ""
            echo "Examples:"
            echo "  $0 'Add Darwin Gateway authentication'"
            echo "  $0 --number 5 --short-name 'gateway-auth' 'Add Darwin Gateway authentication'"
            exit 0
            ;;
        -*)
            echo "ERROR: Unknown option '$1'. Use --help for usage." >&2
            exit 1
            ;;
        *)
            FEATURE_DESC="$1"
            shift
            ;;
    esac
done

if [[ -z "$FEATURE_DESC" ]]; then
    echo "ERROR: Feature description is required." >&2
    echo "Usage: $0 [--json] [--number <n>] [--short-name <name>] \"<description>\"" >&2
    exit 1
fi

# Source common functions
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
SPECS_DIR="$REPO_ROOT/.onex/specs"
mkdir -p "$SPECS_DIR"

# Helper: highest number from existing spec dirs
highest_from_specs() {
    local highest=0
    if [[ -d "$SPECS_DIR" ]]; then
        while IFS= read -r dir; do
            local name
            name=$(basename "$dir")
            if [[ "$name" =~ ^([0-9]+)- ]]; then
                local n="${BASH_REMATCH[1]}"
                n=$((10#$n))  # strip leading zeros
                [[ $n -gt $highest ]] && highest=$n
            fi
        done < <(find "$SPECS_DIR" -maxdepth 1 -mindepth 1 -type d 2>/dev/null || true)
    fi
    echo "$highest"
}

# Helper: highest number from git branches
highest_from_branches() {
    local highest=0
    if has_git; then
        while IFS= read -r branch; do
            if [[ "$branch" =~ ([0-9]{3})- ]]; then
                local n="${BASH_REMATCH[1]}"
                n=$((10#$n))
                [[ $n -gt $highest ]] && highest=$n
            fi
        done < <(git branch -a 2>/dev/null || true)
    fi
    echo "$highest"
}

# Determine feature number
if [[ "$FEATURE_NUM" -le 0 ]]; then
    specs_high=$(highest_from_specs)
    branch_high=$(highest_from_branches)
    max=$specs_high
    [[ $branch_high -gt $max ]] && max=$branch_high
    FEATURE_NUM=$((max + 1))
fi

# Generate short name if not provided
if [[ -z "$SHORT_NAME" ]]; then
    SHORT_NAME=$(echo "$FEATURE_DESC" | tr '[:upper:]' '[:lower:]' \
        | tr -s ' ' '-' \
        | sed 's/[^a-z0-9-]//g' \
        | cut -c1-40)
fi

BRANCH_NAME="ONEX-$(printf '%03d' "$FEATURE_NUM")-${SHORT_NAME}"

# Create Git branch
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
    echo "[ONEX] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME" >&2
fi

# Create spec directory and file
FEATURE_DIR="$SPECS_DIR/$BRANCH_NAME"
mkdir -p "$FEATURE_DIR"

TEMPLATE="$REPO_ROOT/.onex/templates/spec-template.md"
SPEC_FILE="$FEATURE_DIR/spec.md"

if [[ -f "$TEMPLATE" ]]; then
    cp "$TEMPLATE" "$SPEC_FILE"
else
    touch "$SPEC_FILE"
fi

# Set environment variable for current session
export ONEX_FEATURE="$BRANCH_NAME"

if $JSON_MODE; then
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","FEATURE_NUM":%d,"HAS_GIT":%s}\n' \
        "$BRANCH_NAME" "$SPEC_FILE" "$FEATURE_NUM" "$HAS_GIT_REPO"
else
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "SPEC_FILE: $SPEC_FILE"
    echo "FEATURE_NUM: $FEATURE_NUM"
    echo "HAS_GIT: $HAS_GIT_REPO"
    echo "ONEX_FEATURE environment variable set to: $BRANCH_NAME"
fi
