#!/usr/bin/env bash

set -euo pipefail

JSON_MODE=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --json) JSON_MODE=true; shift ;;
        --help|-h)
            echo "Usage: $0 [--json]"
            exit 0 ;;
        *)
            echo "ERROR: Unknown option '$1'." >&2
            exit 1 ;;
    esac
done

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
HAS_GIT=$(has_git && echo true || echo false)
DOCS_ROOT="$REPO_ROOT/.onex/docs"

CURRENT_BRANCH=""
if [[ "$HAS_GIT" == "true" ]]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
fi

DOC_ID=""
if [[ "$CURRENT_BRANCH" =~ ^docs/(?:[A-Z]+-[0-9]+-)?(.+)$ ]]; then
    DOC_ID="${BASH_REMATCH[1]}"
fi

if [[ -z "$DOC_ID" && -d "$DOCS_ROOT" ]]; then
    DOC_ID=$(ls -1t "$DOCS_ROOT" 2>/dev/null | head -n1 || true)
fi

if [[ -z "$DOC_ID" ]]; then
    echo "ERROR: No documentation context found. Run /onex.doc.assess first." >&2
    exit 1
fi

DOC_DIR="$DOCS_ROOT/$DOC_ID"
mkdir -p "$DOC_DIR"

if [[ "$JSON_MODE" == "true" ]]; then
    cat <<EOF
{"DOC_ID":"$DOC_ID","BRANCH":"$CURRENT_BRANCH","DOC_DIR":"$DOC_DIR","ASSESSMENT":"$DOC_DIR/assessment.md","DELIVERABLES":"$DOC_DIR/deliverables-index.md","FUNCTIONAL_DOCUMENTATION":"$DOC_DIR/functional-documentation.md","SOURCE_REVIEW":"$DOC_DIR/source-review-log.md","EVIDENCE":"$DOC_DIR/evidence-index.md","CONTEXT":"$DOC_DIR/santander-context.md","COVERAGE":"$DOC_DIR/coverage-matrix.md","DOCUMENTATION":"$DOC_DIR/technical-documentation.md","PUBLICATION_MAP":"$DOC_DIR/publication-map.md","PUBLICATION":"$DOC_DIR/publication-log.md","REPO_ROOT":"$REPO_ROOT","HAS_GIT":$HAS_GIT}
EOF
else
    echo "DOC_ID: $DOC_ID"
    echo "DOC_DIR: $DOC_DIR"
fi