#!/usr/bin/env bash

set -euo pipefail

JSON_MODE=false
SHORT_NAME=""
TICKET_KEY=""
SYSTEM_KIND=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json) JSON_MODE=true; shift ;;
        --short-name) SHORT_NAME="$2"; shift 2 ;;
        --ticket) TICKET_KEY="$2"; shift 2 ;;
        --system-kind) SYSTEM_KIND="$2"; shift 2 ;;
        --help|-h)
            echo "Usage: $0 --short-name <name> [--ticket <key>] [--system-kind legacy|target|hybrid] [--json]"
            exit 0 ;;
        *)
            echo "ERROR: Unknown option '$1'." >&2
            exit 1 ;;
    esac
done

if [[ -z "$SHORT_NAME" ]]; then
    echo "ERROR: --short-name is required." >&2
    exit 1
fi

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
HAS_GIT=$(has_git && echo true || echo false)

DOC_ID=$(echo "$SHORT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]/-/g; s/[^a-z0-9-]//g; s/-\+/-/g' | sed 's/^-//; s/-$//' | cut -c1-50)

if [[ -n "$TICKET_KEY" ]]; then
    BRANCH="docs/${TICKET_KEY}-${DOC_ID}"
else
    BRANCH="docs/${DOC_ID}"
fi

DOCS_ROOT="$REPO_ROOT/.onex/docs"
DOC_DIR="$DOCS_ROOT/$DOC_ID"
TEMPLATES_DIR="$REPO_ROOT/.onex/templates"

ASSESSMENT="$DOC_DIR/assessment.md"
DELIVERABLES="$DOC_DIR/deliverables-index.md"
FUNCTIONAL_DOCUMENTATION="$DOC_DIR/functional-documentation.md"
SOURCE_REVIEW="$DOC_DIR/source-review-log.md"
EVIDENCE="$DOC_DIR/evidence-index.md"
CONTEXT="$DOC_DIR/santander-context.md"
COVERAGE="$DOC_DIR/coverage-matrix.md"
DOCUMENTATION="$DOC_DIR/technical-documentation.md"
PUBLICATION_MAP="$DOC_DIR/publication-map.md"
PUBLICATION="$DOC_DIR/publication-log.md"

if [[ "$HAS_GIT" == "true" ]]; then
    if git checkout -b "$BRANCH" 2>/dev/null; then
        :
    else
        git checkout "$BRANCH" 2>/dev/null || true
    fi
fi

mkdir -p "$DOC_DIR"

copy_template() {
    local template_name="$1"
    local destination="$2"
    local source="$TEMPLATES_DIR/$template_name"

    if [[ -f "$destination" ]]; then
        return
    fi

    if [[ -f "$source" ]]; then
        sed \
            -e "s/{{DOC_ID}}/$DOC_ID/g" \
            -e "s/{{SYSTEM_KIND}}/${SYSTEM_KIND:-pending}/g" \
            "$source" > "$destination"
    else
        touch "$destination"
    fi
}

copy_template "documentation-assessment-template.md" "$ASSESSMENT"
copy_template "documentation-deliverables-template.md" "$DELIVERABLES"
copy_template "documentation-functional-template.md" "$FUNCTIONAL_DOCUMENTATION"
copy_template "documentation-source-review-template.md" "$SOURCE_REVIEW"
copy_template "documentation-evidence-template.md" "$EVIDENCE"
copy_template "documentation-context-template.md" "$CONTEXT"
copy_template "documentation-coverage-template.md" "$COVERAGE"
copy_template "documentation-technical-template.md" "$DOCUMENTATION"
copy_template "documentation-publication-map-template.md" "$PUBLICATION_MAP"
copy_template "documentation-publication-template.md" "$PUBLICATION"

if [[ "$JSON_MODE" == "true" ]]; then
    cat <<EOF
{"DOC_ID":"$DOC_ID","BRANCH":"$BRANCH","DOC_DIR":"$DOC_DIR","ASSESSMENT":"$ASSESSMENT","DELIVERABLES":"$DELIVERABLES","FUNCTIONAL_DOCUMENTATION":"$FUNCTIONAL_DOCUMENTATION","SOURCE_REVIEW":"$SOURCE_REVIEW","EVIDENCE":"$EVIDENCE","CONTEXT":"$CONTEXT","COVERAGE":"$COVERAGE","DOCUMENTATION":"$DOCUMENTATION","PUBLICATION_MAP":"$PUBLICATION_MAP","PUBLICATION":"$PUBLICATION","SYSTEM_KIND":"$SYSTEM_KIND","HAS_GIT":$HAS_GIT}
EOF
else
    echo "DOC_ID: $DOC_ID"
    echo "BRANCH: $BRANCH"
    echo "DOC_DIR: $DOC_DIR"
fi