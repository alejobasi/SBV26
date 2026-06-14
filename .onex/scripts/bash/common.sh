#!/usr/bin/env bash

# Common functions for ONEX bash scripts
# Provides utilities for feature path management, Git operations, and validation

set -euo pipefail

#==============================================================================
# Git Functions
#==============================================================================

has_git() {
    command -v git >/dev/null 2>&1
}

get_repo_root() {
    if has_git && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        git rev-parse --show-toplevel
    else
        pwd
    fi
}

get_current_branch() {
    if has_git && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        git branch --show-current 2>/dev/null || echo "main"
    else
        echo "main"
    fi
}

#==============================================================================
# Feature Directory Functions
#==============================================================================

find_feature_dir_by_prefix() {
    local repo_root="$1"
    local branch_name="$2"
    local specs_dir="$repo_root/.onex/specs"
    
    # Extract numeric prefix from branch name (e.g., "001" from "001-feature-name")
    local prefix=$(echo "$branch_name" | grep -oE '^[0-9]+' || echo "")
    
    if [[ -z "$prefix" ]]; then
        # No numeric prefix - use branch name directly
        echo "$specs_dir/$branch_name"
        return
    fi
    
    # Find directories matching the prefix
    local matches=()
    if [[ -d "$specs_dir" ]]; then
        while IFS= read -r dir; do
            matches+=("$dir")
        done < <(find "$specs_dir" -maxdepth 1 -type d -name "${prefix}-*" 2>/dev/null || true)
    fi
    
    if [[ ${#matches[@]} -eq 0 ]]; then
        # No matches - return default path
        echo "$specs_dir/$branch_name"
    elif [[ ${#matches[@]} -eq 1 ]]; then
        # Single match - use it
        echo "${matches[0]}"
    else
        # Multiple matches - log warning and use first match
        echo "WARNING: Multiple spec directories found with prefix '$prefix': ${matches[*]}" >&2
        echo "Please ensure only one spec directory exists per numeric prefix." >&2
        echo "${matches[0]}"
    fi
}

get_feature_paths() {
    local repo_root=$(get_repo_root)
    local current_branch=$(get_current_branch)
    local has_git_repo="false"

    if has_git; then
        has_git_repo="true"
    fi

    local feature_dir=$(find_feature_dir_by_prefix "$repo_root" "$current_branch")

    cat <<EOF
REPO_ROOT='$repo_root'
CURRENT_BRANCH='$current_branch'
HAS_GIT='$has_git_repo'
FEATURE_DIR='$feature_dir'
FEATURE_SPEC='$feature_dir/spec.md'
IMPL_PLAN='$feature_dir/plan.md'
TASKS='$feature_dir/tasks.md'
RESEARCH='$feature_dir/research.md'
DATA_MODEL='$feature_dir/data-model.md'
QUICKSTART='$feature_dir/quickstart.md'
CONTRACTS_DIR='$feature_dir/contracts'
EOF
}

#==============================================================================
# Validation Functions
#==============================================================================

check_feature_branch() {
    local branch="$1"
    local has_git="$2"
    
    if [[ "$has_git" != "true" ]]; then
        return 0
    fi
    
    if [[ "$branch" == "main" || "$branch" == "master" ]]; then
        echo "ERROR: You are on the main/master branch." >&2
        echo "Please create a feature branch first:" >&2
        echo "  git checkout -b <feature-branch-name>" >&2
        return 1
    fi
    
    return 0
}

check_file() {
    local file="$1"
    local desc="$2"
    
    if [[ -f "$file" ]]; then
        echo "  ✓ $desc"
    else
        echo "  ✗ $desc"
    fi
}

check_dir() {
    local dir="$1"
    local desc="$2"
    
    if [[ -d "$dir" ]] && [[ -n "$(ls -A "$dir" 2>/dev/null)" ]]; then
        echo "  ✓ $desc"
    else
        echo "  ✗ $desc"
    fi
}

#==============================================================================
# Export functions for use in other scripts
#==============================================================================

export -f has_git
export -f get_repo_root
export -f get_current_branch
export -f find_feature_dir_by_prefix
export -f get_feature_paths
export -f check_feature_branch
export -f check_file
export -f check_dir
