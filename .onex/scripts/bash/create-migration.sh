#!/usr/bin/env bash
# Bootstrap a new ONEX migration: branch + directory + template files (Mac/Linux)

set -euo pipefail

JSON_MODE=false
SHORT_NAME=""
TYPE=""
TICKET_KEY=""

usage() {
    echo "Usage: $0 --short-name <name> [--type A|B|C|D|E] [--ticket <key>] [--json]"
    echo ""
    echo "Examples:"
    echo "  $0 --short-name account-service --type A"
    echo "  $0 --short-name shell-spa --type B --ticket PROJ-456"
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json)         JSON_MODE=true; shift ;;
        --short-name)   SHORT_NAME="$2"; shift 2 ;;
        --type)         TYPE="$2"; shift 2 ;;
        --ticket)       TICKET_KEY="$2"; shift 2 ;;
        --help|-h)      usage; exit 0 ;;
        *) echo "ERROR: Unknown option '$1'. Use --help for usage." >&2; exit 1 ;;
    esac
done

if [[ -z "$SHORT_NAME" ]]; then
    echo "ERROR: --short-name is required." >&2
    usage >&2
    exit 1
fi

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
HAS_GIT=$(has_git && echo true || echo false)

# Normalize id
ID=$(echo "$SHORT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]/-/g; s/[^a-z0-9-]//g; s/-\+/-/g' | cut -c1-50 | sed 's/-$//')

# Branch name
if [[ -n "$TICKET_KEY" ]]; then
    BRANCH="migrate/${TICKET_KEY}-${ID}"
else
    BRANCH="migrate/${ID}"
fi

MIGRATIONS_ROOT="$REPO_ROOT/.onex/migrations"
MIGRATION_DIR="$MIGRATIONS_ROOT/$ID"
TEMPLATES_DIR="$REPO_ROOT/.onex/templates"

ASSESSMENT="$MIGRATION_DIR/assessment.md"
MAP="$MIGRATION_DIR/migration-map.md"
PROGRESS="$MIGRATION_DIR/progress.md"
VALIDATION="$MIGRATION_DIR/validation-report.md"

# ── 1. Create branch ──────────────────────────────────────────────────────────
if [[ "$HAS_GIT" == "true" ]]; then
    if git checkout -b "$BRANCH" 2>/dev/null; then
        echo "[ONEX] Created branch: $BRANCH"
    else
        git checkout "$BRANCH" 2>/dev/null || true
        echo "[ONEX] Checked out existing branch: $BRANCH"
    fi
else
    echo "[ONEX] Git not detected — skipping branch creation"
fi

# ── 2. Create migration directory ─────────────────────────────────────────────
mkdir -p "$MIGRATION_DIR"
echo "[ONEX] Migration directory: $MIGRATION_DIR"

# ── 3. Copy templates (never overwrite) ───────────────────────────────────────
copy_template() {
    local tmpl_name="$1"
    local dest="$2"
    local src="$TEMPLATES_DIR/$tmpl_name"

    if [[ -f "$dest" ]]; then
        echo "[ONEX] Already exists, skipping: $(basename "$dest")"
        return
    fi

    if [[ -f "$src" ]]; then
        sed "s/{{MIGRATION_ID}}/$ID/g" "$src" > "$dest"
        echo "[ONEX] Created: $(basename "$dest")"
    else
        touch "$dest"
        echo "[ONEX] Template not found, created empty: $(basename "$dest")"
    fi
}

copy_template "migration-assessment-template.md" "$ASSESSMENT"
copy_template "migration-map-template.md"        "$MAP"
copy_template "migration-progress-template.md"   "$PROGRESS"
copy_template "migration-validation-template.md" "$VALIDATION"

# ── 4. Output ──────────────────────────────────────────────────────────────────
if [[ "$JSON_MODE" == "true" ]]; then
    cat <<EOF
{"MIGRATION_ID":"$ID","BRANCH":"$BRANCH","MIGRATION_DIR":"$MIGRATION_DIR","ASSESSMENT":"$ASSESSMENT","MAP":"$MAP","PROGRESS":"$PROGRESS","VALIDATION":"$VALIDATION","TYPE":"$TYPE","TICKET":"$TICKET_KEY","HAS_GIT":$HAS_GIT}
EOF
else
    echo "MIGRATION_ID:  $ID"
    echo "BRANCH:        $BRANCH"
    echo "MIGRATION_DIR: $MIGRATION_DIR"
    echo "ASSESSMENT:    $ASSESSMENT"
    echo "MAP:           $MAP"
    echo "PROGRESS:      $PROGRESS"
    echo "VALIDATION:    $VALIDATION"
    echo "TYPE:          $TYPE"
    echo "HAS_GIT:       $HAS_GIT"
fi
