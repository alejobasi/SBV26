#!/usr/bin/env bash

# Setup implementation plan for a Santander feature (Mac/Linux)

set -euo pipefail

JSON_MODE=false

for arg in "$@"; do
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --help|-h)
            echo "Usage: $0 [--json]"
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

# Get all feature paths
eval "$(get_feature_paths)"

# Validate branch
check_feature_branch "$CURRENT_BRANCH" "$HAS_GIT" || exit 1

# Ensure feature directory exists
mkdir -p "$FEATURE_DIR"

# Copy plan template only if IMPL_PLAN does not already exist (never overwrite!)
if [[ ! -f "$IMPL_PLAN" ]]; then
    TEMPLATE="$REPO_ROOT/.onex/templates/plan-template.md"
    if [[ -f "$TEMPLATE" ]]; then
        cp "$TEMPLATE" "$IMPL_PLAN"
        echo "[ONEX] Copied plan template to $IMPL_PLAN" >&2
    else
        echo "[ONEX] Warning: plan template not found at $TEMPLATE" >&2
        touch "$IMPL_PLAN"
    fi
else
    echo "[ONEX] Plan already exists at $IMPL_PLAN, skipping template copy" >&2
fi

if $JSON_MODE; then
    printf '{"FEATURE_SPEC":"%s","IMPL_PLAN":"%s","SPECS_DIR":"%s","BRANCH":"%s","HAS_GIT":%s}\n' \
        "$FEATURE_SPEC" "$IMPL_PLAN" "$FEATURE_DIR" "$CURRENT_BRANCH" "$HAS_GIT"
else
    echo "FEATURE_SPEC: $FEATURE_SPEC"
    echo "IMPL_PLAN: $IMPL_PLAN"
    echo "SPECS_DIR: $FEATURE_DIR"
    echo "BRANCH: $CURRENT_BRANCH"
    echo "HAS_GIT: $HAS_GIT"
fi
