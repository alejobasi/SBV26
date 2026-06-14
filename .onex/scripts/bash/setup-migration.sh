#!/usr/bin/env bash
# Resolve all ONEX migration paths from the current branch (read-only, Mac/Linux)

set -euo pipefail

JSON_MODE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)     JSON_MODE=true; shift ;;
        --help|-h)
            echo "Usage: $0 [--json] [--help]"
            echo "  --json   Output results in JSON format"
            exit 0
            ;;
        *) echo "ERROR: Unknown option '$1'." >&2; exit 1 ;;
    esac
done

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
HAS_GIT=$(has_git && echo true || echo false)

# ── Resolve migration ID from current branch ──────────────────────────────────
CURRENT_BRANCH="unknown"
if [[ "$HAS_GIT" == "true" ]]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
fi

MIGRATION_ID=""

if [[ "$CURRENT_BRANCH" =~ ^migrate/ ]]; then
    AFTER_PREFIX="${CURRENT_BRANCH#migrate/}"
    # Strip optional "<TICKET>-" prefix (e.g. "PROJ-123-account-service" → "account-service")
    if [[ "$AFTER_PREFIX" =~ ^[A-Z]+-[0-9]+-(.+)$ ]]; then
        MIGRATION_ID="${BASH_REMATCH[1]}"
    else
        MIGRATION_ID="$AFTER_PREFIX"
    fi
else
    # Fallback: latest directory under .onex/migrations/
    MIGRATIONS_ROOT="$REPO_ROOT/.onex/migrations"
    if [[ -d "$MIGRATIONS_ROOT" ]]; then
        MIGRATION_ID=$(ls -1t "$MIGRATIONS_ROOT" 2>/dev/null | head -n1 || true)
    fi
    if [[ -z "$MIGRATION_ID" ]]; then
        echo "ERROR: Not on a migrate/* branch and no migration directory found." >&2
        echo "  Run onex.migrate.assess first, or: git checkout migrate/<id>" >&2
        exit 1
    fi
    echo "[ONEX] Warning: not on a migrate/* branch — using latest: $MIGRATION_ID" >&2
fi

# ── Build paths ───────────────────────────────────────────────────────────────
MIGRATION_DIR="$REPO_ROOT/.onex/migrations/$MIGRATION_ID"
ASSESSMENT="$MIGRATION_DIR/assessment.md"
MAP="$MIGRATION_DIR/migration-map.md"
PROGRESS="$MIGRATION_DIR/progress.md"
VALIDATION="$MIGRATION_DIR/validation-report.md"

mkdir -p "$MIGRATION_DIR"

# ── Output ─────────────────────────────────────────────────────────────────────
if [[ "$JSON_MODE" == "true" ]]; then
    cat <<EOF
{"MIGRATION_ID":"$MIGRATION_ID","BRANCH":"$CURRENT_BRANCH","MIGRATION_DIR":"$MIGRATION_DIR","ASSESSMENT":"$ASSESSMENT","MAP":"$MAP","PROGRESS":"$PROGRESS","VALIDATION":"$VALIDATION","HAS_GIT":$HAS_GIT,"REPO_ROOT":"$REPO_ROOT"}
EOF
else
    echo "MIGRATION_ID:  $MIGRATION_ID"
    echo "BRANCH:        $CURRENT_BRANCH"
    echo "MIGRATION_DIR: $MIGRATION_DIR"
    echo "ASSESSMENT:    $ASSESSMENT"
    echo "MAP:           $MAP"
    echo "PROGRESS:      $PROGRESS"
    echo "VALIDATION:    $VALIDATION"
    echo "HAS_GIT:       $HAS_GIT"
fi
